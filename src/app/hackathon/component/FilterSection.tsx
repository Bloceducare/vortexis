"use client";
import { motion } from "framer-motion";
import SearchInput from "@/components/ui/SearchInput";
import { Filter } from "lucide-react";
import { Country } from "@/app/api/country/getCountries";

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
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-title dark:text-white">
            Explore Hackathons
          </h2>
          <p className="text-base opacity-60 dark:opacity-70 dark:text-gray-300 mt-1">
            {resultsCount} hackathons available
          </p>
        </div>
        <div className="md:w-96">
          <SearchInput onSearch={onSearch} />
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-primary dark:text-indigo-400" />
          <h3 className="font-semibold text-title dark:text-white">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium opacity-70 dark:opacity-80 dark:text-gray-300 mb-2">
              Sort by
            </label>
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-base dark:bg-gray-700 border border-primary/20 dark:border-indigo-400/30 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primary dark:focus:border-indigo-400 transition-all"
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
            <label className="block text-sm font-medium opacity-70 dark:opacity-80 dark:text-gray-300 mb-2">
              Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => onCountryChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-base dark:bg-gray-700 border border-primary/20 dark:border-indigo-400/30 rounded-xl text-base dark:text-gray-100 focus:outline-none focus:border-primary dark:focus:border-indigo-400 transition-all"
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
            <label className="block text-sm font-medium opacity-70 dark:opacity-80 dark:text-gray-300 mb-2">
              Grand Prize
            </label>
            <select
              value={prizeFilter}
              onChange={(e) => onPrizeFilterChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-base dark:bg-gray-700 border border-primary/20 dark:border-indigo-400/30 rounded-xl text-base dark:text-gray-100 focus:outline-none focus:border-primary dark:focus:border-indigo-400 transition-all"
            >
              <option value="all">All Prizes</option>
              <option value="under5k">Under $5,000</option>
              <option value="5kto10k">$5,000 - $10,000</option>
              <option value="over10k">Over $10,000</option>
            </select>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
