"use client";

import { Badge } from "@/components/ui/badge";
import useUser from "@/hooks/useUserProfile";
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe, FaPen, FaSpinner } from "react-icons/fa";
import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import SettingsPage from "../edit/components/Settings";
import Image from "next/image";
import LinkImg from "@/public/assets/icon/link.svg"
import LocationIcon from "@/public/assets/icon/location.svg"
import Hackathons from "./component/Hackathons";
import FirstTime from "./component/FirstTime";


const tabs = ["Hackathons", "Activity", "Badges"]

export default function ProfileView() {
  const [activeTab, setActiveTab] = useState("Hackathons")
  const { getUserDetail } = useUser();
  const router = useRouter()
  const [modal, setModal] = useState(false)
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  const { data, error, isLoading, isError, isFetching, refetch } = getUserDetail();

  const setUser = useUserStore.getState().setUser


  useEffect(() => {
    if (data) {
      setUser(data?.user);
    }
  }, [data, setUser]);

  const avatarColor = useMemo(() => {
    const colors = [
      "#FF5733", "#33B5E5", "#2ECC71", "#9B59B6",
      "#FFC300", "#FF6F61", "#16A085", "#E67E22"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  const user = data?.user ?? null;

  const initials = (
    `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`
  ).toUpperCase();


  useEffect(() => {
    const firstTimeUser = localStorage.getItem("isFirstTime")

    if(firstTimeUser) {
      setIsFirstTimeUser(true)
    }
 
  }, []);
 
  if (isLoading) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 pt-24 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-600 rounded-xl shadow-lg overflow-hidden animate-pulse mb-10 ">
          <div className="h-44 bg-gray-200" />
          <div className="pt-20 px-4 sm:px-6 pb-6">
            <div className="h-6 bg-gray-200 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
            <div className="h-4 bg-gray-200 rounded w-64 mt-4" />
            <div className="h-4 bg-gray-200 rounded w-40 mt-2" />
          </div>
        </div>
      </section>
    );
  }

  
  if (isError) {
    return (
      <section className="mb-10 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Unable to load profile</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {error?.message || "Something went wrong while fetching the profile."}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300"
            >
              Refresh page
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty / no user
  if (!user) {
    return (
      <section className="mb-10 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">No profile found</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">We couldn't find a profile for this account.</p>
          <div className="mt-4">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        </div>
      </section>
    );
  }


  return (
    <section className=" px-4 sm:px-6 lg:px-8 pt-24 bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">

      {isFirstTimeUser && <FirstTime onClose={() => setIsFirstTimeUser(false)} isOpen={isFirstTimeUser} />}

      <section className="flex gap-10 lg:gap-20 max-w-7xl mx-auto flex-col lg:flex-row">
        <section className="space-y-5 w-full lg:w-[35%] shrink-0">        
        <section className="flex justify-between items-center md:items-end">
          <div className=" text-start">
           <div
  className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center rounded-full border-4 border-white shadow-lg text-white text-3xl sm:text-4xl font-bold overflow-hidden"
  style={{ backgroundColor: avatarColor }}
  title={`${user.first_name ?? ""} ${user.last_name ?? ""}`}
>
  {user.profile?.profile_picture ? (
    <Image
      src={user.profile.profile_picture}
      width={200}
      height={200}
      alt="Profile Picture"
      className="w-full h-full object-cover"
    />
  ) : (
    initials || "?"
  )}
</div>


            <h1 className="text-2xl font-bold mt-4 mb-2 dark:text-white">{user.first_name} {user.last_name}</h1>
            <p className="text-gray-500 dark:text-gray-400">@{user.username ?? "unknown"}</p>

          </div>
        <div>
        <button
              className={`inline-flex items-center gap-2  hover:bg-[#8987ef] px-3 py-2 md:bg-[#605DEC] text-white rounded-full mb-4 ${
                isFetching ? "opacity-60 pointer-events-none" : ""
              }`}
              title="Edit Profile"
              onClick={() => setModal(true)}
            >
              <FaPen className="w-4 h-4" />
              <span className="text-sm font-medium hidden md:inline-block">Edit Profile</span>
            </button>
        </div>
        </section>
        <section className="flex justify-between items-center">
         {/* Badges + Info */}
        <section className="flex flex-col sm:flex-row sm:flex-wrap justify-between items-start sm:items-center gap-3">
  {/* Badges */}
  <div className="flex flex-wrap gap-2">
    {user.is_organizer && <Badge className="bg-blue-500">Organizer</Badge>}
    {user.is_participant && <Badge className="bg-green-500">Participant</Badge>}
    {user.is_judge && <Badge className="bg-yellow-500">Judge</Badge>}
  </div>

  {/* Location */}
  {user.profile?.location && (
    <div className="flex items-center gap-2 text-gray-600 mt-2 sm:mt-0">
      <Image src={LocationIcon} alt="location" className="w-4 h-4" />
      <span>{user.profile.location}</span>
    </div>
  )}

  {/* Language */}
  <div className="flex gap-2 items-center text-gray-600 mt-2 sm:mt-0">
    <FaGlobe />
    <span>English</span>
  </div>
</section>

     
      
        </section>
        {user.profile?.bio ? (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">About</h2>
              <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm md:text-lg">{user.profile.bio}</p>
            </div>
          ) : null}
{   user.profile?.website && (
              <a href={user.profile.website} target="_blank" rel="noopener noreferrer" className="flex gap-2 items-center text-[#605DEC] dark:text-indigo-400">
                <Image src={LinkImg}  alt="" />                    
                {user.profile?.website}
              </a>
            )}

<div className="mt-6 flex gap-4 text-xl text-gray-600 dark:text-gray-400">
            {user.profile?.github && (
              <a href={user.profile.github} target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </a>
            )}
            {user.profile?.linkedin && (
              <a href={user.profile.linkedin} target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
            )}
            {user.profile?.twitter && (
              <a href={user.profile.twitter} target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
            )}
         
          </div>
          <div className="mt-6 text-xl text-gray-600">
            <h1 className="text-[#212121] dark:text-white font-semibold">Skill and Interests</h1>

            {user.profile?.skills && user.profile.skills.length > 0 ? (
  <div className="flex flex-wrap gap-2 mt-5">
    {user.profile.skills.map((skill: { id: number; name: string }) => (
      <span
        key={skill.id}
        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-[#605DEC] dark:text-indigo-400 text-sm rounded-xl"
      >
        {skill.name.charAt(0).toUpperCase() + skill.name.slice(1)}
      </span>
    ))}
  </div>
) : (
  <p className="text-gray-500 dark:text-gray-400">No skills available</p>
)}
          </div>
          <div className="mt-6">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300"
            >
              {isFetching ? "Refreshing..." : "Refresh Profile"}
            </button>
          </div>   
        </section>
        <section className="w-full flex-1 min-w-0">
          <div className="flex justify-start">
          <div className="flex gap-2 md:gap-4 justify-start bg-[#F5F5F5] dark:bg-gray-800 py-2 px-3 rounded-full transition-colors">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 md:px-4 py-1 text-sm md:text-lg font-semibold rounded-full cursor-pointer transition-colors ${
                    activeTab === tab
                      ? "bg-[#605DEC] text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
    </div>
          </div>
       


        {activeTab === "Hackathons" && (
          <section className="mt-5"> 
            <Hackathons />
          </section>
        )}

        {activeTab === "Activity" && (
          <section className="mt-5 text-gray-600 dark:text-gray-400">
            Activity coming soon...
          </section>
        )}

        {activeTab === "Badges" && (
          <section className="mt-5 text-gray-600 dark:text-gray-400">
            Badges coming soon...
          </section>
        )}



        </section>
      </section>


      {modal && (
        <SettingsPage 
        onClose={() => setModal(false)}
        />
      )}
      
    </section>
  );
}
