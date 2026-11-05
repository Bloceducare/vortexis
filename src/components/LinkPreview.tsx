"use client";

import React, { useEffect, useState } from "react";
import { ExternalLink, Github, Globe } from "lucide-react";

interface LinkPreviewProps {
  url: string;
  className?: string;
  descriptionLength?: number;
  width?: string;
}

export default function LinkPreview({
  url,
  className = "",
  descriptionLength = 100,
  width = "100%",
}: LinkPreviewProps) {
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Detect if link is a YouTube/Vimeo or direct video
  const isYouTube = Boolean(url && /youtube\.com|youtu\.be/.test(url));
  const isVimeo = Boolean(url && /vimeo\.com/.test(url));
  const isDirectVideo = Boolean(url && url.match(/\.(mp4|webm|ogg)$/i));

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    if (isYouTube || isVimeo || isDirectVideo) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    setLoading(true);
    fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.status === "success" && data.data) {
          setMeta(data.data);
        } else {
          setMeta(null);
        }
      })
      .catch(() => {
        setMeta(null);
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setLoading(false);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [url, isYouTube, isVimeo, isDirectVideo]);

  if (!url) return null;

  if (isYouTube) {
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return (
      <div
        className={`rounded-xl overflow-hidden shadow ${className}`}
        style={{ width }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-[45vh] rounded-xl"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  if (isVimeo) {
    const videoId = url.split("/").pop();
    return (
      <div
        className={`rounded-xl overflow-hidden shadow ${className}`}
        style={{ width }}
      >
        <iframe
          src={`https://player.vimeo.com/video/${videoId}`}
          className="w-full h-[45vh] rounded-xl"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  if (isDirectVideo) {
    return (
      <video
        controls
        className={`w-full h-[45vh] rounded-xl shadow ${className}`}
        style={{ width }}
      >
        <source src={url} />
        Your browser does not support the video tag.
      </video>
    );
  }

  if (loading) {
    return (
      <div
        className={`border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse ${className}`}
        style={{ width }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  let hostname = url;
  try {
    hostname = new URL(url).hostname;
  } catch {}
  const isGithub = /github\.com/.test(url);

  // Fallback card when metadata is not available or failed
  if (!meta) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`block border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition group ${className}`}
        style={{ width }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-[#605DEC] dark:text-indigo-400 flex items-center justify-center shrink-0">
              {isGithub ? (
                <Github className="w-5 h-5" />
              ) : (
                <Globe className="w-5 h-5" />
              )}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                {isGithub ? "GitHub Repository" : hostname}
              </h4>
              <p className="text-xs text-blue-600 dark:text-blue-400 truncate group-hover:underline">
                {url}
              </p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
        </div>
      </a>
    );
  }

  const title = meta.title || (isGithub ? "GitHub Repository" : hostname);
  const description = meta.description;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl p-3 hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition group ${className}`}
      style={{ width }}
    >
      <div className="flex gap-4 items-center">
        {meta.image?.url ? (
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
            <img
              src={meta.image.url}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-[#605DEC] dark:text-indigo-400 flex items-center justify-center shrink-0">
            {isGithub ? (
              <Github className="w-6 h-6" />
            ) : (
              <Globe className="w-6 h-6" />
            )}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
              {title}
            </h4>
            <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
          </div>

          {description && (
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
              {description.length > descriptionLength
                ? description.slice(0, descriptionLength) + "..."
                : description}
            </p>
          )}

          <p className="text-xs text-blue-600 dark:text-blue-400 truncate mt-1 group-hover:underline">
            {url}
          </p>
        </div>
      </div>
    </a>
  );
}
