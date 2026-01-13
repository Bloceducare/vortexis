"use client";

import Link from "next/link";
import { Button } from "./ui/Button";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.35, delayChildren: 0.2 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: "easeInOut" }, // ✅ valid easing
  },
};

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full bg-linear-to-br from-[#E0D9FB] via-[#D8DBFF] to-[#F4F4FF] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden transition-colors">
      {/* Gradient circles */}
      <div className="w-full flex gap-0 flex-row justify-center items-center h-screen absolute top-0 bottom-0 left-0 right-0">
        <div className="w-[12em] h-[12em] md:w-[15em] md:h-[15em] lg:w-[25em] lg:h-[25em] bg-[#d2bcff] rounded-full opacity-50 mix-blend-multiply absolute left-[-2em] mt-[-18em] md:left-[-2em] md:mt-[-26em] lg:left-[3em] lg:mt-[6em]" />
        <div className="w-[20em] h-[20em] md:w-[25em] md:h-[24em] lg:w-[35em] lg:h-[35em] bg-[#ffffff] rounded-full opacity-50 mt-[-2em] md:mt-[-12em] lg:mt-[24em]" />
        <div className="w-[12em] h-[12em] md:w-[18em] md:h-[18em] lg:w-[35em] lg:h-[35em] bg-[#c5c3ff] rounded-full opacity-50 mix-blend-multiply absolute right-[-2em] mt-[15em] md:right-[-2em] md:mt-[-16em] lg:right-[-3em] lg:mt-[10em]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-5xl mx-auto px-4 py-16 md:px-8 md:py-24 lg:px-4 lg:py-28 text-center"
      >
        <motion.h1
          variants={fadeUp}
          className="text-2xl mt-5 md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#212121] dark:text-white mb-3 md:mb-4"
        >
          Run. Join. Win.
        </motion.h1>

        <motion.h2
          variants={fadeUp}
          className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-[#212121] dark:text-white mb-4 md:mb-6 lg:mb-6"
        >
          Everything Hackathon, All In
        </motion.h2>

        <motion.span
          variants={fadeUp}
          className="block text-xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-[#212121] dark:text-white mb-4 md:mb-6 lg:mb-8"
        >
          One Place.
        </motion.span>

        <motion.p
          variants={fadeUp}
          className="text-sm md:text-lg lg:text-xl text-[#212121] dark:text-gray-100 font-medium leading-relaxed max-w-xs md:max-w-2xl lg:max-w-3xl mx-auto mb-6 md:mb-8 lg:mb-10 lg:mt-2 px-2 md:px-0"
        >
          Vortexis makes it easy to{" "}
          <span className="font-semibold">host hackathons</span>,{" "}
          <span className="font-semibold">collaborate with teammates</span>, and{" "}
          <span className="font-semibold">build innovative projects</span> —
          whether {`you're an `}
          <span className="font-bold">organizer</span>,{" "}
          <span className="font-bold">participant</span>, or{" "}
          <span className="font-bold">judge</span>.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-col gap-3 md:flex-row md:justify-center md:gap-6"
        >
          <Button
            size="lg"
            className="inline-block text-center w-full md:w-auto md:min-w-[160px] lg:min-w-[220px]
  px-4 py-2 text-sm
  md:px-6 md:py-3 md:text-base 
  lg:px-10 lg:py-5 lg:text-xl 
  font-semibold
  bg-gradient-to-r from-[#605DEC] to-[#8A85FF] text-white rounded-xl shadow-lg 
  transform transition-all duration-500 hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            <Link href="/auth/signup">Start Your Hackathon Journey</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};
