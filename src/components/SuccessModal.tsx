"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SuccessModalProps {
  title?: string;
  message?: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  title = '🎉 Hackathon Created!',
  message = '',
  onClose,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 text-center max-w-sm w-full transition-colors"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-6 leading-relaxed">
            {message}
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto min-w-[120px] bg-[#605DEC] hover:bg-[#5046d8] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            Done
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SuccessModal;
