import React from 'react';

interface HtmlContentProps {
  html: string;
}

const HtmlContent: React.FC<HtmlContentProps> = ({ html }) => {
  return (
    <div
      className="prose rich-text break-words whitespace-normal
        text-black
        
        dark:text-white
        
        [&_table]:w-full [&_table]:border [&_table]:border-gray-300 dark:[&_table]:border-gray-700
        [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-100 [&_th]:px-3 [&_th]:py-2
        dark:[&_th]:border-gray-700 dark:[&_th]:bg-zinc-800 dark:[&_th]:text-white
        [&_td]:border [&_td]:border-gray-300 [&_td]:px-3 [&_td]:py-2
        dark:[&_td]:border-gray-700
        [&_tr:nth-child(even)]:bg-gray-50 dark:[&_tr:nth-child(even)]:bg-zinc-900/50
        
        [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:my-1
        [&_ul]:list-disc [&_ul]:ml-6
        
        dark:[&_h1]:text-white dark:[&_h2]:text-white dark:[&_h3]:text-white 
        dark:[&_strong]:text-white dark:[&_a]:text-blue-400
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default HtmlContent;