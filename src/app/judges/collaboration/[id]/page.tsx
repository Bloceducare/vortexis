"use client";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { DiscussionDashboard } from "@/components/DiscussionDashboard";
import { CommunicationsAPI } from "@/lib/communications";
import { useAuth } from "@/hooks/useAuth";
import { useSubmissionReview } from "@/hooks/useSubmissionReview";
import { ChevronDown, MessageCircle, Users, CheckCircle } from "lucide-react";

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
  {
    name: "Final Decision",
    tab_no: 3,
    icon: <CheckCircle className="w-4 h-4" />,
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
  const [organizerError, setOrganizerError] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  const params = useParams();
  const hackathonId = params.id as string;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, userId, isAuthenticated } = useAuth();

  // Fetch hackathon details to get the real name
  const { hackathonDetails, loading: hackathonLoading } =
    useSubmissionReview(hackathonId);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://spicy-cheri-web3bridge-bc3db9dc.koyeb.app/api/v1";

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
    if (!api || !hackathonId || hasInitialized.current) {
      console.log("Skipping initialization:", {
        api: !!api,
        hackathonId,
        hasInitialized: hasInitialized.current,
      });
      return;
    }

    console.log("Initializing conversations for hackathon:", hackathonId);
    setIsLoading(true);
    setError(null);
    hasInitialized.current = true;

    try {
      // First, check existing conversations (ONE HTTP call)
      const existingConversations = await api.getConversations();

      // Look for existing judges conversation for this hackathon
      const existingConv = existingConversations.find(
        (conv) =>
          conv.type === "judges" &&
          (conv.hackathon_id === parseInt(hackathonId) ||
            conv.hackathon === parseInt(hackathonId))
      );

      let judgesConv;

      if (existingConv) {
        console.log(
          `Found existing conversation for hackathon ${hackathonId}:`,
          existingConv
        );
        // Check if user is already a participant
        const participants = existingConv.participants || [];
        const userIsParticipant = Array.isArray(participants)
          ? participants.some(
              (p: any) => (typeof p === "object" ? p.user : p) === userId
            )
          : false;

        if (userIsParticipant) {
          // User is already a participant, use existing conversation
          judgesConv = existingConv;
        } else {
          // User not in participants, call createOrFind to add them (ONE more HTTP call)
          console.log(`User not in participants, ensuring they're added...`);
          judgesConv = await api.createOrFindJudgesConversation(
            parseInt(hackathonId)
          );
        }
      } else {
        // No existing conversation, create one (ONE HTTP call)
        console.log(
          `Creating new judges conversation for hackathon ${hackathonId}...`
        );
        judgesConv = await api.createOrFindJudgesConversation(
          parseInt(hackathonId)
        );
      }

      if (!judgesConv || !judgesConv.id) {
        throw new Error(
          "Failed to create/find judges conversation - no ID returned"
        );
      }

      console.log(
        `Using conversation ${judgesConv.id} for hackathon ${hackathonId}`
      );
      console.log(`Participants:`, judgesConv.participants);
      console.log(`Current user ID:`, userId);

      setJudgesConversationId(judgesConv.id);

      // Don't try to initialize organizer conversation for judges
      // Leave it empty - it will show an error when accessed
      setOrganizerError(
        "Organizer discussions are only accessible to organizers and organization members."
      );
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to initialize conversations:", err);

      // Check if it's a permission error
      if (err instanceof Error && err.message.includes("Not authorized")) {
        setError(
          "You don't have permission to create judges conversations. Please contact an administrator or try joining an existing conversation."
        );

        // Try to create a regular conversation as fallback
        try {
          console.log(
            "Attempting to create regular conversation as fallback..."
          );
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
  }, [api, userId, hackathonId]);

  // Auto-load existing conversations when authenticated - reset for each hackathon
  useEffect(() => {
    if (isAuthenticated && api && hackathonId) {
      // Reset conversation IDs and initialization state when hackathon changes
      setJudgesConversationId("");
      setOrganizersConversationId("");
      setError(null);
      hasInitialized.current = false;

      // Small delay to ensure state is reset before initializing
      const timeout = setTimeout(() => {
        initializeConversations();
      }, 100);

      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, hackathonId]);

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

  const hackathonName = hackathonDetails?.title || `Hackathon #${hackathonId}`;

  return (
    <div>
      <div className="my-3 mb-8">
        <h1 className="text-2xl mb-3 font-semibold text-[#605DEC]">
          Judge Collaboration
        </h1>
        <p>
          Collaborate with other judges and discuss submissions for{" "}
          {hackathonName}
        </p>
      </div>

      <div className="bg-[#FFFFFF] my-3 shadow-md rounded-md border p-3 w-full max-w-[1114px] border-[#E4E4E4]">
        <div>
          {/* Desktop Tabs - Hidden on mobile */}
          <div className="hidden md:flex my-6 mt-1.5 md:w-[645px] w-full cursor-pointer gap-4">
            {tabs.map((tab, i) => {
              return (
                <div
                  key={i}
                  className="w-[203px]"
                  onClick={() => handleTabChange(tab.tab_no)}
                >
                  <p
                    className={`flex items-center justify-center gap-2 text-center px-5 py-2 ${
                      activeTab === tab.tab_no
                        ? "bg-[#605DEC] text-white"
                        : "bg-[#F4F3FE] text-[#C5C0DB]"
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
              <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-md shadow-lg mt-1">
                {tabs.map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => handleTabChange(tab.tab_no)}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 ${
                      activeTab === tab.tab_no
                        ? "bg-[#F4F3FE] text-[#605DEC] font-medium"
                        : "text-gray-700"
                    } ${i === 0 ? "rounded-t-md" : ""} ${
                      i === tabs.length - 1
                        ? "rounded-b-md"
                        : "border-b border-gray-100"
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
            <div className="h-[600px]">
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
            <div className="h-[600px]">
              {organizerError || !organizersConversationId ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md">
                    <div className="mb-4 text-6xl">🔒</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Access Restricted
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {organizerError ||
                        "Organizer discussions are only accessible to organizers and organization members."}
                    </p>
                    <p className="text-sm text-gray-500">
                      If you believe you should have access, please contact an
                      administrator.
                    </p>
                  </div>
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#605DEC] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading conversations...</p>
                  </div>
                </div>
              ) : (
                <DiscussionDashboard
                  baseUrl={baseUrl}
                  token={token!}
                  userId={userId!}
                  conversationId={organizersConversationId}
                  conversationType="judges"
                  onConversationChange={setOrganizersConversationId}
                />
              )}
            </div>
          )}

          {activeTab === 3 && (
            <div className="p-6">
              <div className="bg-[#DAE0DE3D] md:w-[1088px] px-4 py-1.5 mb-8 rounded-3xl border-l-24 pl-6 border-l-[#605DEC]">
                <div className="flex justify-between mb-3 px-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-[#212121] h-6" />
                    <p className="">Final Decision Room</p>
                  </div>
                  <p>{new Date().toLocaleTimeString()}</p>
                </div>
                <p>
                  Review the collective scores and make final recommendations
                  for the winners. All judges must submit their final
                  recommendations by May 15th.
                </p>
              </div>

              <div className="md:w-[1083px] space-y-6">
                <div className="border border-[#E4E4E4] rounded-lg bg-white py-8 px-4 space-y-1.5">
                  <div className="border-b-2 flex justify-between border-[#535353] pb-4">
                    <div className="flex gap-4 items-center">
                      <p className="bg-[#727272] px-1 h-6 text-center py-1 rounded-full text-xs">
                        Rank#1
                      </p>
                      <p className="text-2xl font-bold">BlockChain Vote</p>
                    </div>
                    <p className="font-bold">8.7</p>
                  </div>
                  <div className="pl-5">
                    <p className="text-xl font-[600] mb-5">Judge Scores</p>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex justify-between w-[408px]">
                        <p>Jane Doe</p> <p>9.4</p>
                      </div>
                      <div className="flex justify-between w-[565px]">
                        <p className="-ms-10">Maria Rodriguez</p>
                        <p className="ms-auto">8.5</p>
                      </div>
                    </div>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex justify-between w-[408px]">
                        <p>Alex Smith</p> <p>8.4</p>
                      </div>
                    </div>
                    <div className="w-[627px] mt-3">
                      <p className="text-2xl mb-1">Summary Comments</p>
                      <p>
                        Innovative solution with strong technical
                        implementation. UI could use some polish.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
