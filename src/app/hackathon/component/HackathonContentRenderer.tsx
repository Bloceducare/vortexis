"use client";

import React, { useMemo } from "react";
import DOMPurify from "isomorphic-dompurify";
import {
  Target,
  Sparkles,
  Layers,
  FileCheck,
  Award,
  Clock,
  Compass,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

interface HackathonContentRendererProps {
  content: string | null | undefined;
  fallbackText?: string;
  className?: string;
}

interface ParsedBlock {
  type: "heading" | "subheading" | "list" | "paragraph";
  level?: number;
  text?: string;
  items?: string[];
}

function parsePlainText(raw: string): ParsedBlock[] {
  if (!raw) return [];
  const lines = raw.split(/\r?\n/).map((l) => l.trim());
  const blocks: ParsedBlock[] = [];
  let currentList: string[] | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) {
      if (currentList && currentList.length > 0) {
        blocks.push({ type: "list", items: currentList });
        currentList = null;
      }
      continue;
    }

    // Check for bullet points (•, *, -, etc.)
    const bulletMatch = line.match(/^[\u2022\u2023\u25E6\u2043\u2219\*\-]\s*(.*)$/);
    if (bulletMatch) {
      if (!currentList) currentList = [];
      currentList.push(bulletMatch[1]);
      continue;
    }

    if (currentList && currentList.length > 0) {
      blocks.push({ type: "list", items: currentList });
      currentList = null;
    }

    // Markdown heading
    if (line.startsWith("#")) {
      const match = line.match(/^#+/);
      const level = match ? match[0].length : 2;
      blocks.push({
        type: "heading",
        level,
        text: line.replace(/^#+\s*/, ""),
      });
      continue;
    }

    // ALL-CAPS section title (e.g., THE MISSION, WHAT TO EXPECT, TRACKS, ELIGIBILITY)
    const isAllCaps =
      line.length >= 3 &&
      line.length <= 50 &&
      line === line.toUpperCase() &&
      /[A-Z]/.test(line);

    if (isAllCaps) {
      blocks.push({ type: "heading", level: 2, text: line });
      continue;
    }

    // Subtitle ending in a colon (e.g. "Explore ideas across:", "Tracks:")
    if (line.endsWith(":") && line.length < 60) {
      blocks.push({ type: "subheading", text: line });
      continue;
    }

    blocks.push({ type: "paragraph", text: line });
  }

  if (currentList && currentList.length > 0) {
    blocks.push({ type: "list", items: currentList });
  }

  return blocks;
}

function getHeadingIcon(title: string) {
  const upper = title.toUpperCase();
  if (upper.includes("MISSION") || upper.includes("GOAL") || upper.includes("VISION")) {
    return <Target className="w-5 h-5 text-indigo-500" />;
  }
  if (upper.includes("EXPECT") || upper.includes("BENEFIT") || upper.includes("HIGHLIGHT")) {
    return <Sparkles className="w-5 h-5 text-amber-500" />;
  }
  if (upper.includes("TRACK") || upper.includes("THEME") || upper.includes("IDEA") || upper.includes("CATEGORY")) {
    return <Layers className="w-5 h-5 text-purple-500" />;
  }
  if (upper.includes("RULE") || upper.includes("GUIDELINE") || upper.includes("ELIGIBIL") || upper.includes("REQUIRE")) {
    return <FileCheck className="w-5 h-5 text-emerald-500" />;
  }
  if (upper.includes("PRIZE") || upper.includes("REWARD") || upper.includes("BOUNTY")) {
    return <Award className="w-5 h-5 text-yellow-500" />;
  }
  if (upper.includes("SCHEDULE") || upper.includes("TIMELINE") || upper.includes("DATE")) {
    return <Clock className="w-5 h-5 text-blue-500" />;
  }
  return <Compass className="w-5 h-5 text-indigo-500" />;
}

export const HackathonContentRenderer: React.FC<HackathonContentRendererProps> = ({
  content,
  fallbackText = "No information provided.",
  className = "",
}) => {
  if (!content || !content.trim()) {
    return (
      <p className="text-gray-500 dark:text-gray-400 italic text-sm">
        {fallbackText}
      </p>
    );
  }

  // Check if string contains actual HTML tags (e.g., <p>, <h2>, <ul>, <br>)
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    return (
      <div
        className={`prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white
          prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
          prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
          prose-p:my-3 prose-p:leading-relaxed
          prose-ul:my-4 prose-li:my-1.5
          prose-a:text-[#605DEC] hover:prose-a:underline
          prose-strong:text-gray-900 dark:prose-strong:text-white
          [&_table]:w-full [&_table]:border [&_table]:border-gray-200 dark:[&_table]:border-gray-700
          [&_th]:bg-gray-100 dark:[&_th]:bg-gray-800 [&_th]:p-3 [&_th]:text-left
          [&_td]:p-3 [&_td]:border-t [&_td]:border-gray-200 dark:[&_td]:border-gray-700
          ${className}`}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
      />
    );
  }

  // Parse plain text / markdown with rich Web3 styling
  const blocks = useMemo(() => parsePlainText(content), [content]);

  let lastSubheadingText = "";

  return (
    <div className={`space-y-6 text-gray-700 dark:text-gray-300 ${className}`}>
      {blocks.map((block, idx) => {
        if (block.type === "heading") {
          lastSubheadingText = "";
          return (
            <div
              key={idx}
              className="pt-6 first:pt-0 pb-2 border-b border-gray-100 dark:border-gray-800/80 mb-4"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center shrink-0">
                  {getHeadingIcon(block.text || "")}
                </div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">
                  {block.text}
                </h3>
              </div>
            </div>
          );
        }

        if (block.type === "subheading") {
          lastSubheadingText = block.text || "";
          return (
            <div key={idx} className="flex items-center gap-2 pt-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm sm:text-base">
              <ChevronRight className="w-4 h-4 shrink-0" />
              <span>{block.text}</span>
            </div>
          );
        }

        if (block.type === "list" && block.items) {
          const isTrackLike =
            lastSubheadingText.toLowerCase().includes("explore") ||
            lastSubheadingText.toLowerCase().includes("track") ||
            lastSubheadingText.toLowerCase().includes("idea") ||
            block.items.some((item) =>
              /defi|rwa|web3|blockchain|ai|identity|socialfi|payments|tooling/i.test(
                item
              )
            );

          if (isTrackLike) {
            return (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 pb-2"
              >
                {block.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60 hover:border-indigo-400/60 dark:hover:border-indigo-500/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 group"
                  >
                    <span className="w-2 h-2 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            );
          }

          return (
            <ul key={idx} className="space-y-2.5 pt-1 pb-2">
              {block.items.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  className="flex items-start gap-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed"
                >
                  <div className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p
            key={idx}
            className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed"
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
};

export default HackathonContentRenderer;

