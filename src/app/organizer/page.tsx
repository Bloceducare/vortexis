"use client";
import { useState, useMemo } from "react";
import useOrganizer from "@/hooks/useOrganizers";
import EmptyState from "./components/EmptyState";
import { Plus, Search, ArrowLeft } from "lucide-react";
import NewOrganization from "./components/NewOrganization";
import OrganizationList from "./components/OrganizationList";

const Index = () => {
  const [search, setSearch] = useState("");
  const [showNewOrg, setShowNewOrg] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);

  const { getAllOrganization } = useOrganizer();
  const { data, isLoading, isError } = getAllOrganization;

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((org: any) =>
      org.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const handleOrgClick = (orgId: number) => {
    setSelectedOrgId(orgId);
  };

  const handleBack = () => {
    setSelectedOrgId(null);
  };

  if (isLoading) {
    return (

      <section>

        <div className="flex justify-between items-center p-6 mb-8 sticky top-0 animate-pulse">
        <div className=" h-10 rounded-lg w-1/2 bg-gray-300 " />

        <div className=" h-10 rounded-lg w-[35%] bg-gray-300 " />
        </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 animate-pulse">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 items-center justify-between bg-gray-100 rounded-xl p-4 shadow-sm"
          >
            <div className="w-full h-40 bg-gray-300 rounded-md" />
            <div className="h-6 w-3/4 bg-gray-300 rounded-md" />
            <div className="h-4 w-5/6 bg-gray-200 rounded-md" />
            <div className="h-10 w-1/2 bg-gray-300 rounded-full mt-2" />
          </div>
        ))}
      </div>
      </section>
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

  if (selectedOrgId) {
    return (
      <div className="p-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft size={18} />
          <span>Back to Organizations</span>
        </button>

        <OrganizationList
          organizationId={selectedOrgId}
          onClose={handleBack}
        />
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

              <button
                onClick={() => setShowNewOrg(true)}
                className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
              >
                <Plus size={18} /> Add New Organization
              </button>
            </div>
          </div>

          {/* Organization grid */}
          <div className="p-6">
            {filteredData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((org: any, i: number) => (
                  <div
                    key={i}
                    onClick={() => handleOrgClick(org.id)}
                    className="border p-4 rounded-xl hover:shadow-lg transition-all bg-white shadow-md h-[35vh] cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-5">
                      <h3 className="font-bold text-xl">{org.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {org.description?.slice(0, 150) ||
                          "No description provided."}
                      </p>
                    </div>

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
                ))}
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

          {/* New organization modal */}
          {showNewOrg && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-lg relative">
                <NewOrganization onClose={() => setShowNewOrg(false)} />
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </>
  );
};

export default Index;
