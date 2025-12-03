import { Users } from "lucide-react";
import Image from "next/image";
import overview1 from "@/public/assets/overview1.svg";
import overview2 from "@/public/assets/overview2.svg";
import bal from "@/public/assets/bal.svg";
export default function PlatformOverview() {
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-semibold text-center text-indigo-500 dark:text-indigo-400 mb-8">
        Platform Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Participants Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <Image
            src={overview1}
            alt="Person working on laptop with sticky notes"
            className="w-full h-full p-4 object-cover rounded"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex flex-col space-y-6">
            <div>
              <Image src={bal} alt="bal" className="w-7 h-7" />
            </div>
            <div className="flex items-center">
              <div>
                <Image src={bal} alt="bal" className="w-4 h-4" />
              </div>
              <div className="ml-4 text-indigo-500 dark:text-indigo-400 text-sm font-medium ">
                PARTICIPANTS
              </div>
            </div>

            <p className="ml-4 text-gray-700 dark:text-gray-300">
              Discover and join hackathons
            </p>

            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center">
                <Users size={20} className="text-gray-600 dark:text-gray-400" />
              </div>
              <p className="ml-4 text-gray-700 dark:text-gray-300">
                Form teams and submit projects
              </p>
            </div>

            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center">
                <Users size={20} className="text-gray-600 dark:text-gray-400" />
              </div>
              <p className="ml-4 text-gray-700 dark:text-gray-300">
                Access toolkits, APIs, and Live updates
              </p>
            </div>
          </div>
        </div>

        {/* Organizers Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ">
          <div className="flex flex-col space-y-6">
            <div>
              <Image src={bal} alt="bal" className="w-7 h-7" />
            </div>
            <div className="flex items-center">
              <div className="">
                <Image src={bal} alt="bal" className="w-4 h-4" />
              </div>
              <div className="ml-4 text-indigo-500 dark:text-indigo-400 text-sm font-medium ">
                ORGANIZERS
              </div>
            </div>
            <div className="flex items-center">
              <p className="ml-4 text-gray-700 dark:text-gray-300">
                Create & manage hackathons effortlessly
              </p>
            </div>

            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center">
                <Users size={20} className="text-gray-600 dark:text-gray-400" />
              </div>
              <p className="ml-4 text-gray-700 dark:text-gray-300">
                Invite judges, track teams, and monitor submissions
              </p>
            </div>

            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center">
                <Users size={20} className="text-gray-600 dark:text-gray-400" />
              </div>
              <p className="ml-4 text-gray-700 dark:text-gray-300">
                Access analytics on participation and engagement
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md ">
          <Image
            src={overview2}
            alt="Person gesturing during discussion with laptop"
            className="w-full h-full  p-4 object-cover rounded"
          />
        </div>
      </div>
    </div>
  );
}
