import React from 'react';

interface UnderlinedSpanProps {
  sentence: string;
  word: string;
}

export function UnderlinedSpan({ sentence, word }: UnderlinedSpanProps) {
  if (!word || !word.trim()) {
    return <span>{sentence}</span>;
  }

  const parts = sentence.split(word);

  return (
    <span>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < parts.length - 1 && <u>{word}</u>}
        </React.Fragment>
      ))}
    </span>
  );
};