"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import useTeams from "@/hooks/useTeams";

interface CreateTeamProps {
    onClose: () => void;
  hackathon_id: string;
}

export default function CreateTeam({ onClose, hackathon_id }: CreateTeamProps) {
  const [formData, setFormData] = useState({
    name: "",
    members: [] as string[],
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "members") {
      setFormData((prev) => ({
        ...prev,
        members: value.split(",").map((m) => m.trim()).filter(Boolean),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
      <h2 className="font-bold mb-4">Create a Team</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Team Name"
        />
        <Input
          name="members"
          value={formData.members.join(", ")}
          onChange={handleChange}
          placeholder="Members (comma separated emails)"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
