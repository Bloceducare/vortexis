"use client";

import React, { useState, useEffect } from "react";
import useHackathon from "@/hooks/useHackathon";
import { useParams } from "next/navigation";
import HtmlContent from "@/components/ui/HtMLContent";
import { MapPin, Trophy, Users, FileText, CheckCircle, AlertTriangle, Info  } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

function Hack() {
  const { id } = useParams();
  const { getHackathonById } = useHackathon();
  const { data, isLoading, error } = getHackathonById(id as string);

  const [review, setReview] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [countdown, setCountdown] = useState("");
  const user = useUserStore.getState().user

  const handleAddComment = () => {
    if (!review.trim()) return;
    setComments((prev) => [...prev, review]);
    setReview("");
  };

  // Format date to: "1 Dec, 2025"
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  // Countdown timer
  useEffect(() => {
    if (!data?.start_date) return;

    const interval = setInterval(() => {
      const start = new Date(data.start_date).getTime();
      const now = new Date().getTime();
      const diff = start - now;

      if (diff <= 0) {
        clearInterval(interval);
        setCountdown("🚀 Hackathon is live!");
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data?.start_date]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4 animate-pulse">
        <div className="h-10 w-1/2 bg-gray-300 rounded"></div>
        <div className="h-6 w-full bg-gray-300 rounded"></div>
        <div className="h-6 w-full bg-gray-300 rounded"></div>
        <div className="h-48 w-full bg-gray-300 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-center text-red-500">
          Failed to load hackathon. Please try again later.
        </p>
      </div>
    );
  }

  // --- Main Content ---
  return (
    <div>
      {data && (
        <>
     
          <div
            className="relative h-[50vh] w-full overflow-hidden"
            style={{
              backgroundImage: `url(${data.banner_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4">
                {data.title}
              </h1>
              <p className="text-gray-200 text-lg md:text-xl">
                {formatDate(data.start_date)} – {formatDate(data.end_date)}
              </p>
              <p className="text-gray-300">{data.venue}</p>
              <p className="text-blue-300 font-semibold mt-4 text-lg">
                ⏳ {countdown}
              </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-6">
  <div className="mt-6">
    <div>
      <h1 className="text-3xl font-bold">{data.title}</h1>
    </div>

    <div className="space-y-4 mt-4">
      {/* Grand Prize */}
      {data.grand_prize && (
        <p className="text-lg font-semibold text-green-700 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Grand Prize: ${data.grand_prize}
        </p>
      )}

      {/* Venue */}
      {data.venue && (
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin className="w-5 h-5 text-red-500" />
          <p>{data.venue}</p>
        </div>
      )}
    </div>
  </div>

  <div className="mt-8">
    <h1 className="text-2xl font-semibold flex items-center gap-2">
      <FileText className="w-6 h-6 text-blue-600" />
      Overview
    </h1>
    <HtmlContent html={data.description} />
  </div>

  <div className="mt-10">
  <h1 className="text-2xl font-semibold mb-4 flex items-center gap-2">
    <Info className="w-6 h-6 text-blue-500" />
    Rules
  </h1>

  <div className="space-y-4">
    <div className="flex items-start gap-3">
      <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
      <HtmlContent html={data?.rules} />
    </div>

    <div className="flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1" />
      <p className="text-gray-700">
        Please make sure to follow all rules carefully to avoid issues.
      </p>
    </div>
  </div>
</div>

  

  <div className="mt-10">
    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
      <Users className="w-6 h-6 text-purple-600" />
      Additional Requirements
    </h2>

    <div className="w-full">
      <HtmlContent html={data?.prizes} />
    </div>

    {/* Team Sizes */}
    <div className="flex gap-6 mt-4 text-gray-800">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-green-600" />
        Min Team Size: {data?.min_team_size}
      </div>
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-red-600" />
        Max Team Size: {data?.max_team_size}
      </div>
    </div>
  </div>




</div>

          <section className="p-24" style={{ backgroundColor: "#F5F5F5" }}>
  {/* Reviews & Comments */}
  <div>
    <h2 className="text-xl font-semibold mb-4" style={{ color: "#1A1A1A" }}>
      Reviews & Comments
    </h2>

    <div className="p-5 rounded-lg shadow-md" style={{ backgroundColor: "#FFFFFF" }}>
      <p className="text-3xl font-semibold mb-3" style={{ color: "#1A1A1A" }}>
        {user?.first_name} {user?.last_name}
      </p>

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review or comment..."
        className="w-full p-3 resize-none h-80 rounded-lg outline-none"
        style={{
          border: "1px solid #CCCCCC",
          backgroundColor: "#FFFFFF",
          color: "#1A1A1A",
        }}
        rows={3}
      />

      <div className="flex justify-end">
        <button
          onClick={handleAddComment}
          className="mt-3 py-2 px-6 rounded-lg transition"
          style={{
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#1E40AF")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#2563EB")
          }
        >
          Post Comment
        </button>
      </div>
    </div>

    <div className="mt-6 space-y-3">
      {comments.length > 0 ? (
        comments.map((c, i) => (
          <div
            key={i}
            className="p-3 rounded-lg text-sm"
            style={{ backgroundColor: "#EDEDED", color: "#1A1A1A" }}
          >
            {c}
          </div>
        ))
      ) : (
        <p style={{ color: "#666666", fontSize: "14px" }}>No comments yet.</p>
      )}
    </div>
  </div>
</section>

        </>
      )}
    </div>
  );
}

export default Hack;
