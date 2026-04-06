"use client";

// ============================================================
// Legit — GradientParser
// Safely parses <legit-gradient>text</legit-gradient> tags
// into styled React elements WITHOUT dangerouslySetInnerHTML.
// ============================================================

import React from "react";

interface GradientParserProps {
  html: string;
  className?: string;
}

/**
 * Parses content_html and replaces <legit-gradient>...</legit-gradient>
 * with gradient-styled <span> elements.
 */
export function GradientParser({ html, className = "" }: GradientParserProps) {
  // Split by period+space to separate into sentences.
  // We keep sentences in an array to style the first one as a hook.
  const sentences = html.split(/\.\s+/).filter(Boolean);

  return (
    <div className={`space-y-4 ${className}`}>
      {sentences.map((sentence, sIdx) => {
        // Restore the period for all but perfectly trailing blanks
        const text = sentence + (sentence.endsWith(".") ? "" : ".");
        const parts = parseGradientTags(text);
        
        const isFirst = sIdx === 0;

        return (
          <p 
            key={sIdx} 
            className={
              isFirst 
                ? "text-[26px] font-bold leading-[1.25] mb-5 tracking-tight text-white drop-shadow-xl" 
                : "text-[20px] font-medium leading-[1.4] text-white/95 drop-shadow-md"
            }
          >
            {parts.map((part, index) => {
              if (part.isGradient) {
                return (
                  <span key={index} className="legit-gradient-text">
                    {part.text}
                  </span>
                );
              }
              return <React.Fragment key={index}>{part.text}</React.Fragment>;
            })}
          </p>
        );
      })}
    </div>
  );
}

interface TextPart {
  text: string;
  isGradient: boolean;
}

function parseGradientTags(html: string): TextPart[] {
  const parts: TextPart[] = [];
  const regex = /<legit-gradient>(.*?)<\/legit-gradient>/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(html)) !== null) {
    // Text before the tag
    if (match.index > lastIndex) {
      parts.push({
        text: html.slice(lastIndex, match.index),
        isGradient: false,
      });
    }
    // The gradient text
    parts.push({
      text: match[1],
      isGradient: true,
    });
    lastIndex = match.index + match[0].length;
  }

  // Remaining text after last tag
  if (lastIndex < html.length) {
    parts.push({
      text: html.slice(lastIndex),
      isGradient: false,
    });
  }

  return parts;
}
