"use client";
import { useState, useMemo } from "react";
import useOrganizer from "@/hooks/useOrganizers";
import EmptyState from "./components/EmptyState";
import { Plus, Search } from "lucide-react";
import NewOrganization from "./components/NewOrganization";

const Index = () => {
  const [search, setSearch] = useState("");
    const [showNewOrg, setShowNewOrg] = useState(false);

  const { getAllOrganization } = useOrganizer();
  const { data, isLoading, isError } = getAllOrganization;

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((org: any) =>
      org.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-[80vh] animate-pulse text-center">
        <div className="w-24 h-24 bg-gray-300 rounded-full" />
        <div className="h-6 w-64 bg-gray-300 rounded-md" />
        <div className="h-4 w-80 bg-gray-200 rounded-md" />
        <div className="h-10 w-48 bg-gray-300 rounded-full mt-4" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <p className="text-red-500 text-lg font-medium">
          Failed to load organizations. Please try again.
        </p>
      </div>
    );
  }

  return (
    <>
      {data && data.length > 0 ? (
        <>
          {/* Top bar */}
          <div className="mb-8 sticky top-0 py-4 z-10 space-y-4 px-5 ">
            <div className="flex justify-between items-center">
              <div className="relative w-full md:w-1/2">
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search organizations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none"
                />
              </div>

              {/* Add new organization button */}
              <button
        onClick={() => setShowNewOrg(true)}
        className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
              >
                <Plus size={18} /> Add New Organization
              </button>
            </div>
          </div>

          {/* Organization List */}
          <div className="p-6">

            {filteredData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((org: any, i: number) => (
                  <div
                    key={i}
                    className="border p-4 rounded-xl  hover:shadow-lg transition-all bg-white shadow-md h-[30vh] cursor-pointer"
                  >
                    <h3 className="font-semibold text-lg">{org.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {org.description || "No description provided."}
                    </p>
                  </div>
                ))}

                {showNewOrg && (
                        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
                          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-lg relative">
                            <NewOrganization onClose={() => setShowNewOrg(false)} />
                          </div>
                        </div>
                      )}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-16">
                <p className="text-lg font-medium">
                  No organization found with the name{" "}
                  <span className="text-indigo-600">“{search}”</span>.
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <EmptyState />
      )}
    </>
  );
};

export default Index;
