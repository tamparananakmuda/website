'use client';

/**
 * Conversation branching utility.
 * Fork a conversation from a specific message, creating a new session
 * with messages up to that point.
 */

interface BranchMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  cognitiveData?: any;
}

interface BranchResult {
  messages: BranchMessage[];
  title: string;
}

/**
 * Fork conversation from a specific message index.
 * Returns messages up to (and including) the fork point.
 */
export function forkConversation(
  messages: BranchMessage[],
  forkFromIndex: number,
  originalTitle: string,
): BranchResult {
  const forkedMessages = messages.slice(0, forkFromIndex + 1);
  const branchTitle = `${originalTitle} (branch)`;

  return {
    messages: forkedMessages,
    title: branchTitle,
  };
}

/**
 * Save a branched conversation as a new session in localStorage.
 */
export function saveBranchedSession(
  messages: BranchMessage[],
  title: string,
): string {
  const sessionId = `branch-${Date.now()}`;
  const session = {
    id: sessionId,
    title,
    timestamp: Date.now(),
    messages,
  };

  const existing = localStorage.getItem('tami_chat_sessions');
  const sessions = existing ? JSON.parse(existing) : [];
  sessions.unshift(session);
  localStorage.setItem('tami_chat_sessions', JSON.stringify(sessions));

  return sessionId;
}
