export const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 animate-pulse">
      <div className="bg-gray-200 dark:bg-gray-700 h-48" />
      <div className="p-5 space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        </div>
        <div className="flex justify-between pt-3">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );