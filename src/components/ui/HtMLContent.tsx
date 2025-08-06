import React from 'react';

interface HtmlContentProps {
  html: string;
}

const HtmlContent: React.FC<HtmlContentProps> = ({ html }) => {
  return (
    <div
      className="prose rich-text"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default HtmlContent;
