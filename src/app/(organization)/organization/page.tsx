"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useOrganizer from "@/hooks/useOrganizers";
import { useUserStore } from "@/store/useUserStore";

interface Organization {
  id: string;
  name: string;
  moderators: string[];
  description?: string;
}

export default function OrganizationPage() {
  const { user } = useUserStore();
  const username = user?.username; 
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState<Organization | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<
    Organization | null
  >(null);

  const { createOrganization, getAllOrganization, updateOrganization, deleteOrganizationMutation } = useOrganizer();
  const { data, isLoading, isError } = getAllOrganization;

  const [newOrg, setNewOrg] = useState({
    name: "",
    description: "",
    moderators: [] as string[],
  });

  const [search, setSearch] = useState("");

  // ✅ Modal for responses
  const [responseModal, setResponseModal] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleAddOrganization = async () => {
    if (!newOrg.name.trim()) return;
  

    try {
      const res = await createOrganization.mutateAsync({
        name: newOrg.name,
        description: newOrg.description,
      });

 

      setResponseModal({
        type: "success",
        message: `Organization "${newOrg.name}" created successfully!`,
      });
    } catch (err: any) {
      setResponseModal({
        type: "error",
        message: err.message || "Failed to create organization.",
      });
    }

    setNewOrg({ name: "", description: "", moderators: [] });
    setShowAddForm(false);
  };

  const handleUpdateOrganization = () => {
    if (!showUpdateForm) return;
  
    updateOrganization.mutate(
      {
        id: showUpdateForm.id, // send the org ID
        data: {
          name: newOrg.name,
          description: newOrg.description,
        },
      },
      {
        onSuccess: () => {
          setResponseModal({
            type: "success",
            message: `Organization "${newOrg.name}" updated successfully!`,
          });
          setNewOrg({ name: "", description: "", moderators: [] });
          setShowUpdateForm(null);
        },
        onError: (error: any) => {
          setResponseModal({
            type: "error",
            message: error.message || "Failed to update organization",
          });
        },
      }
    );
  };
  

  const handleDeleteOrganization = () => {
    if (!showDeleteConfirm) return;
  
    deleteOrganizationMutation.mutate(showDeleteConfirm.id, {
      onSuccess: (deletedId) => {
        setResponseModal({
          type: "success",
          message: `Organization "${showDeleteConfirm.name}" deleted successfully!`,
        });

  
        setShowDeleteConfirm(null);
      },
      onError: (error: any) => {
        setResponseModal({
          type: "error",
          message: error.message || "Failed to delete organization",
        });
      },
    });
  };
  

  const filteredOrganizations = data?.filter(
    (org: any) => org.organizer === username
  ) || [];



  return (
    <div className="max-w-7xl mx-auto p-6 relative mt-20">
      {/* Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 sticky top-0 bg-white py-4 z-10 space-y-4 px-5 rounded-xl"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow"
          >
            <Plus size={18} /> Add New Organization
          </button>
        </div>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search organizations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </motion.div>

      {/* Organizations List */}
      <motion.div
  className="grid md:grid-cols-2 gap-6"
  initial="hidden"
  animate="visible"
  variants={{
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  }}
>
  {filteredOrganizations.map((org: any) => (
    <motion.div
      key={org.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md rounded-xl p-5 flex flex-col justify-between hover:shadow-lg transition"
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{org.name}</h2>
        <p className="text-sm text-gray-600 mb-3">
          {org.description || "No description provided"}
        </p>
        <div className="flex gap-2 flex-wrap">
          {org.moderators.map((mod: any, i: any) => (
            <span
              key={i}
              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md"
            >
              {mod}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setNewOrg({
                name: org.name,
                description: org.description || "",
                moderators: org.moderators,
              });
              setShowUpdateForm(org);
            }}
            className="px-3 py-1 flex items-center gap-1 border rounded-lg text-indigo-600 hover:bg-indigo-50 text-sm"
          >
            <Pencil size={14} /> Update
          </button>
          <button
            onClick={() => setShowDeleteConfirm(org)}
            className="px-3 py-1 flex items-center gap-1 border rounded-lg text-red-600 hover:bg-red-50 text-sm"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>

        {/* Approval status */}
        <span
          className={`text-xs font-medium px-2 py-1 rounded-md self-end mt-3 ${
            org.is_approved
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {org.is_approved ? "Approved" : "Waiting for approval"}
        </span>
      </div>
    </motion.div>
  ))}
</motion.div>

      {/* Floating button for mobile */}
      <motion.button
        onClick={() => setShowAddForm(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="md:hidden fixed bottom-6 right-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-full shadow-lg z-50"
      >
        <Plus size={20} />
      </motion.button>

      {/* Add / Update Organization Form Modal */}
      <AnimatePresence>
        {(showAddForm || showUpdateForm) && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {showAddForm ? "Add New Organization" : "Update Organization"}
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Organization Name"
                  value={newOrg.name}
                  onChange={(e) =>
                    setNewOrg((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <textarea
                  placeholder="Description"
                  value={newOrg.description}
                  onChange={(e) =>
                    setNewOrg((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                {/* Moderators Input */}
                <input
                  type="text"
                  placeholder="Add moderators (comma separated)"
                  value={newOrg.moderators.join(", ")}
                  onChange={(e) =>
                    setNewOrg((prev) => ({
                      ...prev,
                      moderators: e.target.value
                        .split(",")
                        .map((m) => m.trim())
                        .filter((m) => m),
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setShowUpdateForm(null);
                  }}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={
                    showAddForm
                      ? handleAddOrganization
                      : handleUpdateOrganization
                  }
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
                >
                  {showAddForm ? createOrganization.isPending
      ? "Saving..."
      : "Save" : updateOrganization.isPending ? "Updating..." : "Update"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Delete Organization
              </h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{showDeleteConfirm.name}</span>
                ? <br />
                All hackathons under this organization will also be deleted.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
  onClick={handleDeleteOrganization}
  disabled={deleteOrganizationMutation.isPending}
  className={`px-4 py-2 rounded-lg text-white cursor-pointer ${
    deleteOrganizationMutation.isPending
      ? "bg-red-400 cursor-not-allowed"
      : "bg-red-600 hover:bg-red-700"
  }`}
>
  {deleteOrganizationMutation.isPending ? "Deleting..." : "Delete"}
</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Response Modal */}
      <AnimatePresence>
        {responseModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2
                className={`text-xl font-semibold mb-4 ${
                  responseModal.type === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {responseModal.type === "success" ? "Success" : "Error"}
              </h2>
              <p className="text-gray-700 mb-6">{responseModal.message}</p>
              <button
                onClick={() => setResponseModal(null)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
