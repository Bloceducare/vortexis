"use client";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 10,
}) => {
  const getPaginationNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  // Determine if next page should be disabled
  const isNextDisabled = currentPage >= totalPages;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center items-center mt-12 gap-2"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-xl border border-primary/20 dark:border-indigo-400/30 hover:bg-primary/5 dark:hover:bg-indigo-400/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-700 dark:text-gray-300"
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      {getPaginationNumbers().map((page, idx) =>
        typeof page === "number" ? (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl font-medium transition-all ${
              currentPage === page
                ? "bg-primary dark:bg-indigo-600 text-white shadow-lg shadow-primary/25 dark:shadow-indigo-600/25"
                : "border border-primary/20 dark:border-indigo-400/30 hover:bg-primary/5 dark:hover:bg-indigo-400/10 text-gray-700 dark:text-gray-300"
            }`}
          >
            {page}
          </motion.button>
        ) : (
          <span
            key={idx}
            className="px-2 text-base opacity-40 dark:opacity-60 dark:text-gray-300"
          >
            …
          </span>
        )
      )}

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isNextDisabled}
        className="p-2 rounded-xl border border-primary/20 dark:border-indigo-400/30 hover:bg-primary/5 dark:hover:bg-indigo-400/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-700 dark:text-gray-300"
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};

export { Pagination };
