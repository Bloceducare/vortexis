'use client';

import React, { useState } from "react";
import { X, Save } from "lucide-react";
import StatusModal from "@/components/StatusModal";
import useOrganizer from "@/hooks/useOrganizers";
import { useQueryClient } from "@tanstack/react-query";

interface EditHackathonModalProps {
  onClose: () => void;
  hackathonId: string;
  currentData: {
    title?: string;
    grand_prize?: number;
    venue?: string;
    min_team_size?: number;
    max_team_size?: number;
    submission_deadline?: string;
    end_date?: string;
    visibility?: boolean; // ✅ boolean type
  };
}

function EditHackathonModal({
  onClose,
  hackathonId,
  currentData,
}: EditHackathonModalProps) {
  const { updateHackathonMutation } = useOrganizer();
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    title: currentData?.title || "",
    grand_prize: currentData?.grand_prize || 0,
    venue: currentData?.venue || "",
    min_team_size: currentData?.min_team_size || 1,
    max_team_size: currentData?.max_team_size || 10,
    submission_deadline: currentData?.submission_deadline
      ? new Date(currentData.submission_deadline).toISOString().split("T")[0]
      : "",
    end_date: currentData?.end_date
      ? new Date(currentData.end_date).toISOString().split("T")[0]
      : "",
      visibility:
      currentData?.visibility === true
        ? "true"
        : currentData?.visibility === false
        ? "false"
        : "true",
  });

  const [modal, setModal] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
    title?: string;
  }>({
    open: false,
    type: "success",
    message: "",
    title: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "visibility"
          ? value === "true" // ✅ Convert string back to boolean
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const getChangedFields = () => {
    const changes: any = {};

    if (formData.title !== currentData.title) changes.title = formData.title;
    if (formData.grand_prize !== currentData.grand_prize)
      changes.grand_prize = formData.grand_prize;
    if (formData.venue !== currentData.venue) changes.venue = formData.venue;
    if (formData.min_team_size !== currentData.min_team_size)
      changes.min_team_size = formData.min_team_size;
    if (formData.max_team_size !== currentData.max_team_size)
      changes.max_team_size = formData.max_team_size;

    const currentSubmissionDeadline = currentData.submission_deadline
      ? new Date(currentData.submission_deadline).toISOString().split("T")[0]
      : "";
    if (formData.submission_deadline !== currentSubmissionDeadline)
      changes.submission_deadline = formData.submission_deadline;

    const currentEndDate = currentData.end_date
      ? new Date(currentData.end_date).toISOString().split("T")[0]
      : "";
    if (formData.end_date !== currentEndDate)
      changes.end_date = formData.end_date;

    if ((formData.visibility === "true") !== currentData.visibility)
      changes.visibility = formData.visibility;

    return changes;
  };

  const handleSave = async () => {
    const changedFields = getChangedFields();

    if (Object.keys(changedFields).length === 0) {
      setModal({
        open: true,
        type: "error",
        title: "No Changes",
        message: "No changes were made to update.",
      });
      return;
    }

    if (formData.min_team_size > formData.max_team_size) {
      setModal({
        open: true,
        type: "error",
        title: "Validation Error",
        message: "Minimum team size cannot be greater than maximum team size.",
      });
      return;
    }

    if (
      formData.submission_deadline &&
      formData.end_date &&
      new Date(formData.submission_deadline) > new Date(formData.end_date)
    ) {
      setModal({
        open: true,
        type: "error",
        title: "Validation Error",
        message: "Submission deadline cannot be after the end date.",
      });
      return;
    }

    try {
      await updateHackathonMutation.mutateAsync({
        hackathonId,
        data: changedFields,
      });

      setModal({
        open: true,
        type: "success",
        title: "Update Successful",
        message: "Hackathon details have been updated successfully.",
      });


      queryClient.invalidateQueries({queryKey: ['organizer_hackathon_byId', hackathonId]})

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setModal({
        open: true,
        type: "error",
        title: "Update Failed",
        message: err?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/30 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white backdrop-blur-lg border border-white/40 shadow-2xl rounded-2xl w-full max-w-2xl p-6 relative animate-scaleIn max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-5 sticky top-0 bg-white pb-3 border-b">
          <h1 className="text-[#171717] text-2xl font-semibold">
            Edit Hackathon Details
          </h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Grand Prize */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Grand Prize (₦)
            </label>
            <input
              type="number"
              name="grand_prize"
              value={formData.grand_prize}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Venue */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Venue
            </label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Visibility
            </label>
            <select
  name="visibility"
  value={formData.visibility}
  onChange={(e) =>
    setFormData((prev) => ({ ...prev, visibility: e.target.value }))
  }
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
>
  <option value="true">Public</option>
  <option value="false">Private</option>
</select>

          </div>

          {/* Team Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Min Team Size
              </label>
              <input
                type="number"
                name="min_team_size"
                value={formData.min_team_size}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Max Team Size
              </label>
              <input
                type="number"
                name="max_team_size"
                value={formData.max_team_size}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Submission Deadline
              </label>
              <input
                type="date"
                name="submission_deadline"
                value={formData.submission_deadline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6 sticky bottom-0 bg-white pt-3 border-t">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updateHackathonMutation.isPending}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {updateHackathonMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <StatusModal
        isOpen={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        type={modal.type}
        message={modal.message}
      />


<style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      
    </div>
  );
}

export default EditHackathonModal;
