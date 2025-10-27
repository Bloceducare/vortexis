"use client";

import type React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useJudgedHackathons } from "@/hooks/useJudges";
import Spinner from "@/components/spinner";
import {
  Calendar,
  Code,
  Trophy,
  Clock,
  CheckCircle,
  TrendingUp,
  FileText,
} from "lucide-react";
import useUser from "@/hooks/useUserProfile";
import { Submission } from "@/hooks/useHackathonDetails";
import HtmlContent from "@/components/ui/HtMLContent";

interface SubmissionStatusItem {
  number: number;
  status: string;
  icon: React.ReactNode;
}

interface HackathonJudged {
  id: string;
  title: string;
  description: string;
  end_date: string;
  status?: string;
}

function Page() {
  const { getUserDetail } = useUser();
  const { data } = getUserDetail();
  const [judgename, setJudgename] = useState<{ username: string } | null>(null);
  // const { hackathons: submission } = useHackathon();

  useEffect(() => {
    console.log(data);
    console.log(data?.user);
    setJudgename(data?.user);
  }, [data]);

  const { hackathons, loading, error } = useJudgedHackathons();
  const hackathonsNo = hackathons.length;

  // Get all submissions from all hackathons for calculating totals
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  // Function to fetch submissions for all hackathons
  useEffect(() => {
    const fetchAllSubmissions = async () => {
      if (hackathons.length === 0) return;

      setSubmissionsLoading(true);
      try {
        const bearerToken = localStorage.getItem("access_token");
        if (!bearerToken) return;

        // Fetch submissions for each hackathon
        const submissionPromises = hackathons.map(async (hackathon) => {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/hackathon/${hackathon.id}/submissions/`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${bearerToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const submissions = await response.json();
            return submissions;
          }
          return [];
        });

        const allSubmissionsArrays = await Promise.all(submissionPromises);
        const flattenedSubmissions = allSubmissionsArrays.flat();
        setAllSubmissions(flattenedSubmissions);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setSubmissionsLoading(false);
      }
    };

    fetchAllSubmissions();
  }, [hackathons]);

  // Calculate review statistics using useMemo for performance
  const reviewStats = useMemo(() => {
    if (!allSubmissions || allSubmissions.length === 0) {
      return {
        totalSubmissions: 0,
        pendingReviews: 0,
        completedReviews: 0,
        progressPercentage: 0,
      };
    }

    // Filter submissions based on status and reviews array
    const completedReviews = allSubmissions.filter((submission) => {
      // Check if status is "reviewed" OR if reviews array has items
      return (
        submission.status === "reviewed" ||
        (submission.reviews && submission.reviews.length > 0)
      );
    }).length;

    const totalSubmissions = allSubmissions.length;
    const pendingReviews = totalSubmissions - completedReviews;
    const progressPercentage =
      totalSubmissions > 0
        ? Math.round((completedReviews / totalSubmissions) * 100)
        : 0;

    return {
      totalSubmissions,
      pendingReviews,
      completedReviews,
      progressPercentage,
    };
  }, [allSubmissions]);

  // Dynamic submission status with real data
  const SubmissionStatus: SubmissionStatusItem[] = [
    {
      number: reviewStats.pendingReviews,
      status: "submission pending",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      number: reviewStats.completedReviews,
      status: "reviews completed",
      icon: <CheckCircle className="w-5 h-5" />,
    },
    {
      number: hackathonsNo,
      status: "active hackathons",
      icon: <Trophy className="w-5 h-5" />,
    },
  ];

  if (hackathons.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 px-6 py-12">
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center border border-[#E4E4E4]">
            <div className="relative">
              <Trophy className="w-12 h-12 text-blue-500" />
              <Code className="w-8 h-8 text-purple-500 absolute -bottom-2 -right-2 bg-white rounded-full p-1" />
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-200 rounded-full animate-pulse delay-300"></div>
        </motion.div>

        <motion.div
          className="text-center max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            No Hackathons Found
          </h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            There are currently no hackathons to display. Check back later or
            explore other sections to discover exciting coding competitions.
          </p>
          <Link href="/">
            <button className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm">
              Return to Dashboard
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (loading || submissionsLoading) return <Spinner />;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-[#605DEC]">
          Welcome, {judgename?.username || "Judge"}!
        </h1>
        <p className="text-gray-600 text-lg">
          Your judging dashboard provides an overview of your assigned
          hackathons and pending reviews.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        {SubmissionStatus.map((status, i) => (
          <motion.div
            key={i}
            className={`bg-[#FFFFFF] border-[#E4E4E4] border rounded-xl p-6 hover:shadow-md transition-all duration-300 cursor-pointer group`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 * i }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`text-[#00AC4F] group-hover:scale-110 transition-transform duration-200`}
              >
                {status.icon}
              </div>
              <div className={`text-3xl font-bold text-[#00AC4F]`}>
                {status.number}
              </div>
            </div>
            <h3 className="font-semibold text-[#605DEC] text-sm uppercase tracking-wide">
              {status.status}
            </h3>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="bg-white border border-[#E4E4E4] rounded-xl p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-[#605DEC]" />
          <h2 className="text-xl font-bold text-gray-800">Review Progress</h2>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">
            {reviewStats.completedReviews} of {reviewStats.totalSubmissions}{" "}
            reviews completed
          </span>
          <span className="text-2xl font-bold text-[#605DEC]">
            {reviewStats.progressPercentage}%
          </span>
        </div>

        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${reviewStats.progressPercentage}%` }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full bg-[#605DEC] rounded-full shadow-sm"
          />
        </div>

        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>Started</span>
          <span>In Progress</span>
          <span>Complete</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <Code className="w-6 h-6 text-[#00AC4F]" />
          <h2 className="text-2xl font-bold text-[#00AC4F]">
            Hackathons You're Judging
          </h2>
        </div>

        <div className="grid gap-6">
          {hackathons.map((hackathon, i) => (
            <motion.div
              key={hackathon.id}
              className="bg-white border border-[#E4E4E4] rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 * i }}
              whileHover={{ y: -2 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#605DEC] transition-colors duration-200">
                    {hackathon.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#164E04] text-white text-xs font-medium rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      {hackathon.status || "Active"}
                    </span>
                  </div>
                </div>

                <Link href={`/judges/dashboard/${hackathon.id}`}>
                  <button className="px-6 py-2.5 cursor-pointer bg-[#605DEC] text-white font-medium rounded-lg hover:bg-[#4c47d4] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#605DEC] focus:ring-offset-2 shadow-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Review Submissions
                  </button>
                </Link>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-gray-600 font-medium min-w-[80px]">
                    Title:
                  </span>
                  <span className="text-[#605DEC]">
                    <HtmlContent html={hackathon.description} />
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 font-medium">Due date:</span>
                  <span className="text-[#AC0000] font-medium">
                    {hackathon.end_date}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Page;
