import React from 'react'

function TableSkeleton() {
  return (
    <div className="p-6 bg-white rounded-xl shadow h-screen">
    {/* Header */}
    <div className="mb-6">
      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
      <div className="h-4 w-72 bg-gray-200 rounded animate-pulse"></div>
    </div>

    {/* Table Head */}
    <div className="grid grid-cols-6 gap-4 border-b pb-2">
      {["Name", "Team", "Phone Number", "Email", "Country", "Status"].map(
        (heading, i) => (
          <div key={i} className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        )
      )}
    </div>

    {/* Table Rows Skeleton */}
    {Array.from({ length: 5 }).map((_, idx) => (
      <div
        key={idx}
        className="grid grid-cols-6 gap-4 py-3 border-b last:border-b-0"
      >
        {Array.from({ length: 6 }).map((__, i) => (
          <div
            key={i}
            className="h-4 w-full bg-gray-200 rounded animate-pulse"
          ></div>
        ))}
      </div>
    ))}

    {/* Footer */}
    <div className="flex justify-between items-center mt-4">
      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
      <div className="flex gap-2">
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
  )
}

export default TableSkeleton