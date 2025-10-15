'use client';

import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

export function FormattedText({ text, className }: FormattedTextProps) {
  // Regex to find text enclosed in underscores
  const parts = text.split(/(_[^_]+_)/g);

  return (
    <p className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('_') && part.endsWith('_')) {
          // Render the text inside the underscores in italics
          return <i key={index}>{part.substring(1, part.length - 1)}</i>;
        }
        // Render normal text
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </p>
  );
}
