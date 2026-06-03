"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Plane from "@/public/assets/PlaneCircle.svg";
import NewOrganization from "./NewOrganization";

function EmptyState() {
  const [showNewOrg, setShowNewOrg] = useState(false);

   useEffect(() => {
  const isNewOrg = localStorage.getItem("newOrganizer");
  
  if (isNewOrg) {
    setShowNewOrg(true);
  }

  localStorage.removeItem("newOrganizer");
}, []);


  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center h-[80vh] text-center relative"
    >
     
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mb-6"
      >
        <Image
          src={Plane}
          alt="Rocket illustration"
          width={120}
          height={120}
          className="mx-auto"
        />
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-2xl font-semibold text-gray-800 dark:text-white"
      >
        Welcome to your Organizer Dashboard
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-[#7D7D7D] mt-2 max-w-md"
      >
        You’re all set to start creating amazing hackathons! Set up your first
        organization to manage events, teams, and participants—all in one place.
      </motion.p>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowNewOrg(true)}
        className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-medium transition-all cursor-pointer"
      >
        + Create My First Organization
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {showNewOrg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-lg relative"
            >
              <NewOrganization
                onClose={() => setShowNewOrg(false)}
                type="new"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default EmptyState;
