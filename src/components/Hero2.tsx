"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/Button";
import { motion } from "framer-motion";

export default function HackathonCTA() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
        {/* New To Hackathons? Card */}
        <div className="relative w-full bg-[#605DEC] overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6">
          <div className="relative z-10 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
              New To Hackathons?
            </h2>
            <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed max-w-md mx-auto">
              Jump into innovation. Collaborate, build, and showcase your
              talent. Connect with like-minded individuals and create something
              amazing together.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg 
                  bg-transparent border-2 border-white text-white 
                  hover:bg-white hover:text-[#605DEC] rounded-lg"
              >
                <Link href="/participants">Register as Participant</Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Ready To Host? Card */}
        <div className="relative w-full bg-[#605DEC] overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6">
          <div className="relative z-10 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
              Ready To Host?
            </h2>
            <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed max-w-md mx-auto">
              Create impactful events with streamlined tools and built-in
              judging. Organize, manage, and get insights from your hackathon
              seamlessly.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg 
                  bg-transparent border-2 border-white text-white 
                  hover:bg-white hover:text-[#605DEC] rounded-lg"
              >
                <Link href="/organizers">Register as Organizer</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Newsletter section */}
      <div className="text-center bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md mx-auto shadow-md">
        <h3 className="text-base sm:text-lg font-medium mb-2 text-gray-800">
          Stay Up to Date with Hackathons
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-4">
          Subscribe to our newsletter
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-300 text-gray-800 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#605DEC]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-[#605DEC] text-white hover:bg-[#4b47c4] rounded-lg"
              onClick={handleSubscribe}
            >
              Subscribe
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
