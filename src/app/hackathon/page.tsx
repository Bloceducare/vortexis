"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import useHackathon from "@/hooks/useHackathon";
import { useRouter } from "next/navigation";
import { getCountries, Country } from "@/app/api/country/getCountries";
import StatusModal from "@/components/StatusModal";
import { HeroSection } from "./component/HeroSection";
import { FilterSection } from "./component/FilterSection";
import { HackathonGrid } from "./component/HackathonGrid";
import { Pagination } from "@/components/Pagination";
import { useHackathonFilters } from "./component/HackathonFilters";
import { useQueryClient } from "@tanstack/react-query";
import { slugify } from "@/lib/utils";

function Home() {
  const router = useRouter();
  const { getAllHackathon, registerUserForHackathon } = useHackathon();
  const [countries, setCountries] = useState<Country[]>([]);
  const { data: hackathons = [], isLoading } = getAllHackathon();
  const registerMutation = registerUserForHackathon();
  const queryClient = useQueryClient()
  

  const [activeHackathon, setActiveHackathon] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({
    open: false,
    type: "success",
    message: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const {
    sortOption,
    setSortOption,
    searchQuery,
    setSearchQuery,
    selectedCountry,
    setSelectedCountry,
    prizeFilter,
    setPrizeFilter,
    filteredHackathons,
  } = useHackathonFilters(hackathons);

  useEffect(() => {
    getCountries().then(setCountries).catch(console.error);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
    setCurrentPage(1);
  };

const handleRegister = (hackathon_id: string) => {
  setActiveHackathon(hackathon_id);
  
  registerMutation.mutate(hackathon_id, {
    onSuccess: async () => {
      // 1. Show Success Modal
      setModal({
        open: true,
        type: "success",
        message: "Successfully registered!",
      });

      await queryClient.invalidateQueries({
        queryKey: ["participant_hackathon"],
      });

      setTimeout(() => {
        const hackathon = hackathons.find((h: any) => h.id === hackathon_id);
        if (hackathon) {
          const slug = slugify(hackathon.title);
          router.push(`/dashboard/${slug}/hackathon`);
        }
      }, 1200); 
    },
    onError: (error: any) => {
      setModal({
        open: true,
        type: "error",
        message: error?.response?.data?.message || "Registration failed. Please try again.",
      });
    
    },
  });
};
  // Pagination
  const totalPages = Math.ceil(filteredHackathons.length / itemsPerPage);
  const paginatedHackathons = filteredHackathons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="min-h-screen bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors w-full">
      <div className="w-full md:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Hero Section */}
        <HeroSection onCreateOrg={() => router.push("/create-organization")} />

        {/* Explore Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-20"
        >
          {/* Filter Section */}
          <FilterSection
            searchQuery={searchQuery}
            onSearch={handleSearch}
            sortOption={sortOption}
            onSortChange={setSortOption}
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
            prizeFilter={prizeFilter}
            onPrizeFilterChange={setPrizeFilter}
            countries={countries}
            resultsCount={filteredHackathons.length}
          />

     
          <HackathonGrid
            hackathons={paginatedHackathons}
            isLoading={isLoading}
            onCardClick={(id) => router.push(`/hackathon/${id}`)}
            onRegister={handleRegister}
            activeHackathon={activeHackathon}
            isRegistering={registerMutation.isPending}
          />

          {/* Pagination */}
          {filteredHackathons.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </motion.div>
      </div>

      {/* Status Modal */}
      <StatusModal
        isOpen={modal.open}
        onClose={() => setModal((prev) => ({ ...prev, open: false }))}
        type={modal.type}
        message={modal.message}
      />
    </main>
  );
}

export default Home;
