import React from 'react';

interface HtmlContentProps {
  html: string;
}

const HtmlContent: React.FC<HtmlContentProps> = ({ html }) => {
  return (
    <div
      className="prose rich-text break-words whitespace-normal
        [&_table]:w-full  [&_table]:border [&_table]:border-gray-300
        [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-100 [&_th]:px-3 [&_th]:py-2
        [&_td]:border [&_td]:border-gray-300 [&_td]:px-3 [&_td]:py-2
        [&_tr:nth-child(even)]:bg-gray-50
        [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:my-1
        [&_ul]:list-disc [&_ul]:ml-6
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default HtmlContent;
