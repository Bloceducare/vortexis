"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Circle } from "lucide-react";
import Image from "next/image";
import First from "@/public/assets/firstIntroPic.png";
import Second from "@/public/assets/secondintropic.png";
import Third from "@/public/assets/thirdintropic.png";
import Fourth from "@/public/assets/fourthintopic.png";
import Fifth from "@/public/assets/fifthIntroPic.png";
import Sixth from "@/public/assets/sixthintropic.png";

const introInfo = [
  {
    id: 1,
    image: First,
    title: "Welcome to Vortexis! 👋",
    description:
      "Discover exciting hackathons tailored to your interests and skills. First you have to edit your profile by clicking on the edit button so users can get to know more about you.",
  },
  {
    id: 2,
    image: Second,
    title: "Personalize Your Profile",
    description:
      "Edit your name, email, and bio to let others know who you are. Make a great first impression!",
  },
  {
    id: 3,
    image: Third,
    title: "Connect Your Social Profiles",
    description:
      "Add links to your social media profiles and personal website to showcase your online presence and connect with the community.",
  },
  {
    id: 4,
    image: Fourth,
    title: "Showcase Your Skills",
    description:
      "Highlight your skills and interests to connect with like-minded individuals and find the perfect hackathons for you.",
  },
  {
    id: 5,
    image: [Fifth, Sixth],
    title: "Navigate Like a Pro",
    description:
      "Click on your profile avatar at the top and explore: Hacker dashboard for your hackathons, Organization to create hackathons, and Home to discover events.",
  },
];

interface FirstTimeProps {
  isOpen: boolean;
  onClose: () => void;
}

function FirstTime({ isOpen, onClose }: FirstTimeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (!isOpen || isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [isOpen, currentStep, isPaused]);

  const handleNext = () => {
    if (currentStep < introInfo.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentStep ? 1 : -1);
    setCurrentStep(index);
  };

  const handleFinish = () => {
    onClose();
    // Store in localStorage that user has seen onboarding
    localStorage.removeItem("isFirstTime");
  };

  const currentInfo = introInfo[currentStep];
  const isLastStep = currentStep === introInfo.length - 1;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-blue-500"
              initial={{ width: "0%" }}
              animate={{
                width: `${((currentStep + 1) / introInfo.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative bg-gradient-to-br from-primary/5 to-blue-500/5 p-8 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="w-full h-full flex items-center justify-center"
                >
                  {Array.isArray(currentInfo.image) ? (
                    <div className="grid grid-cols-2 gap-4 w-full">
                      {currentInfo.image.map((img, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.2 }}
                          className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg"
                        >
                          <Image
                            src={img}
                            alt={`Step ${currentStep + 1} - ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="relative w-full h-full max-h-96 rounded-2xl overflow-hidden shadow-2xl">
                      <Image
                        src={currentInfo.image}
                        alt={`Step ${currentStep + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Step Counter */}
              <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg">
                <span className="text-sm font-semibold text-primary">
                  {currentStep + 1} / {introInfo.length}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-12 flex flex-col justify-between">
              <div className="flex-1">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                  >
                    <motion.h2
                      className="text-3xl md:text-4xl font-bold text-title mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {currentInfo.title}
                    </motion.h2>
                    <motion.p
                      className="text-lg  opacity-70 leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {currentInfo.description}
                    </motion.p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Dots */}
              <div className="flex items-center justify-center gap-2 my-8">
                {introInfo.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className="group relative"
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        index === currentStep
                          ? "bg-primary scale-125"
                          : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                      }`}
                    />
                    {/* Progress ring for current dot */}
                    {index === currentStep && !isPaused && (
                      <svg
                        className="absolute inset-0 -m-2 w-7 h-7"
                        viewBox="0 0 28 28"
                      >
                        <motion.circle
                          cx="14"
                          cy="14"
                          r="12"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          className="text-primary/30"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 5, ease: "linear" }}
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed border-2 border-primary text-primary hover:bg-primary/5"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </motion.button>

                {isLastStep ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFinish}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl font-medium bg-primary text-white hover:opacity-90 transition-all shadow-lg shadow-primary/25"
                  >
                    Get Started 🚀
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-primary text-white hover:opacity-90 transition-all shadow-lg shadow-primary/25"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                )}
              </div>

              {/* Skip Button */}
              <button
                onClick={onClose}
                className="text-sm  opacity-50 hover:opacity-70 transition-opacity mt-4 text-center"
              >
                Skip tutorial
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default FirstTime;