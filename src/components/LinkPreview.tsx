"use client"

import React, { useEffect, useState } from "react"

interface LinkPreviewProps {
  url: string
  className?: string
  descriptionLength?: number
  width?: string
}

export default function LinkPreview({
  url,
  className,
  descriptionLength = 100,
  width = "100%",
}: LinkPreviewProps) {
  const [meta, setMeta] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!url) return

    setLoading(true)
    fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        setMeta(data.data)
        setLoading(false)
      })
      .catch(() => {
        setMeta(null)
        setLoading(false)
      })
  }, [url])

  // 🔹 Detect if link is a YouTube/Vimeo or direct video
  const isYouTube = /youtube\.com|youtu\.be/.test(url)
  const isVimeo = /vimeo\.com/.test(url)
  const isDirectVideo = url.match(/\.(mp4|webm|ogg)$/i)

  if (loading) {
    return (
      <div
        className={`border rounded-lg p-3 h-[45vh] animate-pulse ${className}`}
        style={{ width }}
      >
        <div className="w-full h-40 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
    )
  }

 
  if (isYouTube) {
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop()
    return (
      <div
        className={`rounded-lg overflow-hidden  ${className}`}
        style={{ width }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-[45vh] rounded"
          allowFullScreen
        ></iframe>
      </div>
    )
  }

  if (isVimeo) {
    const videoId = url.split("/").pop()
    return (
      <div
        className={`rounded-lg overflow-hidden ${className}`}
        style={{ width }}
      >
        <iframe
          src={`https://player.vimeo.com/video/${videoId}`}
          className="w-full h-[45vh] rounded"
          allowFullScreen
        ></iframe>
      </div>
    )
  }

  if (isDirectVideo) {
    return (
      <video
        controls
        className={`w-full h-[45vh] rounded-lg ${className}`}
        style={{ width }}
      >
        <source src={url} />
        Your browser does not support the video tag.
      </video>
    )
  }

  if (!meta) return null

  return (
    <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className={`block border rounded-lg p-3 h-[45vh] hover:shadow-md transition ${className}`}
    style={{ width }}
  >
    <div className="h-[20vh]">
      {meta.image?.url && (
        <img
          src={meta.image.url}
          alt={meta.title || "Preview image"}
          className="w-full h-full object-fill rounded mb-3"
        />
      )}
    </div>
  
    <div className="space-y-3 mt-3">
      <h3 className="font-bold text-sm text-gray-900 w-full break-words whitespace-normal">
        {meta.title}
      </h3>
  
      <p className="text-sm text-gray-600 break-words whitespace-normal">
        {meta.description
          ? meta.description.length > descriptionLength
            ? meta.description.slice(0, descriptionLength) + "..."
            : meta.description
          : "No description available"}
      </p>
  
      <span className="text-xs text-blue-600 mt-2 block break-words whitespace-normal">
        {url}
      </span>
    </div>
  </a>
  
  )
}
