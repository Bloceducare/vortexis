"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  UserPlus, 
  Building2, 
  Clock, 
  CheckCircle, 
  Zap, 
  Users, 
  Globe,
  ArrowRight,
  Rocket,
  Shield,
  Trophy,
  Target
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function GuideCard() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const steps = [
    {
      icon: UserPlus,
      title: "Create Your Account",
      description: "Sign up as a participant to get started with Vortexis. It's quick, free, and only takes a minute.",
      color: "from-blue-500 to-cyan-500",
      illustration: "👤"
    },
    {
      icon: Building2,
      title: "Create Organization",
      description: "Head to the organization dashboard and submit your organization details. Tell us about your vision!",
      color: "from-purple-500 to-pink-500",
      illustration: "🏢"
    },
    {
      icon: Clock,
      title: "Wait for Approval",
      description: "Our team at Vortexis will review your application. We'll notify you once approved (usually within 24-48 hours).",
      color: "from-orange-500 to-red-500",
      illustration: "⏳"
    },
    {
      icon: CheckCircle,
      title: "Organization Approved!",
      description: "Congratulations! Your organization is now live. Time to create amazing hackathons.",
      color: "from-green-500 to-emerald-500",
      illustration: "✅"
    },
    {
      icon: Zap,
      title: "Create Hackathons",
      description: "Start creating unlimited hackathons for your organization. Set prizes, themes, and dates!",
      color: "from-yellow-500 to-amber-500",
      illustration: "⚡"
    },
    {
      icon: Users,
      title: "Invite Moderators",
      description: "Scale your team by inviting moderators from anywhere in the world to help manage your organization.",
      color: "from-indigo-500 to-purple-500",
      illustration: "👥"
    }
  ];

  const features = [
    { icon: Globe, title: "Global Reach", description: "Connect with developers worldwide" },
    { icon: Trophy, title: "Unlimited Events", description: "Create as many hackathons as you want" },
    { icon: Shield, title: "Secure Platform", description: "Enterprise-grade security" },
    { icon: Target, title: "Easy Management", description: "Intuitive dashboard tools" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 ">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
              rotate: [0, -90, 0]
            }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full mb-6"
            >
              <Rocket className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                Complete Setup Guide
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Build Your Hackathon Empire
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
              From zero to organizing world-class hackathons in 6 simple steps
            </p>

            <div className="flex flex-wrap justify-center gap-8 mb-8">
              {[
                { number: "10K+", label: "Active Users" },
                { number: "500+", label: "Organizations" },
                { number: "2K+", label: "Hackathons" }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="max-w-5xl mx-auto mb-16">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl font-bold text-center mb-12 text-gray-800 "
            >
              Your Journey to Success
            </motion.h2>

            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setCurrentStep(index)}
                    className="cursor-pointer"
                  >
                    <div
                      className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 ${
                        isActive
                          ? "border-purple-500 scale-105"
                          : "border-transparent hover:border-purple-200"
                      }`}
                    >
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          <div
                            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
                          >
                            {index + 1}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            <h3 className="text-xl font-bold text-gray-800 ">
                              {step.title}
                            </h3>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300">
                            {step.description}
                          </p>
                        </div>

                        <motion.div
                          animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.5 }}
                          className="hidden md:block text-6xl"
                        >
                          {step.illustration}
                        </motion.div>
                      </div>

                      {index < steps.length - 1 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
                        >
                          <ArrowRight className="w-6 h-6 text-purple-400 rotate-90" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-5xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 ">
              Why Choose Vortexis?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-center"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800  mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-purple-100 mb-8">
                Create your organization today and start hosting amazing hackathons
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/organizer/create-hackathon')}
                  className="flex items-center justify-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <Building2 className="w-5 h-5" />
                  Create Organization
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/auth/signup')}
                  className="flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
                >
                  <UserPlus className="w-5 h-5" />
                  Sign Up First
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="max-w-3xl mx-auto mt-16 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-800  mb-4">
              Need Help?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Have questions? Check our documentation or contact our support team.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                📚 Documentation
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                💬 Contact Support
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}