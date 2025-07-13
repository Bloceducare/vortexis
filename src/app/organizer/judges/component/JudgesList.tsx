import React from 'react'

const judges = [
  {
    id: 1,
    name: 'Dr. John Doe',
    email: 'john.doe@example.com',
  },
  {
    id: 2,
    name: 'Ms. Jane Smith',
    email: 'jane.smith@example.com',
  },
  {
    id: 3,
    name: 'Prof. Michael Brown',
    email: 'michael.brown@example.com',
  },
]

const JudgesList = () => {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-6 py-3">#</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {judges.map((judge, index) => (
            <tr key={judge.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">{index + 1}</td>
              <td className="px-6 py-4">{judge.name}</td>
              <td className="px-6 py-4">{judge.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default JudgesList
