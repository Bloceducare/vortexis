"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useJudgedHackathons } from "@/hooks/useJudges";
import { useHackathon } from "@/hooks/useHackathonDetails";
import Spinner from "@/components/spinner";
import { Calendar, Code, Trophy } from "lucide-react";
import useUser from "@/hooks/useUserProfile";

interface SubmissionStatusItem {
  number: number;
  status: string;
}

interface HackathonJudged {
  id: string;
  title: string;
  description: string;
  end_date: string;
  status?: string;
  // reviews_completed: string;
}

const SubmissionStatus: SubmissionStatusItem[] = [
  { number: 12, status: "submission pending" },
  { number: 12, status: "submission pending" },
  { number: 12, status: "submission pending" },
];

function Page() {
  const { getUserDetail } = useUser();
  const { data } = getUserDetail();
  const [judgename, setJudgename] = useState<{ username: string } | null>(null);

  useEffect(() => {
    console.log(data);
    console.log(data?.user);
    setJudgename(data?.user);
  }, [data]);

  const { hackathons, loading, error } = useJudgedHackathons();

  if (hackathons.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 px-6 py-12">
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center">
            <div className="relative">
              <Trophy className="w-10 h-10 text-blue-500" />
              <Code className="w-6 h-6 text-purple-500 absolute -bottom-1 -right-1" />
              <Calendar className="w-5 h-5 text-gray-400 absolute -top-1 -left-1" />
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-purple-200 rounded-full animate-pulse delay-300"></div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No Hackathons Found
        </h3>

        <p className="text-gray-600 text-center max-w-md mb-6 leading-relaxed">
          There are currently no hackathons to display. Check back later or
          explore other sections to discover exciting coding competitions.
        </p>

        <Link href="/">
          <p className="px-6 py-2.5 w-full m-auto bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Return to DashBoard{" "}
          </p>
        </Link>
      </div>
    );
  }

  if (loading) return <Spinner />;
  // const { hackathon } = useHackathon("22");

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
          type: "spring",
          delay: 0.1,
        }}
      >
        <h1 className="font-bold text-2xl text-[#605DEC]">
          Welcome, {judgename?.username}!
        </h1>
        <p className="text-sm mt-4">
          Your judging dashboard provides an overview of your assigned
          hackathons and pending reviews.
        </p>
      </motion.div>

      <motion.div
        className="md:flex hidden justify-between flex-wrap gap-4 mt-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
          delay: 0.2,
        }}
      >
        {SubmissionStatus.map((status, i) => (
          <motion.div
            key={i}
            className="w-[31%] my-5 bg-[#FFFFFF] h-40 flex flex-col border border-[#E4E4E4] justify-center pl-8 rounded-lg shadow-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
              delay: 0.2 * i,
            }}
            whileHover={{ scale: 1.05 }}
          >
            <div>
              <p className="text-[#00AC4F] font-bold">{status.number}</p>
              <p className="text-[#605DEC] font-semibold">{status.status}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        className="w-full max-w-full my-5 p-2 bg-white rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
      >
        <p className="font-semibold text-xl mb-3">Review Progress</p>
        <p className="flex justify-between mb-5">
          <span className="text-sm">8 of 20 reviews completed</span>
          <span className="text-sm">40%</span>
        </p>
        <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-[#605DEC] rounded-full transition-all duration-500 ease-in-out"
            style={{ width: "40%" }}
          />
        </div>
      </motion.div>

      {/* Hackathons judged */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
      >
        <h2 className="text-[#00AC4F] text-xl font-semibold">
          Hackathons You're Judging
        </h2>
        <div className="flex flex-col gap-6 py-4">
          {hackathons.map((hackathon, i) => (
            <motion.div
              key={`${hackathon.id}`}
              className="shadow-md border border-[#E4E4E4] rounded-lg bg-white py-8 md:px-4 px-2 space-y-1.5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: 0.4 * i,
              }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold">{hackathon.title}</h2>
                <Link
                  href={`/judges/dashboard/${hackathon.id}`}
                  className="hidden md:block"
                >
                  <p className="bg-[#605DEC] text-sm cursor-pointer rounded-md text-center px-2 py-1 text-white">
                    Review submission
                  </p>
                </Link>
              </div>
              <p className="bg-[#164E04] pb-0.5 rounded-full text-white w-15 h-5 flex items-center justify-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full mt-0.5 inline-block"></span>
                <span className="text-xs">{hackathon.status}</span>
              </p>
              <p>
                Title:{" "}
                <span className="text-[#605DEC]">{hackathon.description}</span>
              </p>
              <p>
                Due date:{" "}
                <span className="text-[#AC0000]">{hackathon.end_date}</span>
              </p>
              {/* <p>
                Reviews completed{" "}
                <span className="text-[#00AC4F]">
                  {judge.reviews_completed}
                </span>
              </p> */}
              <Link
                href={`/judges/dashboard/${hackathon.id}`}
                className="md:hidden block w-3/4 mx-auto mt-3"
              >
                <p className="bg-[#605DEC] text-sm cursor-pointer rounded-md text-center px-2 py-1 text-white">
                  Review submission
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Page;
