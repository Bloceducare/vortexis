'use client';

import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/AuthButton";
import Image from "next/image";
import People from '@/public/assets/icon/people.svg'
import Document from '@/public/assets/icon/basil_document-outline.svg'
import Hacks from '@/public/assets/hackathon.svg'
import RegistrationTrend from "./components/RegistrationTrend";
import { useRouter } from "next/navigation";
import BlueTick from "@/public/assets/icon/blue_tick.svg"
import Speaker from "@/public/assets/icon/speaker.svg"
import New from "@/public/assets/icon/new.svg"



function Page() {
  const handleClick = () => {
    console.log("clicks");
  };
  const router = useRouter();

  const createHackathon = () => {
    router.push("/organizer/create-hackathon");
  }

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
      number: '243',
      word: '+42 from last month',
      icon: People,
      type: 'Participants'
    },
    {
      id: 2,
      number: '243',
      word: '+42 from last month',
      icon: People,
      type: 'Participants'
    },
    {
      id: 3,
      number: '243',
      word: '+42 from last month',
      icon: Document,
      type: 'Participants'
    },
    {
      id: 4,
      number: '243',
      word: '+42 from last month',
      icon: Document,
      type: 'Participants'
    },


  ]

  const Details = [
      {
        id: 1,
        number: '127',
        icon: People,
        type: 'Participants'
      }, 
      {
        id: 2,
        number: '28',
        icon: Document,
        type: 'Submission'
      }, 
      {
        id: 3,
        number: '6',
        icon: People,
        type: 'Judges'
      }, 
  ]

  const recentActivities = [
    {
      title: "New Registration",
      description: "You joined the AI Global Hackathon",
      icon: Document,
    },
    {
      title: "Review Completed",
      description: "Submitted a project to the Open Innovation Challenge",
      icon:  Document,
    },
    {
      title: "New Registration",
      description: "Received a message from the event organizer",
      icon:  Document,
    },
    {
      title: "Announcement Posted",
      description: "Global AI Agents League has concluded",
      icon:  Document,
    },
  ];

  

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
              Welcome back, Sharon!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              Here’s what happening with your hackathons.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <button
              onClick={createHackathon}
              className="px-7 py-4 bg-[#605DEC] text-white rounded-lg text-[16px] font-normal cursor-pointer hover:bg-[#7a78e1]"
            >
              Create Hackathon
            </button>
          </motion.div>
        </motion.div>


        <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
          <motion.h1
            className="text-[#00AC4F]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            Your Active Hackathons
          </motion.h1>

          <motion.div
          className="flex justify-between gap-2 mt-5"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
    {ActiveHackathons.map((active, index) => (
      <motion.div
        key={index}
        className="py-7 my-2 bg-white text-center border-2 border-[#E4E4E4]  space-y-5 rounded-2xl shadow-md w-[30%]"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.h1
          className="text-3xl font-semibold text-[#605DEC]"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {active.number}
        </motion.h1>
        <motion.p
          className="text-gray-600"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {active.word}
        </motion.p>
        <motion.div
          className="flex justify-center items-center gap-2 mt-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
              <Image src={active.icon} alt="icon" className="w-8 h-8" />
              <p className="text-gray-700">{active.type}</p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
        </motion.div>


        <motion.section
  className="flex justify-between gap-3 mt-10"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
  {/* Hackathon Details */}
  <motion.div
    className="w-1/2 bg-white border-2 border-[#E4E4E4] space-y-5 rounded-2xl shadow-md py-4 px-5 cursor-pointer"
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <div className="space-y-5 w-[90%]  px-2 xl:px-5">

    <div className="flex justify-start">
      <Image src={Hacks} alt="hacks" />
    </div>
    <div className="flex gap-10 items-center">
      <h1 className="font-semibold text-lg">Global AI Agents League</h1>
      <p className="text-[#3083FF] bg-[#EDF5FE] py-2 px-5 rounded-2xl flex gap-3 items-center">
        <span className="w-4 h-4 bg-[#3083FF] rounded-full"></span>
        Active
      </p>
    </div>
    <p>May 10, 2025 - May 31, 2025</p>
    <div className="flex justify-around">
      {Details.map((det, index) => (
        <motion.div
          key={index}
          className="flex flex-col gap-3 items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h1 className="text-xl xl:text-2xl font-bold">{det.number}</h1>
          <div className="flex gap-2 items-center flex-wrap xl:flex-nowrap justify-center">
            <Image src={det.icon} alt="icon" className="w-8 h-8" />
            <p>{det.type}</p>
          </div>
        </motion.div>
      ))}
    </div>

    </div>

  </motion.div>

  {/* Recent Activities */}
  <motion.div
    className="w-1/2 bg-white py-4 px-5 border-2 border-[#E4E4E4] space-y-5 rounded-2xl shadow-md "
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <h1 className="text-lg font-semibold">Recent Activities</h1>
    <p>Latest updates across all hackathons</p>
    <div className="space-y-3">
      {recentActivities.map((activity, index) => {
        const  icon  = getIcon(activity.title)

        return (
        <motion.div
          key={index}
          className="flex gap-3 items-center p-3 rounded-md cursor-pointer "
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-[#00AC4F38] p-3 rounded-full flex items-center justify-center">

          <Image
            src={icon}
            alt="activity icon"
            className="w-8 h-8"
            width={30}
            height={30}
          />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#212121]">{activity.title}</h2>
            <p className="text-[#212121BD] text-sm">{activity.description}</p>
            <p className="text-[#727272]">May 15, 2025 3:23 PM</p>
          </div>
        </motion.div>
)})}
    </div>
  </motion.div>
</motion.section>


<RegistrationTrend />


        

      </section>
    </>
  );
}

export default Page;