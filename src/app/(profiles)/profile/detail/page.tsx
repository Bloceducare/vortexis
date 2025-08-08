"use client";

import { Badge } from "@/components/ui/badge";
import useUser from "@/hooks/useUserProfile";
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe, FaPen, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function ProfileView() {
  const { getUserDetail } = useUser();
  const router = useRouter()

  // assume getUserDetail returns a react-query hook result
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

  // Loading state (first load)
  if (isLoading) {
    return (
      <section className="mb-10 px-4 sm:px-6 lg:px-8 pt-24">
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

  // Error state
  if (isError) {
    return (
      <section className="mb-10 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Unable to load profile</h2>
          <p className="text-sm text-gray-600 mb-4">
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
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
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
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-800">No profile found</h2>
          <p className="text-sm text-gray-600 mt-2">We couldn't find a profile for this account.</p>
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

  // Normal render (data available)
  return (
    <section className="mb-10 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="h-44 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          <div className="absolute -bottom-16 left-6">
            <div
              className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center rounded-full border-4 border-white shadow-lg text-white text-3xl sm:text-4xl font-bold"
              style={{ backgroundColor: avatarColor }}
              title={`${user.first_name ?? ""} ${user.last_name ?? ""}`}
            >
              {initials || "?"}
            </div>
          </div>
        </div>

        <div className="pt-20 px-4 sm:px-6 pb-6">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/profile/edit"
              className={`inline-flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-full mb-4 ${
                isFetching ? "opacity-60 pointer-events-none" : ""
              }`}
              title="Edit Profile"
            >
              <FaPen className="w-4 h-4" />
              <span className="text-sm font-medium">Edit Profile</span>
            </Link>

            {/* small fetching indicator */}
            {isFetching && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaSpinner className="animate-spin" />
                <span>Updating...</span>
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold">{user.first_name} {user.last_name}</h1>
          <p className="text-gray-500">@{user.username ?? "unknown"}</p>
          <p className="text-gray-600">{user.email ?? ""}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {user.is_organizer && <Badge className="bg-blue-500 cursor-pointer"  onClick={() => router.push("/organizer")}>Organizer</Badge>}
            {user.is_participant && <Badge className="bg-green-500 cursor-pointer" onClick={() => router.push("/dashboard")}>Participant</Badge>}
            {user.is_judge && <Badge className="bg-yellow-500 cursor-pointer"  onClick={() => router.push("/judges")}>Judge</Badge>}
          </div>

          {user.profile?.bio ? (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800">About</h2>
              <p className="text-gray-700 mt-1">{user.profile.bio}</p>
            </div>
          ) : null}

          {user.profile?.skills?.length > 0 ? (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.profile.skills.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex gap-4 text-xl text-gray-600">
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
            {user.profile?.website && (
              <a href={user.profile.website} target="_blank" rel="noopener noreferrer">
                <FaGlobe />
              </a>
            )}
          </div>

          {/* optional: manual refetch button */}
          <div className="mt-6">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="px-3 py-2 rounded-md border hover:bg-gray-50"
            >
              {isFetching ? "Refreshing..." : "Refresh Profile"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
