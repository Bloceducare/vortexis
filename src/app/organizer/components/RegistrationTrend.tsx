import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid
} from "recharts";

const data = [
  { date: "May 10", blue: 2, red: 5 },
  { date: "May 11", blue: 4, red: 6 },
  { date: "May 12", blue: 8, red: 9 },
  { date: "May 13", blue: 22, red: 7 },
  { date: "May 14", blue: 15, red: 3 },
  { date: "May 15", blue: 10, red: 5 },
  { date: "May 16", blue: 5, red: 2 },
];

const RegistrationTrend: React.FC = () => {
  const [view, setView] = useState("Daily");

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-indigo-700">Analytics Overview</h2>
          <p className="text-sm text-indigo-400">Performance metrics for your hackathons</p>
          <h3 className="text-xl font-bold mt-2">📈 Registration Trend</h3>
        </div>
        <select
          className="border rounded px-2 py-1 text-sm text-gray-600"
          value={view}
          onChange={(e) => setView(e.target.value)}
        >
          <option>Daily</option>
          <option>Weekly</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
  <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
    <defs>
      <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
      </linearGradient>
    </defs>

    {/* ✅ Custom grid: only horizontal, blue, solid */}
    <CartesianGrid
      stroke="#3b82f6"
      strokeDasharray="0" 
      horizontal={true}
      vertical={false}
    />

    <XAxis dataKey="date" axisLine={false} tickLine={false} />
    <YAxis axisLine={false} tickLine={false} />

    <Tooltip
      contentStyle={{ borderRadius: "10px", borderColor: "#e5e7eb" }}
      formatter={(value: number) => [`Participants: ${value}`, ""]}
      cursor={{
        stroke: "#3b82f6",
        strokeWidth: 2,
      }}
    />

    <Area
      type="monotone"
      dataKey="blue"
      stroke="#3b82f6"
      strokeWidth={3}
      fillOpacity={1}
      fill="url(#colorBlue)"
    />
    <Area
      type="monotone"
      dataKey="red"
      stroke="#ef4444"
      strokeWidth={3}
      fillOpacity={1}
      fill="url(#colorRed)"
    />
  </AreaChart>
</ResponsiveContainer>
    </div>
  );
};

export default RegistrationTrend;