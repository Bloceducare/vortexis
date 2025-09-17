import React from 'react'
import { Judge, ReactQueryState } from '@/app/api/utils/interface';
import { useRouter } from 'next/navigation';

interface JudgesListProps extends ReactQueryState {
  judges: Judge[] | undefined;
}



const JudgesList: React.FC<JudgesListProps> = ({
  judges = [],
  isLoading,
  isFetching,
  isError,
  refetch
}) => {
  if (isLoading) {
    return <div className="text-center py-10">Loading judges...</div>;
  }
  const router = useRouter()

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        <p>Error loading judges. Please try again.</p>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!judges || judges.length === 0) {
    return <div className="text-center text-gray-500 py-10">No judges available.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow relative">
      {isFetching && (
        <div className="absolute top-0 right-0 m-2 text-xs text-gray-400">Refreshing...</div>
      )}
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-6 py-3">#</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className='px-6 py-3'>Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {judges.map((judge, index) => (
            <tr key={judge.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">{index + 1}</td>
              <td className="px-6 py-4">{judge.first_name} {judge.last_name || ''}</td>
              <td className="px-6 py-4">{judge.email}</td>
              <td className='px-6 py-4'>
                <button className='underline cursor-pointer' onClick={() => router.push(`/profile/${judge.id}`)}>View Profile</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JudgesList;