"use client";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DiscussionDashboard } from "@/components/DiscussionDashboard";
import { CommunicationsAPI } from "@/lib/communications";
import { useAuth } from "@/hooks/useAuth";
import { ChevronDown, MessageCircle, Users } from "lucide-react";

const tabs = [
  {
    name: "Judge-Only Room",
    tab_no: 1,
    icon: <MessageCircle className="w-4 h-4" />,
  },
  {
    name: "Organizer Discussion",
    tab_no: 2,
    icon: <Users className="w-4 h-4" />,
  },
];

function CollaborationPageContent() {
  const [activeTab, setActiveTab] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [judgesConversationId, setJudgesConversationId] = useState<string>("");
  const [organizersConversationId, setOrganizersConversationId] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, userId, isAuthenticated } = useAuth();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://spicy-cheri-web3bridge-bc3db9dc.koyeb.app/api/v1";

  // Debug token (disabled to reduce console spam)
  // console.log("Collaboration Page Debug:", {
  //   token: token ? `${token.substring(0, 20)}...` : "NO TOKEN",
  //   userId,
  //   baseUrl,
  //   isAuthenticated,
  // });

  // Ensure we have a valid token before creating API instance - memoized to prevent recreation
  const api = useMemo(
    () =>
      token && userId && isAuthenticated
        ? new CommunicationsAPI({ baseUrl, token, userId })
        : null,
    [token, userId, isAuthenticated, baseUrl]
  );

  const handleTabChange = (tabNo: number) => {
    setActiveTab(tabNo);
    setIsDropdownOpen(false);
    router.replace(`?tab=${tabNo}`, { scroll: false });
  };

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) setActiveTab(Number(tabParam));
  }, [searchParams]);

  // Auto-load existing conversations when authenticated
  const initializeConversations = useCallback(async () => {
    if (!api) return;

    setIsLoading(true);
    setError(null);

    try {
      // First, try to get existing conversations
      const existingConversations = await api.getConversations();
      // console.log("Existing conversations:", existingConversations); // Disabled to reduce console spam

      // Look for any existing conversation (judges, team, or dm)
      const existingConv = existingConversations.find(
        (conv) =>
          conv.type === "judges" || conv.type === "team" || conv.type === "dm"
      );

      if (existingConv) {
        // console.log("Found existing conversation:", existingConv); // Disabled to reduce console spam
        setJudgesConversationId(existingConv.id);
        setOrganizersConversationId(existingConv.id);
        return;
      }

      // If no existing conversation, try to create one
      const judgesConv = await api.createOrFindJudgesConversation(1);
      setJudgesConversationId(judgesConv.id);
      setOrganizersConversationId(judgesConv.id);
    } catch (err) {
      console.error("Failed to initialize conversations:", err);

      // Check if it's a permission error
      if (err instanceof Error && err.message.includes("Not authorized")) {
        setError(
          "You don't have permission to create judges conversations. Please contact an administrator or try joining an existing conversation."
        );

        // Try to create a regular conversation as fallback
        try {
          const regularConv = await api.createOrFindDM(userId!); // Create DM with self as fallback
          if (regularConv) {
            setJudgesConversationId(regularConv.id);
            setOrganizersConversationId(regularConv.id);
            setError(null); // Clear error if fallback works
          }
        } catch (fallbackErr) {
          console.error(
            "Fallback conversation creation also failed:",
            fallbackErr
          );
        }
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to initialize conversations"
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [api, userId]);

  // Auto-load existing conversations when authenticated - only once
  useEffect(() => {
    if (
      isAuthenticated &&
      api &&
      !hasInitialized.current &&
      judgesConversationId === "" &&
      organizersConversationId === ""
    ) {
      hasInitialized.current = true;
      initializeConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const activeTabName = tabs.find((tab) => tab.tab_no === activeTab)?.name;

  if (!isAuthenticated || !token || !userId) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-600 mb-4">
            Please sign in to access judge collaboration
          </p>
          <div className="text-sm text-gray-500 mb-4">
            Debug: {!isAuthenticated ? "Not authenticated" : ""}
            {!token ? " | No token" : ""}
            {!userId ? " | No user ID" : ""}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#605DEC] mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up collaboration rooms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="my-3 mb-8">
        <h1 className="text-2xl mb-3 font-semibold text-[#605DEC]">
          Judge Collaboration
        </h1>
        <p className="dark:text-gray-300">
          Collaborate with other judges and discuss submissions
        </p>
      </div>

      <div className="bg-[#FFFFFF] dark:bg-gray-800 my-3 shadow-md rounded-md border p-3 w-full max-w-[1400px] border-[#E4E4E4] dark:border-gray-700 transition-colors">
        <div>
          {/* Desktop Tabs - Hidden on mobile */}
          <div className="hidden md:flex my-6 mt-1.5 w-full cursor-pointer gap-4">
            {tabs.map((tab, i) => {
              return (
                <div
                  key={i}
                  className="flex-1 max-w-[300px]"
                  onClick={() => handleTabChange(tab.tab_no)}
                >
                  <p
                    className={`flex items-center justify-center gap-2 text-center px-5 py-2 ${
                      activeTab === tab.tab_no
                        ? "bg-[#605DEC] text-white"
                        : "bg-[#F4F3FE] dark:bg-gray-700 text-[#C5C0DB] dark:text-gray-300"
                    } transition-all duration-300 rounded-md`}
                  >
                    {tab.icon}
                    {tab.name}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mobile Dropdown - Hidden on desktop */}
          <div className="md:hidden my-6 mt-1.5 relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#605DEC] text-white rounded-md"
            >
              <span className="flex items-center gap-2">
                {tabs.find((tab) => tab.tab_no === activeTab)?.icon}
                {activeTabName}
              </span>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg mt-1">
                {tabs.map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => handleTabChange(tab.tab_no)}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      activeTab === tab.tab_no
                        ? "bg-[#F4F3FE] dark:bg-gray-700 text-[#605DEC] dark:text-indigo-400 font-medium"
                        : "text-gray-700 dark:text-gray-300"
                    } ${i === 0 ? "rounded-t-md" : ""} ${
                      i === tabs.length - 1
                        ? "rounded-b-md"
                        : "border-b border-gray-100 dark:border-gray-700"
                    }`}
                  >
                    {tab.icon}
                    {tab.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {activeTab === 1 && (
            <div className="h-[600px] w-full">
              {judgesConversationId ? (
                <DiscussionDashboard
                  baseUrl={baseUrl}
                  token={token!}
                  userId={userId!}
                  conversationId={judgesConversationId}
                  conversationType="judges"
                  onConversationChange={setJudgesConversationId}
                />
              ) : isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#605DEC] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading conversations...</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Conversations Found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      No existing conversations available. You may need
                      permission to create new ones.
                    </p>
                    {error && (
                      <p className="text-red-600 text-sm mb-4">{error}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 2 && (
            <div className="h-[600px] w-full">
              {organizersConversationId ? (
                <DiscussionDashboard
                  baseUrl={baseUrl}
                  token={token!}
                  userId={userId!}
                  conversationId={organizersConversationId}
                  conversationType="judges"
                  onConversationChange={setOrganizersConversationId}
                />
              ) : isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#605DEC] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading conversations...</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Conversations Found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      No existing conversations available. You may need
                      permission to create new ones.
                    </p>
                    {error && (
                      <p className="text-red-600 text-sm mb-4">{error}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CollaborationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CollaborationPageContent />
    </Suspense>
  );
}
