"use client";
import { motion } from "framer-motion";
import { Sparkles, Rocket, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useOrganizer from "@/hooks/useOrganizers";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import Plane from "@/public/assets/PlaneCircle.svg";

interface HeroSectionProps {
  onCreateOrg: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCreateOrg }) => {
  const router = useRouter();
  const [showOrgModal, setShowOrgModal] = useState(false);

  const { getAllOrganization } = useOrganizer();
  const { data, isLoading, isError } = getAllOrganization;

  const handleCreateHackathon = () => {
    setShowOrgModal(true);
  };

  const handleOrgSelect = (organizationId: string) => {
    setShowOrgModal(false);
    router.push(`/organizer/create-hackathon/${organizationId}`);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = useAuthStore.getState().getToken();

    useEffect(() => {
      const checkLoginStatus = () => {
        setIsLoggedIn(!!token);
      };
  
      checkLoginStatus();
      window.addEventListener("storage", checkLoginStatus);
  
      return () => {
        window.removeEventListener("storage", checkLoginStatus);
      };
    }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* Background decoration */}
        <div className="hidden md:block absolute -top-20 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="hidden md:block absolute -top-10 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative max-w-3xl space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-indigo-400/10 rounded-full"
          >
            <Sparkles className="w-4 h-4 text-primary dark:text-indigo-400" />
            <span className="text-sm font-medium text-primary dark:text-indigo-400">
              Join 10,000+ innovators
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-6xl font-bold text-title dark:text-white leading-tight"
          >
            Join Game-Changing{" "}
          Hackathons
            with Vortexis
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl opacity-70 dark:opacity-80 dark:text-gray-300 leading-relaxed"
          >
            Create, manage, join, and scale your hackathons — all from one
            intuitive dashboard.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
        {isLoggedIn && (   <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateHackathon}
              className="flex items-center gap-2 bg-black dark:bg-primary/40 text-white px-3 text-sm md:text-lg md:px-6 py-3 rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all cursor-pointer"
            >
              <Rocket className="w-5 h-5" />
              Create Hackathon
            </motion.button>)}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-primary text-primary px-3 md:px-6 py-3 rounded-xl text-sm md:text-lg font-medium hover:bg-primary/5 transition-all cursor-pointer"
              onClick={() => router.push("/guide")}
            >
              View Guide
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Organization Selection Modal */}
      {showOrgModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Select Organization
              </h2>
              <button
                onClick={() => setShowOrgModal(false)}
                className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    Loading organizations...
                  </p>
                </div>
              ) : isError ? (
                <div className="text-center py-12">
                  <p className="text-red-500 dark:text-red-400">
                    Failed to load organizations
                  </p>
                </div>
              ) : !data || data.results.length === 0 ? (
                <div className="text-center py-12">

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


                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You don't have any organizations yet
                  </p>
                  <button
                    onClick={() => {
                      setShowOrgModal(false);
                      onCreateOrg();
                    }}
                    className="px-6 py-2  cursor-pointer text-white rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                  +  Create Organization
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {data.results.map((org: any) => (
                    <motion.button
                      key={org.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOrgSelect(org.id)}
                      className="flex items-center gap-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary dark:hover:border-primary transition-all text-left"
                    >
                      {org.logo ? (
                        <img
                          src={org.logo}
                          alt={org.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                          <span className="text-xl font-bold text-primary">
                            {org.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {org.name}
                        </h3>
                        {org.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                            {org.description}
                          </p>
                        )}
                      </div>
                      <Rocket className="w-5 h-5 text-primary" />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};