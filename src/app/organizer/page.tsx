"use client";
import { useState, useMemo, useEffect } from "react";
import useOrganizer from "@/hooks/useOrganizers";
import EmptyState from "./components/EmptyState";
import { Plus, Search, ArrowLeft, CheckCircle, Clock, Building2, MapPin } from "lucide-react";
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
    return data.results.filter((org: any) =>
      org.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const handleOrgClick = (orgId: number) => {
    setSelectedOrgId(orgId);
  };

  const handleBack = () => {
    setSelectedOrgId(null);
  };

  const ITEMS_PER_PAGE = 6;

const [currentPage, setCurrentPage] = useState(1);

const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

const paginatedData = filteredData.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);


  if (isLoading) {
    return (
      <section>
        <div className="flex justify-between items-center p-6 mb-8 sticky top-0 animate-pulse ">
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
      <div className="p-4  md:p-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft size={18} />
          <span>Back to Organizations</span>
        </button>

        <OrganizationList organizationId={selectedOrgId} onClose={handleBack} />
      </div>
    );
  }

  return (
    <>
      {data && data.results.length > 0 ? (
        <>
          {/* Top bar */}
          <div className="mb-8 sticky top-0 py-4 z-10 space-y-4 px-5 ">
            <div className="flex justify-center md:justify-between items-center flex-wrap md:flex-nowrap gap-8 md:gap-0">
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                />
              </div>

              <button
                onClick={() => setShowNewOrg(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
              >
                <Plus size={18} /> Add New Organization
              </button>
            </div>
          </div>

       
          <div className="p-6">
            {filteredData.length > 0 ? (
              <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {paginatedData.map((org: any, i: number) => (
                  <div
                    key={i}
                    onClick={() => handleOrgClick(org.id)}
                    className="border rounded-xl hover:shadow-lg transition-all bg-white shadow-md h-[35vh] cursor-pointer flex flex-col dark:bg-gray-800"
                  >
                    <div className="relative h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-t-xl overflow-hidden  dark:bg-gradient-to-br dark:from-primary/20 dark:to-primary/5">
                      {org.logo ? (
                        <img
                          src={org.logo}
                          alt={org.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-12 h-12 text-indigo-300" />
                        </div>
                      )}

                      <div className="absolute top-2 right-2">
                        {org.is_approved ? (
                          <span className="flex items-center gap-1 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                            <CheckCircle size={12} />
                            Approved
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                            <Clock size={12} />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="font-bold text-xl">{org.name}</h3>
                        {org.tagline && (
                          <p className="text-xs text-indigo-600 font-medium line-clamp-1">
                            {org.tagline}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          {org.description?.slice(0, 100) ||
                            "No description provided."}
                          {org.description?.length > 100 && "..."}
                        </p>
                      </div>

                      {org.location && (
                        <div className="flex items-center gap-1 text-gray-500 text-xs mt-2">
                          <MapPin size={14} className="text-indigo-500" />
                          <span>{org.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

         

              </div>
                     {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10 ">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer
                            bg-gray-100 dark:bg-gray-700
                            disabled:opacity-40 disabled:cursor-not-allowed
                            hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Prev
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  const isActive = page === currentPage;

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition cursor-pointer
                        ${
                          isActive
                            ? "bg-indigo-600 text-white shadow"
                            : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer
                            bg-gray-100 dark:bg-gray-700
                            disabled:opacity-40 disabled:cursor-not-allowed
                            hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Next
                </button>
              </div>
            )}
            </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-16">
                <p className="text-lg font-medium">
                  No organization found with the name{" "}
                  <span className="text-indigo-600">"{search}"</span>.
                </p>
              </div>
            )}


          </div>

          {showNewOrg && (
            <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-[90%] max-w-lg relative transition-colors">
                <NewOrganization
                  onClose={() => setShowNewOrg(false)}
                  type="new"
                />
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
