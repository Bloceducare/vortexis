import { Submission } from "@/hooks/useHackathonDetails";
import Image from "next/image";
import { useEffect, useState } from "react";

interface TeamMember {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  profile_picture?: string;
}

interface TeamDetails {
  id: number;
  name: string;
  members: TeamMember[];
}

function Members({ items }: { items: Submission }) {
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (!items?.team?.id) {
        setError("No team ID found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const bearerToken = localStorage.getItem("access_token");
        if (!bearerToken) {
          setError("No access token found");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/team/teams/${items.team.id}/details/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData?.message ||
              errorData?.detail ||
              `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("Team details response:", data);

        // Handle different possible response structures
        // If the response directly contains members array, use it
        // Otherwise, check if it's nested or has a different structure
        if (data && Array.isArray(data.members)) {
          setTeamDetails(data);
        } else if (data && Array.isArray(data)) {
          // If the response is directly an array (of members or teams)
          setTeamDetails({
            id: items.team.id,
            name: items.team.name || "Team",
            members: data,
          });
        } else {
          // Try to extract members from the response
          setTeamDetails({
            id: data.id || items.team.id,
            name: data.name || items.team.name || "Team",
            members: data.members || [],
          });
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred while fetching team details";
        setError(errorMessage);
        console.error("Error fetching team details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [items?.team?.id]);

  if (loading) {
    return (
      <div>
        <p className="text-[#1C1D1D] dark:text-white text-xl font-medium">Team Members</p>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#605DEC] dark:border-indigo-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="text-[#1C1D1D] dark:text-white text-xl font-medium">Team Members</p>
        <p className="text-red-500 dark:text-red-400 mt-4">Error: {error}</p>
      </div>
    );
  }

  if (
    !teamDetails ||
    !teamDetails.members ||
    teamDetails.members.length === 0
  ) {
    return (
      <div>
        <p className="text-[#1C1D1D] dark:text-white text-xl font-medium">Team Members</p>
        <p className="text-gray-500 dark:text-gray-400 mt-4">No team members found.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[#1C1D1D] dark:text-white text-xl font-medium">Team Members</p>

      <div className="flex flex-col md:w-[770px] gap-3 mt-4">
        {teamDetails.members.map((member) => {
          const displayName =
            member.first_name && member.last_name
              ? `${member.first_name} ${member.last_name}`
              : member.username || "Unknown";

          // Generate initials from display name
          const getInitials = (name: string) => {
            const parts = name.trim().split(" ");
            if (parts.length >= 2) {
              return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            }
            return name.substring(0, 2).toUpperCase() || "?";
          };

          const initials = getInitials(displayName);

          // Generate consistent color based on name
          const bgColors = [
            "bg-red-500",
            "bg-blue-500",
            "bg-green-500",
            "bg-yellow-500",
            "bg-purple-500",
            "bg-pink-500",
            "bg-indigo-500",
            "bg-teal-500",
            "bg-orange-500",
            "bg-cyan-500",
          ];

          const getColorIndex = (name: string) => {
            let hash = 0;
            for (let i = 0; i < name.length; i++) {
              hash = name.charCodeAt(i) + ((hash << 5) - hash);
            }
            return Math.abs(hash) % bgColors.length;
          };

          const avatarColor = bgColors[getColorIndex(displayName)];

          return (
            <div
              key={member.id}
              className="py-1 px-2 flex border-2 items-center border-[#605DEC] dark:border-indigo-400 rounded-xl text-[#605DEC] dark:text-indigo-400 bg-white dark:bg-gray-800 transition-colors gap-4"
            >
              {member.profile_picture ? (
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src={member.profile_picture}
                    alt={displayName}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-cover rounded-full border-2 border-white shadow-sm"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const img = e.currentTarget;
                      const fallback = img.nextElementSibling as HTMLElement;
                      if (img && fallback) {
                        img.style.display = "none";
                        fallback.classList.remove("hidden");
                        fallback.classList.add("flex");
                      }
                    }}
                  />
                  <div
                    className={`hidden w-10 h-10 rounded-full items-center justify-center text-white font-semibold text-sm ${avatarColor} border-2 border-white shadow-sm`}
                  >
                    {initials}
                  </div>
                </div>
              ) : (
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${avatarColor} border-2 border-white shadow-sm flex-shrink-0`}
                >
                  {initials}
                </div>
              )}
              <div>
                <p className="font-bold dark:text-white">{displayName}</p>
                <p className="text-sm dark:text-gray-300">{member.role || "Team Member"}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Members;
