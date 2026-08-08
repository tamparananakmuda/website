'use client';

import React from 'react';
import { useTypingEffect } from './use-typing-effect';
import { ChatContentRenderer } from './chat-content-renderer';

interface StreamingMessageProps {
  content: string;
  isLatest: boolean;
  isStreaming?: boolean;
  onTypingComplete?: () => void;
}

/**
 * Renders assistant message with progressive typing effect.
 * During SSE streaming, text is shown directly (SSE provides the progressive reveal).
 * Typing effect only applies to fallback/non-streamed messages.
 * Historical messages render instantly.
 */
export const StreamingMessage: React.FC<StreamingMessageProps> = ({
  content,
  isLatest,
  isStreaming = false,
  onTypingComplete,
}) => {
  // During active SSE streaming, show text directly - no typing effect
  const useTyping = isLatest && !isStreaming;
  const { displayedText, isTyping, skip } = useTypingEffect(content, {
    enabled: useTyping,
    speed: 15,
  });

  // When streaming, show raw text progressively. When done, render full markdown.
  const renderText = isStreaming ? content : (useTyping ? displayedText : content);

  // Notify parent when typing completes
  React.useEffect(() => {
    if (isLatest && !isTyping && displayedText === content) {
      onTypingComplete?.();
    }
  }, [isTyping, displayedText, content, isLatest, onTypingComplete]);

  // Show typing cursor while typing or streaming
  const showCursor = isLatest && (isTyping || isStreaming);

  return (
    <div onClick={skip} className={isLatest && isTyping ? 'cursor-pointer' : ''}>
      {isStreaming ? (
        // During streaming: render as plain text to avoid markdown partial-parse jumps
        <div className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap break-words">
          {renderText}
          {showCursor && (
            <span className="inline-block w-[2px] h-[1em] bg-primary ml-0.5 animate-pulse align-middle" />
          )}
        </div>
      ) : (
        // After streaming complete: render full markdown
        <>
          <ChatContentRenderer content={renderText} />
          {showCursor && (
            <span className="inline-block w-[2px] h-[1em] bg-primary ml-0.5 animate-pulse align-middle" />
          )}
        </>
      )}
    </div>
  );
};
