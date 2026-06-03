import React from "react";
import { Judge, ReactQueryState, User } from "@/app/api/utils/interface";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { slugify } from "@/lib/utils";

interface JudgesListProps extends ReactQueryState {
  judges: Judge[] | undefined;
}

const JudgesList: React.FC<JudgesListProps> = ({
  judges = [],
  isLoading,
  isFetching,
  isError,
  refetch,
}) => {

  const getInitials = (first = "", last = "") =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();

const avatarColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
];

const getAvatarColor = (id: number) =>
  avatarColors[id % avatarColors.length];





  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-600 dark:text-gray-400">
        Loading judges...
      </div>
    );
  }
  const router = useRouter();
   const setclickedUser = useUserStore((state) => state.setclickedUser)

  if (isError) {
    return (
      <div className="text-center text-red-500 dark:text-red-400 py-10">
        <p>Error loading judges. Please try again.</p>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded cursor-pointer hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!judges || judges.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        No judges available.
      </div>
    );
  }

    const viewProfiles = (user:any) => {
      setclickedUser(user)
      const slug = slugify(user.first_name)
      router.push(`/profile/${slug}`)
    }

  return (
   <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {judges.map((judge) => (
    <div
      key={judge.id}
      className="rounded-xl border border-gray-200 dark:border-gray-700 
                 bg-white dark:bg-gray-800 p-5 shadow-sm 
                 hover:shadow-md transition"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        {judge.profile?.profile_picture ? (
          <img
            src={judge.profile.profile_picture}
            alt={judge.username}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div
            className={`h-12 w-12 rounded-full flex items-center 
                        justify-center text-white font-bold 
                        ${getAvatarColor(judge.id)}`}
          >
            {getInitials(judge.first_name, judge.last_name)}
          </div>
        )}

        {/* Name */}
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {judge.first_name} {judge.last_name}
          </p>
          <p className="text-xs text-gray-500">@{judge.username}</p>
        </div>
      </div>

      {/* Hackathons */}
      <div className="mt-4">
          <p className="text-xs text-gray-400">
             Assigned to this Hackathon
          </p>
      </div>

      {/* Action */}
      <button
        onClick={() => viewProfiles(judge)}
        className="mt-4 inline-flex items-center gap-1 cursor-pointer
                   text-sm text-blue-600 hover:underline"
      >
        View Profile <ExternalLink size={14} />
      </button>
    </div>
  ))}
</div>

  );
};

export default JudgesList;
