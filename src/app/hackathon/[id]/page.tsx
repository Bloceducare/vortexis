"use client";

import React, { useState, useEffect } from "react";
import useHackathon from "@/hooks/useHackathon";
import { useParams } from "next/navigation";
import HtmlContent from "@/components/ui/HtMLContent";

function Hack() {
  const { id } = useParams();
  const { getHackathonById } = useHackathon();
  const { data, isLoading, error } = getHackathonById(id as string);

  const [review, setReview] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [countdown, setCountdown] = useState("");

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

  // --- Loading state ---
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

  // --- Error state ---
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
          {/* Hero Banner - full screen */}
          <div
            className="relative h-[70vh] w-full overflow-hidden"
            style={{
              backgroundImage: `url(${data.banner_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
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

          {/* Content container */}
          <div className="max-w-6xl mx-auto px-6">
            {/* Hackathon Details */}
            <div className="bg-white shadow rounded-lg p-6 mb-6 mt-6">
              <HtmlContent html={data.description} />

              {data.grand_prize && (
                <p className="mt-4 text-lg font-semibold text-green-700">
                  🏆 Grand Prize: ${data.grand_prize}
                </p>
              )}
            </div>

            {/* Prize Section */}
            {data.prizes && (
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Prizes</h2>
                <HtmlContent html={data.prizes} />
              </div>
            )}

            {/* Reviews & Comments */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Reviews & Comments</h2>

              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review or comment..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <button
                onClick={handleAddComment}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Post Comment
              </button>

              <div className="mt-6 space-y-3">
                {comments.length > 0 ? (
                  comments.map((c, i) => (
                    <div
                      key={i}
                      className="p-3 bg-gray-100 rounded-lg text-sm text-gray-800"
                    >
                      {c}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No comments yet.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Hack;
