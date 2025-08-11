"use client";

import React, { useState, useMemo, useEffect } from "react";
import useHackathon from "@/hooks/useHackathon";
import { useRouter } from "next/navigation";
import SearchInput from "@/components/ui/SearchInput";
import { getCountries, Country } from "@/app/api/country/getCountries";
import { motion, AnimatePresence } from "framer-motion";

function Home() {
  const router = useRouter();
  const { getAllHackathon } = useHackathon();
  const [countries, setCountries] = useState<Country[]>([]);
  const { data: hackathons = [], isLoading } = getAllHackathon();

  const [sortOption, setSortOption] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [prizeFilter, setPrizeFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    getCountries().then(setCountries).catch(console.error);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
    setCurrentPage(1);
  };

  const filteredHackathons = useMemo(() => {
    const now = new Date();
    let filteredData = hackathons.filter(
      (h: any) =>
        h.title.toLowerCase().includes(searchQuery) ||
        h.venue.toLowerCase().includes(searchQuery)
    );

    if (selectedCountry) {
      filteredData = filteredData.filter(
        (h: any) => h.country?.toLowerCase() === selectedCountry.toLowerCase()
      );
    }

    if (prizeFilter !== "all") {
      if (prizeFilter === "under5k") {
        filteredData = filteredData.filter((h: any) => h.grand_prize < 5000);
      } else if (prizeFilter === "5kto10k") {
        filteredData = filteredData.filter(
          (h: any) => h.grand_prize >= 5000 && h.grand_prize <= 10000
        );
      } else if (prizeFilter === "over10k") {
        filteredData = filteredData.filter((h: any) => h.grand_prize > 10000);
      }
    }

    switch (sortOption) {
      case "newest":
        filteredData.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        filteredData.sort(
          (a: any, b: any) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );
        break;
      case "upcoming":
        filteredData = filteredData.filter(
          (h: any) => new Date(h.start_date) > now
        );
        break;
      case "active":
        filteredData = filteredData.filter(
          (h: any) =>
            new Date(h.start_date) <= now &&
            new Date(h.end_date) >= now
        );
        break;
      case "finished":
        filteredData = filteredData.filter(
          (h: any) => new Date(h.end_date) < now
        );
        break;
    }
    return filteredData;
  }, [hackathons, sortOption, searchQuery, selectedCountry, prizeFilter]);

  const totalPages = Math.ceil(filteredHackathons.length / itemsPerPage);
  const paginatedHackathons = filteredHackathons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SkeletonCard = () => (
    <div className="border rounded-xl p-4 shadow-sm bg-white animate-pulse">
      <div className="bg-gray-200 h-40 rounded-lg mb-3"></div>
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="flex justify-between mt-3">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  );

  const getPaginationNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5, "...");
      } else if (currentPage >= totalPages - 2) {
        pages.push("...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push("...", currentPage - 1, currentPage, currentPage + 1, "...");
      }
    }
    return pages;
  };

  return (
    <main className="mb-10 px-4 sm:px-6 lg:px-8 pt-24">
      {/* Hero */}
      <div className="space-y-5 md:w-1/2 md:px-14">
        <h1 className="text-[#212121] font-bold text-2xl md:text-5xl">
          Join Game-Changing Hackathons with Vortexis
        </h1>
        <p className="md:text-3xl md:leading-10 font-normal text-[#212121]">
          Create, manage, Join, and scale your hackathons — all from one intuitive dashboard.
        </p>
        <div className="flex gap-5">
          <button
            onClick={() => router.push("/create-organization")}
            className="bg-[#605DEC] text-white p-3 rounded-xl"
          >
            Create Organization
          </button>
          <button className="border-[#605DEC] text-[#605DEC] border-2 py-3 px-5 rounded-xl">
            View Guide
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-5 md:px-24 mt-10">
        <div className="flex justify-between flex-wrap md:w-full items-center gap-5 md:gap-0">
          <h1 className="text-xl md:text-3xl">Explore Hackathons For You</h1>
          <p className="md:w-[35%]">
            <SearchInput onSearch={handleSearch} />
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-3 mt-4 items-center md:w-1/2">
          <div className="flex w-full gap-4 items-center">
            <label className="font-medium">Sort by:</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className=" px-3 py-2 rounded-lg"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          

          <div className="flex w-full gap-4 items-center">

          <label className="font-medium">Country:</label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="border px-3 py-2 rounded-lg w-1/5"
          >
            <option value="">All</option>
            {countries.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          </div>

          <div className="flex w-1/2 gap-4 items-center">
          <label className="font-medium">Grand Prize:</label>
          <select
            value={prizeFilter}
            onChange={(e) => setPrizeFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="all">All</option>
            <option value="under5k">Under $5,000</option>
            <option value="5kto10k">$5,000 - $10,000</option>
            <option value="over10k">Over $10,000</option>
          </select>
          </div>


        
        </div>

        {/* Hackathon grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
          {isLoading
            ? Array(6).fill(null).map((_, i) => <SkeletonCard key={i} />)
            : filteredHackathons.length > 0
              ? (
                <AnimatePresence>
                  {paginatedHackathons.map((h: any) => {
                    const daysLeft = Math.ceil(
                      (new Date(h.end_date).getTime() - Date.now()) /
                      (1000 * 60 * 60 * 24)
                    );
                    const now = new Date();
                    const start = new Date(h.start_date);
                    const end = new Date(h.end_date);
                    const isUpcoming = start > now;
                    const isActive = start <= now && end >= now;

                    return (
                      <motion.div
                        key={h.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="border rounded-xl p-4 shadow-sm bg-white"
                      >
                        <img
                          src={h.banner_image}
                          alt={h.title}
                          className="rounded-lg mb-3 h-40 w-full object-cover"
                        />
                        <h2 className="text-lg font-bold">{h.title}</h2>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="border px-3 py-1 rounded-full text-sm">
                            {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
                          </span>
                          <span>{h.venue}</span>
                          <span className="text-gray-500">{h.country}</span>
                        </div>

                        <p className="mt-2 text-gray-600 text-sm">
                          Starts: {start.toLocaleDateString()} <br />
                          Ends: {end.toLocaleDateString()}
                        </p>

                        <p className="mt-3 text-[#000] font-semibold">
                          ${h.grand_prize?.toLocaleString()}{" "}
                          <span className="text-gray-500 font-normal">
                            in prizes
                          </span>
                        </p>
                        <p className="mt-1 text-gray-700 text-sm">
                          {h.participants.length} participants
                        </p>

                        {(isUpcoming || isActive) && (
                          <button
                            onClick={() => router.push(`/hackathon/${h.id}`)}
                            className="mt-4 w-full bg-[#605DEC] text-white py-2 px-4 rounded-lg hover:bg-[#4b49c6] transition-colors cursor-pointer"
                          >
                            Register Now
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )
              : <p>No hackathons found for this filter.</p>}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-8 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg border ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
            }`}
          >
            ←
          </button>

          {getPaginationNumbers().map((p, idx) =>
            typeof p === "number" ? (
              <button
                key={idx}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1 rounded-lg border ${
                  currentPage === p
                    ? "bg-[#605DEC] text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            ) : (
              <span key={idx} className="px-2">…</span>
            )
          )}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-lg border ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-200"
            }`}
          >
            →
          </button>
        </div>
      </div>
    </main>
  );
}

export default Home;
