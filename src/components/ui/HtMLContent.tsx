import React from 'react';
import DOMPurify from 'isomorphic-dompurify';

interface HtmlContentProps {
  html: string;
}

function sanitizeRichHtml(html: string): string {
  if (!html) return "";

  // Strip hardcoded dark colors and light backgrounds from inline styles
  // so content dynamically and cleanly conforms to the active light/dark theme
  const cleaned = html
    .replace(/style\s*=\s*(["'])((?:(?!\1).)*?)\1/gi, (_, quote, styleContent) => {
      const filteredStyle = styleContent
        .replace(
          /(?:^|;)\s*color\s*:\s*(?:#000(?:000)?|#1[0-9a-f]{5}|black|rgb\s*\(\s*(?:[0-4]?[0-9]|50)\s*,\s*(?:[0-4]?[0-9]|50)\s*,\s*(?:[0-4]?[0-9]|50)\s*\)|rgba\s*\(\s*(?:[0-4]?[0-9]|50)\s*,\s*(?:[0-4]?[0-9]|50)\s*,\s*(?:[0-4]?[0-9]|50)\s*[^)]*\))\s*(?=;|$)/gi,
          ''
        )
        .replace(
          /(?:^|;)\s*background(?:-color)?\s*:\s*(?:#fff(?:fff)?|white|rgb\s*\(\s*25[0-5]\s*,\s*25[0-5]\s*,\s*25[0-5]\s*\)|rgba\s*\(\s*25[0-5]\s*,\s*25[0-5]\s*,\s*25[0-5]\s*[^)]*\))\s*(?=;|$)/gi,
          ''
        )
        .replace(/^;+|;+$/g, '')
        .trim();

      return filteredStyle ? `style=${quote}${filteredStyle}${quote}` : '';
    });

  return DOMPurify.sanitize(cleaned, {
    ADD_ATTR: ['target'],
  });
}

const HtmlContent: React.FC<HtmlContentProps> = ({ html }) => {
  return (
    <div className="overflow-x-auto">
      <div
        className="rich-text break-words whitespace-normal
          text-gray-800 dark:text-gray-200 leading-relaxed space-y-3
          [&_table]:w-full [&_table]:my-4 [&_table]:border-collapse [&_table]:border [&_table]:border-gray-300 dark:[&_table]:border-gray-700
          [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-100 [&_th]:px-3 [&_th]:py-2
          dark:[&_th]:border-gray-700 dark:[&_th]:bg-zinc-800 dark:[&_th]:!text-white
          [&_td]:border [&_td]:border-gray-300 [&_td]:px-3 [&_td]:py-2
          dark:[&_td]:border-gray-700 dark:[&_td]:!text-gray-200
          [&_tr:nth-child(even)]:bg-gray-50 dark:[&_tr:nth-child(even)]:bg-zinc-900/50
          [&_p]:my-2 [&_p]:text-gray-700 dark:[&_p]:!text-gray-200
          [&_span]:text-inherit dark:[&_span]:!text-inherit
          [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:my-1 [&_li]:text-gray-700 dark:[&_li]:!text-gray-200
          [&_ul]:list-disc [&_ul]:ml-6
          dark:[&_h1]:!text-white dark:[&_h2]:!text-white dark:[&_h3]:!text-white 
          dark:[&_strong]:!text-white dark:[&_b]:!text-white dark:[&_a]:!text-blue-400
        "
        dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(html) }}
      />
    </div>
  );
};


export default HtmlContent;