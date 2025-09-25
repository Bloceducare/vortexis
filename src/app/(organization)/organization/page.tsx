"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Organization {
  id: string;
  name: string;
  moderators: string[];
  description?: string;
}

export default function OrganizationPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: "1",
      name: "Bloceducare",
      moderators: ["Amiola", "Demilade"],
      description: "A platform to empower learning through hackathons.",
    },
    {
      id: "2",
      name: "TechSphere",
      moderators: ["John Doe"],
      description: "Driving innovation through communities.",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState<Organization | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<
    Organization | null
  >(null);

  const [newOrg, setNewOrg] = useState({
    name: "",
    description: "",
    moderators: [] as string[],
  });

  const [search, setSearch] = useState("");

  const handleAddOrganization = () => {
    if (!newOrg.name.trim()) return;
    setOrganizations((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        ...newOrg,
      },
    ]);
    setNewOrg({ name: "", description: "", moderators: [] });
    setShowAddForm(false);
  };

  const handleUpdateOrganization = () => {
    if (!showUpdateForm) return;
    setOrganizations((prev) =>
      prev.map((org) =>
        org.id === showUpdateForm.id ? { ...org, ...newOrg } : org
      )
    );
    setNewOrg({ name: "", description: "", moderators: [] });
    setShowUpdateForm(null);
  };

  const handleDeleteOrganization = () => {
    if (!showDeleteConfirm) return;
    setOrganizations((prev) =>
      prev.filter((org) => org.id !== showDeleteConfirm.id)
    );
    setShowDeleteConfirm(null);
  };

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      (org.description &&
        org.description.toLowerCase().includes(search.toLowerCase())) ||
      org.moderators.some((m) =>
        m.toLowerCase().includes(search.toLowerCase())
      )
  );

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
        {filteredOrganizations.map((org) => (
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
              <h2 className="text-lg font-semibold text-gray-900">
                {org.name}
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                {org.description || "No description provided"}
              </p>
              <div className="flex gap-2 flex-wrap">
                {org.moderators.map((mod, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md"
                  >
                    {mod}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
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
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {showAddForm ? "Save" : "Update"}
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
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteOrganization}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
