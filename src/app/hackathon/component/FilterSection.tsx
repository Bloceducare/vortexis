"use client";
import { motion, AnimatePresence } from "framer-motion";
import SearchInput from "@/components/ui/SearchInput";
import { Filter, X } from "lucide-react";
import { Country } from "@/app/api/country/getCountries";
import { useState } from "react";

interface FilterSectionProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  selectedCountry: string;
  onCountryChange: (value: string) => void;
  prizeFilter: string;
  onPrizeFilterChange: (value: string) => void;
  countries: Country[];
  resultsCount: number;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  searchQuery,
  onSearch,
  sortOption,
  onSortChange,
  selectedCountry,
  onCountryChange,
  prizeFilter,
  onPrizeFilterChange,
  countries,
  resultsCount,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = sortOption !== "newest" || selectedCountry !== "" || prizeFilter !== "all";

  const clearFilters = () => {
    onSortChange("newest");
    onCountryChange("");
    onPrizeFilterChange("all");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Explore Hackathons
          </h2>
          <p className="text-sm md:text-base opacity-60 dark:opacity-70 dark:text-gray-300 mt-1">
            {resultsCount} hackathons available
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-3">
          <div className="flex-1 md:w-80">
            <SearchInput onSearch={onSearch} />
          </div>

       
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative p-3 rounded-xl border-2 transition-all cursor-pointer ${
              showFilters || hasActiveFilters
                ? "bg-primary text-white border-primary dark:bg-indigo-600 dark:border-indigo-600"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-indigo-400"
            }`}
          >
            <Filter className="w-5 h-5" />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            )}
          </button>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clearFilters}
              className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center gap-2 text-sm font-medium"
            >
              <X className="w-4 h-4" />
              Clear
            </motion.button>
          )}
        </div>
      </div>

      {/* Filters Dropdown */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary dark:text-indigo-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Filters
                  </h3>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Sort by */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort by
                  </label>
                  <select
                    value={sortOption}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-indigo-400 focus:border-transparent transition-all text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active Now</option>
                    <option value="finished">Finished</option>
                  </select>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Country
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => onCountryChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-indigo-400 focus:border-transparent transition-all text-sm"
                  >
                    <option value="">All Countries</option>
                    {countries.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Prize */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Grand Prize
                  </label>
                  <select
                    value={prizeFilter}
                    onChange={(e) => onPrizeFilterChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-indigo-400 focus:border-transparent transition-all text-sm"
                  >
                    <option value="all">All Prizes</option>
                    <option value="under5k">Under $5,000</option>
                    <option value="5kto10k">$5,000 - $10,000</option>
                    <option value="over10k">Over $10,000</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Summary */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {sortOption !== "newest" && (
                        <span className="px-3 py-1 bg-primary/10 dark:bg-indigo-400/10 text-primary dark:text-indigo-400 rounded-full text-xs font-medium">
                          Sort: {sortOption}
                        </span>
                      )}
                      {selectedCountry && (
                        <span className="px-3 py-1 bg-primary/10 dark:bg-indigo-400/10 text-primary dark:text-indigo-400 rounded-full text-xs font-medium">
                          {selectedCountry}
                        </span>
                      )}
                      {prizeFilter !== "all" && (
                        <span className="px-3 py-1 bg-primary/10 dark:bg-indigo-400/10 text-primary dark:text-indigo-400 rounded-full text-xs font-medium">
                          Prize: {prizeFilter}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-red-600 dark:text-red-400 hover:underline font-medium"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};