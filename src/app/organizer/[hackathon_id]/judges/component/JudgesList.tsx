import React from "react";
import { Judge, ReactQueryState } from "@/app/api/utils/interface";
import { useRouter } from "next/navigation";

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
  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-600 dark:text-gray-400">
        Loading judges...
      </div>
    );
  }
  const router = useRouter();

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

  return (
    <div className="overflow-x-auto rounded-lg shadow relative">
      {isFetching && (
        <div className="absolute top-0 right-0 m-2 text-xs text-gray-400">
          Refreshing...
        </div>
      )}
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-xs transition-colors">
          <tr>
            <th className="px-6 py-3">#</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {judges.map((judge, index) => (
            <tr
              key={judge.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                {index + 1}
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                {judge.first_name} {judge.last_name || ""}
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                {judge.email}
              </td>
              <td className="px-6 py-4">
                <button
                  className="underline cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  onClick={() => router.push(`/profile/${judge.id}`)}
                >
                  View Profile
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JudgesList;
