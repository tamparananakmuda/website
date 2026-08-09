'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Terminal, Loader2, Trash2, PlusCircle, PanelLeft, Bot, MessageSquare, ExternalLink, Square } from 'lucide-react';
import { TamiCognitiveResponse } from '@/lib/tami/cognitive/types';
import { RealityDiagnosisCard } from './reality-diagnosis-card';
import { ReadingRoadmap } from './reading-roadmap';
import { TamiIcon } from './tami-icon';
import { ChatContentRenderer } from './chat-content-renderer';
import { StreamingMessage } from './streaming-message';
import { useTamiStream } from './use-tami-stream';
import { FeedbackButtons } from './feedback-buttons';
import { FollowUpSuggestions } from './follow-up-suggestions';
import { exportConversationAsMarkdown } from './export-conversation';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  cognitiveData?: Omit<TamiCognitiveResponse, 'conversationalReply'>;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
}

export const IntelligenceChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progressLog, setProgressLog] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isExternalUpdate = useRef(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load all sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('tami_chat_sessions');
    if (savedSessions) {
      try {
        const parsed: ChatSession[] = JSON.parse(savedSessions);
        setSessions(parsed);
        if (parsed.length > 0) {
          setActiveSessionId(parsed[0].id);
          setMessages(parsed[0].messages);
        }
      } catch (e) {
        console.error('Failed to parse chat sessions:', e);
      }
    } else {
      // Fallback for single history key
      const legacyHistory = localStorage.getItem('tami_conversation_history');
      if (legacyHistory) {
        try {
          const parsedMsgs: Message[] = JSON.parse(legacyHistory);
          if (parsedMsgs.length > 0) {
            const initialSession: ChatSession = {
              id: `session-${Date.now()}`,
              title: parsedMsgs.find((m) => m.role === 'user')?.content || 'Sesi Diagnosa Realita',
              timestamp: Date.now(),
              messages: parsedMsgs,
            };
            setSessions([initialSession]);
            setActiveSessionId(initialSession.id);
            setMessages(parsedMsgs);
            localStorage.setItem('tami_chat_sessions', JSON.stringify([initialSession]));
          }
        } catch (err) {
          console.error('Failed to parse legacy history:', err);
        }
      }
    }
    setIsLoaded(true);

    // Listen for updates from floating TAMI chat
    const handleHistoryUpdate = () => {
      const latest = localStorage.getItem('tami_conversation_history');
      if (latest) {
        try {
          isExternalUpdate.current = true;
          setMessages(JSON.parse(latest));
        } catch (err) {
          console.error('Failed to sync history from floating chat', err);
        }
      } else {
        isExternalUpdate.current = true;
        setMessages([]);
      }
    };

    window.addEventListener('tami_history_updated', handleHistoryUpdate);
    return () => {
      window.removeEventListener('tami_history_updated', handleHistoryUpdate);
    };
  }, []);

  // Open sidebar by default on desktop
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
  }, []);

  // Sync current messages to active session and localStorage
  const updateCurrentSessionMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
    if (!isLoaded) return;

    // Also update legacy key for floating widget compatibility
    localStorage.setItem('tami_conversation_history', JSON.stringify(newMessages));
    // Dispatch event so floating chat can sync (only if not from external update)
    if (!isExternalUpdate.current) {
      window.dispatchEvent(new Event('tami_history_updated'));
    }
    isExternalUpdate.current = false;

    if (newMessages.length === 0) return;

    let targetId = activeSessionId;
    if (!targetId) {
      targetId = `session-${Date.now()}`;
      setActiveSessionId(targetId);
    }

    const firstUserMsg = newMessages.find((m) => m.role === 'user')?.content || 'Percakapan TAMI';
    const updatedTitle = firstUserMsg.length > 30 ? firstUserMsg.slice(0, 30) + '...' : firstUserMsg;

    setSessions((prevSessions) => {
      const existingIdx = prevSessions.findIndex((s) => s.id === targetId);
      let updated: ChatSession[];
      if (existingIdx >= 0) {
        updated = prevSessions.map((s, idx) =>
          idx === existingIdx ? { ...s, messages: newMessages, title: updatedTitle, timestamp: Date.now() } : s
        );
      } else {
        const newSession: ChatSession = {
          id: targetId,
          title: updatedTitle,
          timestamp: Date.now(),
          messages: newMessages,
        };
        updated = [newSession, ...prevSessions];
      }
      localStorage.setItem('tami_chat_sessions', JSON.stringify(updated));
      // Limit to 20 sessions to prevent localStorage overflow
      if (updated.length > 20) {
        const trimmed = updated.slice(0, 20);
        setSessions(trimmed);
        localStorage.setItem('tami_chat_sessions', JSON.stringify(trimmed));
      } else {
        setSessions(updated);
      }
      return updated;
    });
  };

  // Scroll ONLY inside the chat container when user sends or isLoading changes
  useEffect(() => {
    if (chatContainerRef.current && (messages.length > 0 || isLoading)) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages.length, isLoading]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  // Keyboard shortcut: Cmd/Ctrl+K for new chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        startNewChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const assistantIdRef = useRef<string | null>(null);
  const streamedTextRef = useRef('');

  const { stream: streamTami, isStreaming: sseStreaming, abort: abortStream } = useTamiStream({
    onCognitiveData: (data) => {
      timersRef.current.forEach(clearTimeout);
      setProgressLog([]);

      const id = `assistant-${Date.now()}`;
      assistantIdRef.current = id;
      streamedTextRef.current = '';
      const assistantMessage: Message = {
        id,
        role: 'assistant',
        content: '',
        cognitiveData: {
          mindState: data.mindState,
          diagnosis: data.diagnosis,
          actionPlan: data.actionPlan,
          citations: data.citations,
          escalationUrl: data.escalationUrl,
          suggestions: data.suggestions,
          severityLevel: data.severityLevel,
        },
      };
      setMessages((prev) => {
        const updated = [...prev, assistantMessage];
        updateCurrentSessionMessages(updated);
        return updated;
      });
    },
    onToken: (token) => {
      streamedTextRef.current += token;
      const currentText = streamedTextRef.current;
      const id = assistantIdRef.current;
      if (id) {
        setMessages((prev) => {
          const updated = prev.map(m => m.id === id ? { ...m, content: currentText } : m);
          updateCurrentSessionMessages(updated);
          return updated;
        });
      }
    },
    onComplete: (fullText) => {
      const id = assistantIdRef.current;
      if (id && fullText) {
        setMessages((prev) => {
          const updated = prev.map(m => m.id === id ? { ...m, content: fullText } : m);
          updateCurrentSessionMessages(updated);
          return updated;
        });
      }
      assistantIdRef.current = null;
      streamedTextRef.current = '';
    },
    onError: (error) => {
      timersRef.current.forEach(clearTimeout);
      setMessages((prev) => {
        const updated = [...prev, { id: `error-${Date.now()}`, role: 'assistant' as const, content: error }];
        updateCurrentSessionMessages(updated);
        return updated;
      });
    },
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || sseStreaming) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
    };

    const nextMessages = [...messages, userMessage];
    updateCurrentSessionMessages(nextMessages);

    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setProgressLog([]);

    // Determine complexity for progress logs
    const cleanQuery = currentInput.toLowerCase().trim().replace(/[?.!,]/g, '');
    const greetings = ['halo', 'hi', 'hey', 'hei', 'helo', 'hello', 'p', 'ping', 'test', 'halo tami', 'hi tami', 'tami', 'hallo', 'assalamualaikum', 'salam', 'pagi', 'siang', 'sore', 'malam', 'terima kasih', 'thanks', 'makasih', 'thank you', 'ok', 'oke'];
    const isLow = greetings.includes(cleanQuery) || cleanQuery.split(/\s+/).length <= 2;
    const complexity = isLow ? 'low' : cleanQuery.split(/\s+/).length <= 6 ? 'medium' : 'high';

    const timers: NodeJS.Timeout[] = [];
    timersRef.current = timers;
    const addLog = (log: string) => {
      setProgressLog((prev) => [...prev, log]);
    };

    if (complexity === 'medium') {
      timers.push(setTimeout(() => addLog('Memulai diagnosa TAMI...'), 100));
      timers.push(setTimeout(() => addLog('Membaca kondisi mental...'), 350));
      timers.push(setTimeout(() => addLog('Menganalisis pertanyaan...'), 600));
    } else if (complexity === 'high') {
      timers.push(setTimeout(() => addLog('Memulai pipeline diagnosa kognitif TAMI...'), 150));
      timers.push(setTimeout(() => addLog('Analisis Emosi: Membaca frekuensi emosi & mendeteksi sinyal krisis...'), 500));
      timers.push(setTimeout(() => addLog('Knowledge Graph RAG: Memindai konten TAM untuk topik relevan...'), 950));
      timers.push(setTimeout(() => addLog('Perdebatan Bias: Membedah asumsi & distorsi berpikirmu...'), 1400));
      timers.push(setTimeout(() => addLog('Sintesis Eksekusi: Merumuskan rencana tindakan taktis...'), 1950));
    }

    try {
      const historyPayload = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      await streamTami(currentInput, historyPayload);
    } catch (error) {
      console.error(error);
      timers.forEach(clearTimeout);
      addLog('⚠️ Error: Gagal melakukan diagnosa.');

      const errorMsg = error instanceof Error ? error.message : 'Maaf, TAMI sedang mengalami kendala. Silakan coba lagi.';
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: errorMsg,
      };
      updateCurrentSessionMessages([...nextMessages, errorMessage]);
    } finally {
      timers.forEach(clearTimeout);
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setActiveSessionId('');
    setMessages([]);
    localStorage.removeItem('tami_conversation_history');
    window.dispatchEvent(new Event('tami_history_updated'));
  };

  const switchSession = (session: ChatSession) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
    localStorage.setItem('tami_conversation_history', JSON.stringify(session.messages));
    window.dispatchEvent(new Event('tami_history_updated'));
  };

  const deleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== sessionId);
    setSessions(updated);
    localStorage.setItem('tami_chat_sessions', JSON.stringify(updated));

    if (activeSessionId === sessionId) {
      if (updated.length > 0) {
        setActiveSessionId(updated[0].id);
        setMessages(updated[0].messages);
        localStorage.setItem('tami_conversation_history', JSON.stringify(updated[0].messages));
      } else {
        startNewChat();
      }
    }
    window.dispatchEvent(new Event('tami_history_updated'));
  };

  return (
    <div className="flex w-full h-full bg-neutral-950 text-white overflow-hidden relative">
      {/* Mobile Backdrop Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-20 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ChatGPT / Claude Style Left Sidebar */}
      <aside
        className={`fixed md:relative z-30 h-full bg-neutral-900/95 md:bg-neutral-900/60 border-r border-neutral-800/80 backdrop-blur-xl transition-all duration-300 ease-in-out flex flex-col justify-between overflow-hidden shrink-0 ${
          isSidebarOpen
            ? 'w-64 translate-x-0 opacity-100'
            : 'w-0 -translate-x-full opacity-0 md:opacity-100 border-r-0'
        }`}
      >
        <div className="w-64 p-3 space-y-3 flex-1 overflow-y-auto">
          {/* New Chat Button */}
          <button
            onClick={() => {
              startNewChat();
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
            className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700/80 text-white font-semibold text-xs border border-neutral-700/50 shadow-sm transition-all group"
          >
            <div className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-primary group-hover:rotate-90 transition-transform duration-300" />
              <span>Percakapan Baru</span>
            </div>
            <span className="text-[10px] text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800 font-mono">⌘K</span>
          </button>

          {/* Sidebar Section Title */}
          <div className="px-2 pt-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
            <span>Riwayat Obrolan</span>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 text-neutral-400 hover:text-white"
              title="Tutup Sidebar"
            >
              ✕
            </button>
          </div>

          {/* Search Bar */}
          {sessions.length > 0 && (
            <div className="px-2 pb-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari percakapan..."
                className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-neutral-700 transition-colors placeholder:text-neutral-500"
              />
            </div>
          )}

          {/* Chat Sessions List */}
          <div className="space-y-1">
            {sessions.length === 0 ? (
              <div className="px-3 py-2 text-xs text-neutral-400 italic">Belum ada obrolan tersimpan</div>
            ) : (
              sessions
                .filter((s) => {
                  if (!searchQuery.trim()) return true;
                  const q = searchQuery.toLowerCase();
                  return (
                    s.title.toLowerCase().includes(q) ||
                    s.messages.some((m) => m.content.toLowerCase().includes(q))
                  );
                })
                .map((session) => (
                <div
                  key={session.id}
                  onClick={() => {
                    switchSession(session);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs cursor-pointer border transition-all ${
                    activeSessionId === session.id
                      ? 'bg-neutral-800 text-white font-semibold border-neutral-700/60 shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${activeSessionId === session.id ? 'text-primary' : 'text-neutral-400'}`} />
                    <span className="truncate">{session.title}</span>
                  </div>
                  <button
                    onClick={(e) => deleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-400 transition-opacity"
                    title="Hapus percakapan ini"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Footer Info */}
        <div className="w-64 p-3 border-t border-neutral-800/80 bg-neutral-950/40 space-y-2 shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
              <TamiIcon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">TAMI AI Portal</p>
              <p className="text-[10px] text-neutral-400 truncate">Cognitive RAG Engine v2.0</p>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-between px-2.5 py-1.5 text-xs text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800/60 transition-colors"
          >
            <span>Kembali ke Website TAM</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </aside>

      {/* Main Workspace Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-neutral-950 relative min-w-0">
        {/* Top Navbar */}
        <header className="h-14 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl px-4 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
              title="Toggle Sidebar"
            >
              <PanelLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                <TamiIcon className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-sm tracking-tight">TAMI AI</span>
              <span className="hidden sm:inline bg-neutral-900 border border-neutral-800 text-neutral-400 text-[10px] font-mono px-2 py-0.5 rounded-full">
                Cognitive Mode
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={startNewChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-primary" />
                <span className="hidden sm:inline">Chat Baru</span>
              </button>
            )}

            {messages.length > 0 && (
              <button
                onClick={() => exportConversationAsMarkdown(messages, sessions.find(s => s.id === activeSessionId)?.title || 'Percakapan TAMI')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-primary" />
                <span className="hidden sm:inline">Export</span>
              </button>
            )}

            {messages.length > 0 && (
              <button
                onClick={() => {
                  if (activeSessionId) {
                    const updated = sessions.filter((s) => s.id !== activeSessionId);
                    setSessions(updated);
                    localStorage.setItem('tami_chat_sessions', JSON.stringify(updated));
                    if (updated.length > 0) {
                      switchSession(updated[0]);
                    } else {
                      startNewChat();
                    }
                  } else {
                    startNewChat();
                  }
                }}
                className="p-2 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-900 transition-colors"
                title="Hapus Chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Conversation Stream */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6" role="log" aria-live="polite" aria-label="Riwayat percakapan TAMI">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 && (
              <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-6 py-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-neutral-800 bg-neutral-900 text-primary shadow-2xl">
                    <TamiIcon className="w-9 h-9" />
                  </div>
                </div>

                <div className="space-y-2 max-w-lg">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    Apa dilema atau realita yang ingin kamu bedah hari ini?
                  </h1>
                  <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
                    TAMI mendiagnosa distorsi karir, masalah finansial, burnout, dan dilema hidup anak muda Indonesia secara realistis berbasis data esai TAM.
                  </p>
                </div>

                {/* Prompt Cards Grid - ChatGPT / Claude Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-4 max-w-2xl">
                  <button
                    onClick={() =>
                      setInput("Saya umur 25, gaji pas-pasan, tapi FOMO tiap lihat teman-teman liburan di sosmed. Cara keluarnya gimana?")
                    }
                    className="group text-left p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900 transition-all text-xs text-neutral-300 space-y-1.5 shadow-sm"
                  >
                    <div className="font-bold text-white group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <span>Social Media & FOMO</span>
                    </div>
                    <p className="text-neutral-400 text-[11px] line-clamp-2 leading-relaxed">
                      &quot;Gaji pas-pasan tapi FOMO lihat teman liburan di sosmed...&quot;
                    </p>
                  </button>

                  <button
                    onClick={() =>
                      setInput("Kerja rasanya burnout setengah mati, pengen resign dan rintis bisnis sendiri tapi tabungan tipis.")
                    }
                    className="group text-left p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900 transition-all text-xs text-neutral-300 space-y-1.5 shadow-sm"
                  >
                    <div className="font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5 text-amber-400" />
                      <span>Burnout & Resign Dilema</span>
                    </div>
                    <p className="text-neutral-400 text-[11px] line-clamp-2 leading-relaxed">
                      &quot;Burnout setengah mati, mau resign rintis usaha tapi dana tipis...&quot;
                    </p>
                  </button>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className="space-y-4">
                {/* User Message */}
                {msg.role === 'user' && (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] sm:max-w-[75%] bg-neutral-800/90 border border-neutral-700/60 text-white text-xs md:text-sm px-4 py-3 rounded-2xl rounded-tr-sm leading-relaxed shadow-sm">
                      {msg.content}
                    </div>
                  </div>
                )}

                {/* Assistant Message */}
                {msg.role === 'assistant' && (
                  <div className="flex gap-3 md:gap-4 items-start">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 flex-shrink-0 mt-0.5">
                      <TamiIcon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-5">
                      {/* Severity Level Badge */}
                      {msg.cognitiveData?.severityLevel && (
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                            msg.cognitiveData.severityLevel === 'berat'
                              ? 'bg-red-950/60 border-red-800/60 text-red-300'
                              : msg.cognitiveData.severityLevel === 'sedang'
                              ? 'bg-amber-950/60 border-amber-800/60 text-amber-300'
                              : 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300'
                          }`}>
                            {msg.cognitiveData.severityLevel === 'berat' ? '🔴 Level: Berat' : msg.cognitiveData.severityLevel === 'sedang' ? '🟡 Level: Sedang' : '🟢 Level: Ringan'}
                          </span>
                          <span className="text-[9px] text-neutral-500">
                            {msg.cognitiveData.severityLevel === 'berat' ? 'TAMI merespons dengan empati & fokus langkah kecil' : msg.cognitiveData.severityLevel === 'sedang' ? 'TAMI merespons tegas tapi peduli' : 'TAMI merespons dengan tamparan realita'}
                          </span>
                        </div>
                      )}
                      <div className="text-xs md:text-sm text-neutral-200 leading-relaxed bg-neutral-900/60 border border-neutral-800/80 p-4 md:p-5 rounded-2xl rounded-tl-sm shadow-sm">
                        <StreamingMessage
                          content={msg.content}
                          isLatest={msg.id === messages[messages.length - 1]?.id && msg.role === 'assistant'}
                        />
                      </div>

                      {/* Feedback buttons */}
                      {msg.content && !sseStreaming && (
                        <FeedbackButtons messageId={msg.id} query={messages[messages.indexOf(msg) - 1]?.content || ''} reply={msg.content} />
                      )}

                      {msg.content && !sseStreaming && msg.cognitiveData && (
                        <FollowUpSuggestions
                          cognitiveData={msg.cognitiveData}
                          userQuery={messages[messages.indexOf(msg) - 1]?.content || ''}
                          onSuggestionClick={(text) => setInput(text)}
                        />
                      )}

                      {/* WhatsApp Escalation */}
                      {msg.cognitiveData?.escalationUrl && (
                        <div>
                          <a
                            href={msg.cognitiveData.escalationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-bold hover:bg-emerald-900/90 transition-all shadow-md"
                          >
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            💬 Diskusi Intensif via WhatsApp dengan Tim TAM
                          </a>
                        </div>
                      )}

                      {/* Suggestion Pills */}
                      {msg.cognitiveData?.suggestions && msg.cognitiveData.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {msg.cognitiveData.suggestions.map((suggestion, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => setInput(suggestion)}
                              className="text-left text-[11px] font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 px-3 py-1.5 rounded-xl transition-all"
                            >
                              💡 {suggestion}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Cognitive Cards Grid */}
                      {msg.cognitiveData && (msg.cognitiveData.actionPlan?.length > 0 || msg.cognitiveData.citations?.length > 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <RealityDiagnosisCard diagnosis={msg.cognitiveData.diagnosis} />
                          <div className="space-y-4">
                            <ReadingRoadmap citations={msg.cognitiveData.citations} />

                            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 backdrop-blur-xl">
                              <h3 className="font-bold text-white text-xs mb-3 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                Rencana Aksi Konkret
                              </h3>
                              <div className="space-y-3">
                                {msg.cognitiveData.actionPlan.map((step, stepIdx) => (
                                  <div key={`step-${stepIdx}-${step.timeframe}`} className="border-b border-neutral-800/60 pb-2.5 last:border-b-0 last:pb-0">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs font-bold text-white">{step.title}</span>
                                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-400 bg-neutral-950 border border-neutral-800 px-1.5 py-0.5 rounded">
                                        {step.timeframe.replace('_', ' ')}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-neutral-400 leading-relaxed">{step.description}</p>
                                    {step.expectedObstacle && (
                                      <p className="text-[10px] text-amber-500/70 leading-relaxed mt-1 italic">Hambatan: {step.expectedObstacle}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 items-start" role="status" aria-live="polite" aria-label="TAMI sedang memproses">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 flex-shrink-0 mt-0.5">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <div className="flex-1 space-y-3">
                  {progressLog.length > 0 ? (
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 max-w-md shadow-sm">
                      <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold mb-2">
                        <Terminal className="w-3.5 h-3.5 text-primary" />
                        <span>Pipeline Kognitif</span>
                      </div>
                      <div className="space-y-1 font-mono text-[10px] text-neutral-400">
                        {progressLog.map((log, index) => (
                          <div key={index} className="flex items-start gap-1">
                            <span className="text-primary">&gt;</span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="inline-block bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs px-4 py-2.5 rounded-2xl italic animate-pulse">
                      TAMI sedang berpikir...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Input Dock - ChatGPT / Claude Style */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800/80 flex-shrink-0">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik curhat, masalah karir, atau pertanyaan keuanganmu..."
              disabled={isLoading}
              aria-label="Ketik pertanyaan untuk TAMI"
              className="w-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 focus:border-neutral-600 text-white rounded-2xl py-3.5 pl-5 pr-14 text-xs md:text-sm focus:outline-none transition-colors placeholder:text-neutral-500 shadow-inner"
            />
            {sseStreaming ? (
              <button
                type="button"
                onClick={abortStream}
                aria-label="Hentikan respons"
                className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all shadow-sm"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="Kirim pesan"
                className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-neutral-950 hover:bg-neutral-200 transition-all disabled:opacity-30 disabled:hover:bg-white shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </form>
          <p className="text-[10px] text-center text-neutral-400 mt-2">
            TAMI AI dapat keliru. Verifikasi diagnosa & rujukan artikel resmi di Tamparan Anak Muda.
          </p>
        </div>
      </div>
    </div>
  );
};
export default IntelligenceChatInterface;

