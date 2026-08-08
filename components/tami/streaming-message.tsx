'use client';

import React from 'react';
import { useTypingEffect } from './use-typing-effect';
import { ChatContentRenderer } from './chat-content-renderer';

interface StreamingMessageProps {
  content: string;
  isLatest: boolean;
  onTypingComplete?: () => void;
}

/**
 * Renders assistant message with progressive typing effect.
 * Only the latest message gets the typing animation;
 * historical messages render instantly.
 */
export const StreamingMessage: React.FC<StreamingMessageProps> = ({
  content,
  isLatest,
  onTypingComplete,
}) => {
  const { displayedText, isTyping, skip } = useTypingEffect(content, {
    enabled: isLatest,
    speed: 15,
  });

  // Notify parent when typing completes
  React.useEffect(() => {
    if (isLatest && !isTyping && displayedText === content) {
      onTypingComplete?.();
    }
  }, [isTyping, displayedText, content, isLatest, onTypingComplete]);

  // Show typing cursor while typing
  const showCursor = isLatest && isTyping;

  return (
    <div onClick={skip} className={isLatest && isTyping ? 'cursor-pointer' : ''}>
      <ChatContentRenderer content={displayedText} />
      {showCursor && (
        <span className="inline-block w-[2px] h-[1em] bg-primary ml-0.5 animate-pulse align-middle" />
      )}
    </div>
  );
};
