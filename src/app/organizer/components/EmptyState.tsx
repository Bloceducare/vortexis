"use client";
import React, { useState } from "react";
import Image from "next/image";
import Plane from "@/public/assets/PlaneCircle.svg";
import NewOrganization from "./NewOrganization";

function EmptyState() {
  const [showNewOrg, setShowNewOrg] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center relative">
      <div className="mb-6">
        <Image
          src={Plane}
          alt="Rocket illustration"
          width={120}
          height={120}
          className="mx-auto"
        />
      </div>

      <h2 className="text-2xl font-semibold text-gray-800">
        Welcome to your Organizer Dashboard
      </h2>

      <p className="text-[#7D7D7D] mt-2 max-w-md">
        You’re all set to start creating amazing hackathons! Set up your first
        organization to manage events, teams, and participants—all in one place.
      </p>

      <button
        onClick={() => setShowNewOrg(true)}
        className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-medium transition-all cursor-pointer"
      >
        + Create My First Organization
      </button>

      {showNewOrg && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-lg relative">
            <NewOrganization onClose={() => setShowNewOrg(false)} type="new" />
          </div>
        </div>
      )}
    </div>
  );
}

export default EmptyState;

