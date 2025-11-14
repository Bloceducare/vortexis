"use client";
import { motion } from "framer-motion";
import { Sparkles, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeroSectionProps {
  onCreateOrg: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCreateOrg }) => {
    const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Background decoration */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -top-10 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative max-w-3xl space-y-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Join 10,000+ innovators
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl font-bold text-title leading-tight"
        >
          Join Game-Changing{" "}
          <span className="text-primary">Hackathons</span> with Vortexis
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl opacity-70 leading-relaxed"
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateOrg}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            <Rocket className="w-5 h-5" />
            Create Organization
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-primary text-primary px-6 py-3 rounded-xl font-medium hover:bg-primary/5 transition-all cursor-pointer"
            onClick={() => router.push("/guide") }
          >
            View Guide
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};
