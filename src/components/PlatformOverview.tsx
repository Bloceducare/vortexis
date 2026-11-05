import { Users, Compass, Rocket, BarChart3, Code2 } from "lucide-react";
import Image from "next/image";
import overview1 from "@/public/assets/overview1.svg";
import overview2 from "@/public/assets/overview2.svg";
import bal from "@/public/assets/bal.svg";

export default function PlatformOverview() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 sm:py-12 bg-white dark:bg-gray-900">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-indigo-500 dark:text-indigo-400 mb-6 sm:mb-8">
        Platform Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <Image
            src={overview1}
            alt="Person working on laptop with sticky notes"
            className="w-full h-full p-4 object-cover rounded"
          />
        </div>

       
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 sm:p-6">
          <div className="flex flex-col space-y-4 sm:space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center shrink-0">
                <Image src={bal} alt="bal" className="w-5 h-5" />
              </div>
              <span className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold tracking-wider uppercase">
                PARTICIPANTS
              </span>
            </div>

            <div className="space-y-3 sm:space-y-4 pt-1">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <Compass size={20} className="text-gray-600 dark:text-gray-400" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base pt-1">
                  Discover and join hackathons
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <Users size={20} className="text-gray-600 dark:text-gray-400" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base pt-1">
                  Form teams and submit projects
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <Code2 size={20} className="text-gray-600 dark:text-gray-400" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base pt-1">
                  Access toolkits, APIs, and Live updates
                </p>
              </div>
            </div>
          </div>
        </div>

       
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 sm:p-6">
          <div className="flex flex-col space-y-4 sm:space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center shrink-0">
                <Image src={bal} alt="bal" className="w-5 h-5" />
              </div>
              <span className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold tracking-wider uppercase">
                ORGANIZERS
              </span>
            </div>

            <div className="space-y-3 sm:space-y-4 pt-1">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <Rocket size={20} className="text-gray-600 dark:text-gray-400" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base pt-1">
                  Create & manage hackathons effortlessly
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <Users size={20} className="text-gray-600 dark:text-gray-400" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base pt-1">
                  Invite judges, track teams, and monitor submissions
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <BarChart3 size={20} className="text-gray-600 dark:text-gray-400" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base pt-1">
                  Access analytics on participation and engagement
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Organizers Section Image */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <Image
            src={overview2}
            alt="Person gesturing during discussion with laptop"
            className="w-full h-full p-4 object-cover rounded"
          />
        </div>
      </div>
    </div>
  );
}
