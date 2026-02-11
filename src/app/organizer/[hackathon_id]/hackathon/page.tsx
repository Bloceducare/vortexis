"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Hacks from "@/public/assets/hackathon.svg";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import useOrganizer from "@/hooks/useOrganizers";
import HtmlContent from "@/components/ui/HtMLContent";
import { useRouter } from "next/navigation";
import EditHackathonModal from "./modal/EditModal";
import {
  Edit,
  Calendar,
  MapPin,
  Award,
  Users,
  FileText,
  Clock,
    ExternalLink,

} from "lucide-react";

function Page() {
  const params = useParams();
  const hackathon_id = params?.hackathon_id as string;
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);

  function safeParseContent(content: string | null | undefined): string {
    if (!content) return "";
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed.join("");
      }
      if (typeof parsed === "string") {
        return parsed;
      }
      return "";
    } catch {
      return content;
    }
  }

  const { getHackathonById } = useOrganizer();
  const { data, isLoading, error } = getHackathonById(hackathon_id);

  const getHackathonStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now < start) return { label: "Upcoming", color: "bg-blue-500" };
    if (now >= start && now <= end)
      return { label: "Active", color: "bg-green-500" };
    return { label: "Finished", color: "bg-red-500" };
  };

  const status = getHackathonStatus(data?.start_date, data?.end_date);

  const ActiveHackathons = [
    {
      id: 1,
      number: data?.submissions_count,
      icon: FileText,
      link: `/organizer/${hackathon_id}/submission`,
      type: "Submissions",
      color: "bg-purple-50 text-purple-600",
    },
    {
      id: 2,
      number: data?.participants_count,
      icon: Users,
      link: `/organizer/${hackathon_id}/participants`,
      type: "Participants",
      color: "bg-blue-50 text-blue-600",
    },
    {
      id: 3,
      number: data?.judges?.length || 0,
      icon: Users,
      link: `/organizer/${hackathon_id}/judges`,
      type: "Judges",
      color: "bg-green-50 text-green-600",
    },
  ];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const viewProfiles = (id: any) => {
    router.push(`/profile/${id}`)
  }

  if (isLoading) {
    return (
      <section className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
              >
                <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
<div
  className="
bg-[#EFEDFF] text-[#1A1C1E]    dark:bg-gradient-to-r dark:from-[#605DEC] dark:to-[#8B5CF6]
    dark:text-white
    md:p-8 p-3
  "
>
            <div className="flex justify-between items-start">
              <div className="md:flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 mb-4">

                  <Badge
                    className={`${status.color} text-white px-3 py-1 text-xs font-semibold`}
                  >
                    {status.label}
                  </Badge>
               <Badge className=" bg-[#605DEC]/10 text-[#605DEC] border border-[#605DEC]/20  dark:bg-white/20 dark:text-white dark:border-transparent px-3 py-1 text-xs font-medium rounded-full">
              {data?.visibility ? "Public" : "Private"}
            </Badge>
                              </div>


                  <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center cursor-pointer gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-200 border border-white/30"
              >
                <Edit size={18} />
                <span>Edit</span>
              </button>
                </div>
              
              </div>
          
     
            </div>
                <div className="mt-5">
     <h1 className="text-2xl md:text-4xl font-bold mb-3">{data?.title}</h1>
                <div className=" ">
                  <HtmlContent html={data?.description}  />
                </div>
              </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {ActiveHackathons.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.id}
                onClick={() => router.push(stat.link)}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                      {stat.type}
                    </p>
                    <h3 className="text-4xl font-bold text-gray-800 dark:text-white">
                      {stat.number || 0}
                    </h3>
                  </div>
                  <div
                    className={`${stat.color} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent size={28} strokeWidth={2} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Event Details Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md transition-colors">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <Calendar className="text-[#605DEC]" size={24} />
                Event Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Calendar className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Duration
                    </p>
                    <p className="text-gray-800 dark:text-white font-semibold">
                      {formatDate(data?.start_date)}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      to {formatDate(data?.end_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Clock className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Submission Deadline
                    </p>
                    <p className="text-gray-800 dark:text-white font-semibold">
                      {formatDate(data?.submission_deadline)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <MapPin className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Venue
                    </p>
                    <p className="text-gray-800 dark:text-white font-semibold">
                      {data?.venue}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Award className="text-yellow-600" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Grand Prize
                    </p>
                    <p className="text-gray-800 dark:text-white font-semibold">
                      ₦{data?.grand_prize?.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <Users className="text-indigo-600" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Team Size
                    </p>
                    <p className="text-gray-800 dark:text-white font-semibold">
                      {data?.min_team_size} - {data?.max_team_size} members
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Prizes Card */}
            {data?.prizes && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md transition-colors">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Award
                    className="text-[#605DEC] dark:text-indigo-400"
                    size={24}
                  />
                  Other Prizes
                </h2>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-xl">
                  <HtmlContent html={safeParseContent(data?.prizes)} />
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md transition-colors">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FileText
                  className="text-[#605DEC] dark:text-indigo-400"
                  size={24}
                />
                Rules & Guidelines
              </h2>
              <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
                <HtmlContent html={safeParseContent(data?.rules)} />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md transition-colors">
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20">
                <Image
                  src={data?.banner_image || Hacks}
                  width={200}
                  height={200}
                  alt="hackathon"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white text-center">
                {data?.title}
              </h3>
            </div>

            {data?.judges?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md transition-colors">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Users
                    className="text-[#605DEC] dark:text-indigo-400"
                    size={20}
                  />
                  Judges ({data.judges.length})
                </h2>
                <div className="space-y-3">
                  {data.judges.map((judge: any, index: number) => {
                    const initials = judge.username
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase();

                    return (
                        <motion.div
                              key={index}
                              whileHover={{ x: 4 }}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl  transition-colors cursor-pointer"
                              onClick={() => viewProfiles(judge.id)}
                            >
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700  transition-colors cursor-pointer"
                      >
                      
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#605DEC] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm">
                          {initials}
                        </div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {judge.username}
                        </p>
                                              </div>


                         <ExternalLink className="w-4 h-4  opacity-40" />
</motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {showEditModal && (
        <EditHackathonModal
          onClose={() => setShowEditModal(false)}
          hackathonId={hackathon_id}
          currentData={{
            title: data?.title,
            grand_prize: data?.grand_prize,
            venue: data?.venue,
            min_team_size: data?.min_team_size,
            max_team_size: data?.max_team_size,
            submission_deadline: data?.submission_deadline,
            end_date: data?.end_date,
          }}
        />
      )}
    </section>
  );
}

export default Page;
