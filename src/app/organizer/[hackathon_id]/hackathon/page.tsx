'use client';

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import People from '@/public/assets/icon/people.svg'
import Document from '@/public/assets/icon/basil_document-outline.svg'
import Hacks from '@/public/assets/hackathon.svg'
import BlueTick from "@/public/assets/icon/blue_tick.svg"
import Speaker from "@/public/assets/icon/speaker.svg"
import New from "@/public/assets/icon/new.svg"
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import useOrganizer from "@/hooks/useOrganizers";
import HtmlContent from "@/components/ui/HtMLContent";
import { useRouter } from "next/navigation";


function Page() {
  const params = useParams()
  const hackathon_id = params?.hackathon_id as string;
  const router = useRouter()

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



  const { getHackathonById } = useOrganizer()

  const { data, isLoading, error } = getHackathonById(hackathon_id)
 



  console.log(data)


  const getHackathonStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    if (now < start) return { label: "Upcoming", color: "blue" };
    if (now >= start && now <= end) return { label: "Active", color: "green" };
    return { label: "Finished", color: "red" };
  };
  
  const status = getHackathonStatus(data?.start_date, data?.end_date);
  

  const getIcon = (title: string) => {
    switch (title) {
      case 'New Registration':
        return  Document
      case 'Review Completed':
        return BlueTick
      case 'Announcement Posted':
        return Speaker
      case 'New Registration':
        return New
    }
  };

  const ActiveHackathons = [
    {
      id: 1,
      number: data?.submissions_count,
      word: '',
      icon: Document,
      link: `/organizer/${hackathon_id}/submission`,
      type: 'Submissions'
    },
    {
      id: 2,
      number: data?.participants_count,
      word: '',
      icon: People,
      link: `/organizer/${hackathon_id}/participants`,
      type: 'Participants'
    },
    {
      id: 3,
      number: data?.judges.length,
      icon: People,
      link: `/organizer/${hackathon_id}/judges`,
      type: 'judges'
    },


  ]

  const Details = [
      {
        id: 1,
        number: data?.submissions_count,
        icon: People,
        type: 'Participants'
      }, 
      {
        id: 2,
        number: data?.submissions_count,
        icon: Document,
        type: 'Submission'
      }, 
      {
        id: 3,
        number: data?.judges.length,
        icon: People,
        type: 'Judges'
      }, 
  ]

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <section className="w-full min-h-screen flex items-center justify-center bg-white rounded-2xl animate-pulse">
        <section className="mb-10 px-4 sm:px-6 lg:px-8 pt-24 w-full">
          <div className="  overflow-hidden animate-pulse p-6 w-full">
            {/* Title */}
            <div className="h-8 bg-gray-200 rounded w-40 mb-4" />
  
            {/* Intro paragraph */}
            <div className="space-y-2 mb-6">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-11/12" />
              <div className="h-4 bg-gray-200 rounded w-10/12" />
            </div>
  
            {/* Hackathon Overview Heading */}
            <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
  
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white border rounded-lg shadow p-6 flex flex-col items-center w-full"
                >
                  <div className="h-6 w-6 bg-gray-200 rounded-full mb-2" />
                  <div className="h-6 bg-gray-200 rounded w-6 mb-1" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
              ))}
            </div>
  
            {/* Hackathon image + name */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full" />
              <div className="h-6 bg-gray-200 rounded w-32" />
            </div>
  
            {/* Status badges */}
            <div className="flex gap-3">
              <div className="h-6 bg-gray-200 rounded w-16" />
              <div className="h-6 bg-gray-200 rounded w-14" />
            </div>
          </div>
        </section>
      </section>
    );
  }
  
  
  

  return (
    <>
      <section className="bg-white px-10 rounded-2xl py-5 mb-5 shadow-xl">
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="space-y-4">
            <motion.h1
              className="text-[#605DEC] font-bold text-3xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {data?.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              
              <HtmlContent html={data?.description} />

            </motion.p>
          </div>
        </motion.div>


        <motion.div
  className="mt-10"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  <motion.h1
    className="text-[#1D4ED8] text-2xl font-semibold mb-6"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
  >
    Hackathon Overview
  </motion.h1>

  <motion.div
    className="flex flex-wrap gap-6"
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.15,
        },
      },
    }}
  >
    {ActiveHackathons.map((active, index) => (
      <motion.div
        key={index}
        className="w-full sm:w-[48%] md:w-[30%] bg-white border-2 border-[#E4E4E4] rounded-2xl shadow-md p-6 text-center space-y-4 transition hover:shadow-lg cursor-pointer"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onClick={() => router.push(active.link)}
      >
        <motion.h1
          className="text-3xl font-bold text-[#605DEC]"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {active.number}
        </motion.h1>

        <motion.p
          className="text-gray-600 text-sm"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {active.word}
        </motion.p>

        <motion.div
          className="flex justify-center items-center gap-2"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Image src={active.icon} alt="icon" className="w-6 h-6" />
          <p className="text-gray-700 text-sm">{active.type}</p>
        </motion.div>
      </motion.div>
    ))}
  </motion.div>
</motion.div>


        <motion.section
  className="flex  gap-3 mt-10"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>

  <motion.section
          className="flex justify-between gap-3 mt-10 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
   <motion.div
  className="w-full bg-white py-6 px-6 transition"
  initial={{ opacity: 0, x: -50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  {/* Header with badge */}
  <div className="flex justify-between items-center mb-4">
    <div className="w-44 h-40 rounded-full overflow-hidden">
      <Image src={Hacks} alt="hack" className="w-full h-full object-cover" />
    </div>
    <Badge
      className={`capitalize rounded-full px-3 py-1 text-white text-sm font-semibold bg-${status.color}-500`}
    >
      {status.label}
    </Badge>
  </div>

  <div className="space-y-4">
    <div className="flex justify-between items-center flex-wrap gap-3">
      <h1 className="font-semibold text-xl">{data?.title}</h1>
      <p className="text-[#3083FF] bg-[#EDF5FE] py-1 px-3 rounded-full text-sm">
        {data?.visibility ? "Public" : "Private"}
      </p>
    </div>

    <p className="text-gray-600 text-sm">
      {formatDate(data?.start_date)} - {formatDate(data?.end_date)}
    </p>

    {/* Info Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-4 text-sm">
      <div>
        <p className="font-bold">Venue:</p>
        <p>{data?.venue}</p>
      </div>
      <div>
        <p className="font-bold">Grand Prize:</p>
        <p>₦{data?.grand_prize?.toLocaleString()}</p>
      </div>
      <div>
        <p className="font-bold">Team Size:</p>
        <p>
          {data?.min_team_size} - {data?.max_team_size} members
        </p>
      </div>

      {/* Other Prizes */}
      {data?.prizes && (
        <div className="col-span-1 sm:col-span-2 md:col-span-3">
          <p className="font-bold">Other Prizes:</p>
          <div className="flex flex-wrap gap-2 mt-1">
          
              <span
                className=" px-3 py-1 rounded-full text-sm"
              >
                   <HtmlContent html={safeParseContent(data?.prizes)} />
              </span>
          </div>
        </div>
      )}
    </div>

    {/* Rules */}
    <div className="mt-6">
      <p className="font-bold mb-2">Rules:</p>
      <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
      
          <p>                       <HtmlContent html={safeParseContent(data?.rules)} />

</p>
      </ul>
    </div>

    {/* Judges */}
    {data?.judges?.length > 0 && (
  <div className="mt-6">
    <p className="font-bold mb-2">Judges:</p>
    <div className="flex flex-wrap gap-4">
      {data.judges.map((judge: any, index: number) => {
        const initials = judge.name
          ?.split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase();

        return (
          <div
            key={index}
            className="flex items-center gap-3 bg-gray-50 rounded-lg p-2 shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {initials}
            </div>
            <p className="text-sm font-medium text-gray-800">{judge.name}</p>
          </div>
        );
      })}
    </div>
  </div>
)}


    {/* Stats Section */}
    <div className="flex justify-around mt-8 border-t pt-5">
      {Details.map((det, index) => (
        <motion.div
          key={index}
          className="flex flex-col gap-2 items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h1 className="text-xl font-bold">{det.number}</h1>
          <div className="flex items-center gap-2">
            <Image src={det.icon} alt="icon" className="w-6 h-6" />
            <p className="text-sm">{det.type}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</motion.div>


        </motion.section>

 
</motion.section>
      </section>
    </>
  );
}

export default Page;