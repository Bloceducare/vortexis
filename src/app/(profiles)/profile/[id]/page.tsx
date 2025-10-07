"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import Image from "next/image";
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe } from "react-icons/fa";
import LinkImg from "@/public/assets/icon/link.svg";
import LocationIcon from "@/public/assets/icon/location.svg";
import { Badge } from "@/components/ui/badge";
import useUser from "@/hooks/useUserProfile";

const tabs = ["Hackathons", "Activity", "Badges"];

function SingleProfile() {
  const params = useParams();
  const userId = params?.id as string;

  const { getPublicUser } = useUser();
  const { data, error, isLoading, isError, refetch } = getPublicUser(userId);

  const [activeTab, setActiveTab] = useState("Hackathons");

  const user = data ?? null;

  const avatarColor = useMemo(() => {
    const colors = [
      "#FF5733", "#33B5E5", "#2ECC71", "#9B59B6",
      "#FFC300", "#FF6F61", "#16A085", "#E67E22"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  const initials = useMemo(
    () =>
      `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`.toUpperCase(),
    [user?.first_name, user?.last_name]
  );

  if (isLoading) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
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
      <section className="px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Unable to load profile
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {error?.message || "Something went wrong while fetching this profile."}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // 🚫 Empty State
  if (!user) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-800">No profile found</h2>
          <p className="text-sm text-gray-600 mt-2">
            We couldn't find a profile for this account.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-14 px-4 sm:px-6 lg:px-8 pt-24">
      <section className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto">
      
        <section className="space-y-5 w-full lg:w-[60%]">
          {/* Avatar + Name */}
          <section className="flex justify-between items-end">
            <div className="text-start">
              <div
                className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center rounded-full border-4 border-white shadow-lg text-white text-3xl sm:text-4xl font-bold"
                style={{ backgroundColor: avatarColor }}
                aria-label={`${user.first_name ?? ""} ${user.last_name ?? ""}`}
              >
                {initials || "?"}
              </div>
              <h1 className="text-2xl font-bold mt-4 mb-2">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-gray-500">@{user.username ?? "unknown"}</p>
            </div>
          </section>

          {/* Badges + Info */}
          <section className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {user.is_organizer && <Badge className="bg-blue-500">Organizer</Badge>}
              {user.is_participant && <Badge className="bg-green-500">Participant</Badge>}
              {user.is_judge && <Badge className="bg-yellow-500">Judge</Badge>}
            </div>
            {user.profile?.location && (
              <div className="flex items-center gap-2 text-gray-600">
                <Image src={LocationIcon} alt="location" />
                {user.profile.location}
              </div>
            )}
            <div className="flex gap-2 items-center text-gray-600">
              <FaGlobe /> English
            </div>
          </section>

          {/* About */}
          {user.profile?.bio && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800">About</h2>
              <p className="text-gray-700 mt-1">{user.profile.bio}</p>
            </div>
          )}

          {/* Website */}
          {user.profile?.website && (
            <a
              href={user.profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-2 items-center text-[#605DEC]"
            >
              <Image src={LinkImg} alt="website" />
              {user.profile.website}
            </a>
          )}

          {/* Socials */}
          <div className="mt-6 flex gap-4 text-xl text-gray-600">
            {user.profile?.github && (
              <a
                href={user.profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
              >
                <FaGithub />
              </a>
            )}
            {user.profile?.linkedin && (
              <a
                href={user.profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin />
              </a>
            )}
            {user.profile?.twitter && (
              <a
                href={user.profile.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter Profile"
              >
                <FaTwitter />
              </a>
            )}
          </div>

          {/* Skills */}
          <div className="mt-6">
            <h1 className="text-[#212121] font-semibold">Skills & Interests</h1>
            {user.profile?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {user.profile.skills.map((skill: any) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1 bg-blue-100 text-[#605DEC] text-sm rounded-xl"
                  >
                    {skill?.charAt(0).toUpperCase() + skill.slice(1)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-1">No skills available</p>
            )}
          </div>
        </section>

        {/* 📑 Right: Tabs + Content */}
        <section className="w-full">
          <div className="flex justify-start">
            <div className="flex gap-4 bg-[#F5F5F5] py-3 px-2 rounded-full">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 transition cursor-pointer ${
                    activeTab === tab
                      ? "font-semibold bg-[#605DEC] text-white rounded-full"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <section className="mt-5 text-gray-600">
            {activeTab === "Hackathons" && "Hackathons coming soon..."}
            {activeTab === "Activity" && "Activity coming soon..."}
            {activeTab === "Badges" && "Badges coming soon..."}
          </section>
        </section>
      </section>
    </section>
  );
}

export default SingleProfile;
