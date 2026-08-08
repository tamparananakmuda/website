'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Maximize2, Loader2, Terminal, User, Trash2, PlusCircle } from 'lucide-react';
import { TamiIcon } from './tami-icon';
import { TamiCognitiveResponse } from '@/lib/tami/cognitive/types';
import { RealityDiagnosisCard } from './reality-diagnosis-card';
import { ReadingRoadmap } from './reading-roadmap';
import Link from 'next/link';
import { ChatContentRenderer } from './chat-content-renderer';

interface FloatingTamiChatProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  cognitiveData?: Omit<TamiCognitiveResponse, 'conversationalReply'>;
}

export const FloatingTamiChat: React.FC<FloatingTamiChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progressLog, setProgressLog] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load conversation history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tami_conversation_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load conversation history', e);
      }
    }
    setIsLoaded(true);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tami_conversation_history') {
        try {
          setMessages(e.newValue ? JSON.parse(e.newValue) : []);
        } catch (err) {
          console.error('Failed to sync history from storage event', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save conversation when changed
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tami_conversation_history', JSON.stringify(messages));
    }
  }, [messages, isLoaded]);

  // Scroll ONLY inside the chat container
  useEffect(() => {
    if (chatContainerRef.current && (messages.length > 0 || isLoading)) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages.length, isLoading]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setProgressLog([]);

    // Determine complexity: 'low' | 'medium' | 'high'
    const cleanQuery = currentInput.toLowerCase().trim().replace(/[?.!,]/g, '');
    const greetings = ['halo', 'hi', 'hey', 'hei', 'helo', 'hello', 'p', 'ping', 'test', 'halo tami', 'hi tami', 'tami', 'hallo', 'assalamualaikum', 'salam', 'pagi', 'siang', 'sore', 'malam', 'terima kasih', 'thanks', 'makasih', 'thank you', 'ok', 'oke'];
    const isLow = greetings.includes(cleanQuery) || cleanQuery.split(/\s+/).length <= 2;
    const complexity = isLow ? 'low' : cleanQuery.split(/\s+/).length <= 6 ? 'medium' : 'high';

    const timers: NodeJS.Timeout[] = [];
    const addLog = (log: string) => {
      setProgressLog((prev) => [...prev, log]);
    };

    // Run parallel log simulations to keep user engaged without blocking the actual fetch request
    if (complexity === 'medium') {
      timers.push(setTimeout(() => addLog('Diagnosing state...'), 100));
      timers.push(setTimeout(() => addLog('Analyzing query...'), 350));
    } else if (complexity === 'high') {
      timers.push(setTimeout(() => addLog('Diagnosing state...'), 150));
      timers.push(setTimeout(() => addLog('Scanning TAM RAG Content...'), 450));
      timers.push(setTimeout(() => addLog('Debating biases...'), 850));
    }

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/tami/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: currentInput, history: historyPayload }),
      });

      if (!res.ok) throw new Error('Server error');

      const data: TamiCognitiveResponse = await res.json();
      
      // Clean up outstanding logs timers
      timers.forEach(clearTimeout);

      if (complexity !== 'low') {
        addLog('Finalizing response...');
        await new Promise((r) => setTimeout(r, 150));
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.conversationalReply,
        cognitiveData: {
          mindState: data.mindState,
          diagnosis: data.diagnosis,
          actionPlan: data.actionPlan,
          citations: data.citations,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      timers.forEach(clearTimeout);
      addLog('⚠️ Pipeline error.');
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Maaf, TAMI sedang mengalami kendala. Silakan coba lagi nanti.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6 pointer-events-none">
      {/* Backdrop overlay for focus */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />

      {/* Main Panel */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-lg h-[520px] max-h-[82vh] flex flex-col border border-neutral-800 bg-neutral-950/90 rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 backdrop-blur-2xl pointer-events-auto animate-in slide-in-from-bottom-5 duration-300"
      >
        {/* Glow effect at top border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-900 bg-neutral-950/80 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <TamiIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-xs tracking-wide">KONSULTASI TAMI AI</span>
                <span className="bg-primary/10 text-primary border border-primary/20 text-[8px] font-extrabold px-1 py-0.5 rounded tracking-widest">
                  PORTAL
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* New Chat Button */}
            {messages.length > 0 && (
              <button
                onClick={() => {
                  setMessages([]);
                  localStorage.removeItem('tami_conversation_history');
                  window.dispatchEvent(new Event('tami_history_updated'));
                }}
                title="Sesi Chat Baru"
                className="flex items-center gap-1 px-2 py-1 rounded-lg border border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-[10px] font-bold"
              >
                <PlusCircle className="w-3 h-3 text-primary" />
                <span>Baru</span>
              </button>
            )}

            {/* Clear Chat Button */}
            {messages.length > 0 && (
              <button
                onClick={() => {
                  setMessages([]);
                  localStorage.removeItem('tami_conversation_history');
                  window.dispatchEvent(new Event('tami_history_updated'));
                }}
                title="Hapus Obrolan"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-900 text-neutral-400 hover:text-red-500 hover:bg-neutral-900 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Maximize to full page */}
            <Link
              href="/tami"
              onClick={onClose}
              title="Buka Halaman Penuh"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </Link>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4 py-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950/80 text-primary">
                  <TamiIcon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Selamat Datang di TAMI Portal</h3>
                <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                  Tumpahkan curhat karier, finansial, atau realita hidupmu secara instan di sini.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 w-full pt-2">
                <button 
                  onClick={() => setInput("Saya burnout kerja kantoran tapi tabungan tipis, solusi realistisnya apa?")}
                  className="text-left text-[11px] text-neutral-400 hover:text-white bg-neutral-900/40 border border-neutral-900 hover:border-neutral-800 px-3.5 py-2.5 rounded-xl transition-all"
                >
                  &quot;Saya burnout kerja kantoran tapi tabungan tipis, solusi realistisnya apa?&quot;
                </button>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className="space-y-3">
              {msg.role === 'user' && (
                <div className="flex gap-2.5 justify-end">
                  <div className="max-w-[85%] bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs px-3.5 py-2.5 rounded-2xl rounded-tr-none">
                    {msg.content}
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-800 text-neutral-400 border border-neutral-700 flex-shrink-0 text-[10px]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}

              {msg.role === 'assistant' && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
                    <TamiIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="inline-block max-w-[90%] bg-neutral-900/50 border border-neutral-900 text-neutral-300 text-xs px-4 py-3 rounded-2xl rounded-tl-none leading-relaxed">
                      <ChatContentRenderer content={msg.content} />
                    </div>

                    {/* WhatsApp Escalation Button if present */}
                    {msg.cognitiveData?.escalationUrl && (
                      <div className="mt-2">
                        <a
                          href={msg.cognitiveData.escalationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-[11px] font-bold hover:bg-emerald-900/90 transition-all shadow-md shadow-emerald-950/40"
                        >
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                          </span>
                          💬 Diskusi via WA dengan Tim TAM
                        </a>
                      </div>
                    )}

                    {/* Quick Suggestions buttons */}
                    {msg.cognitiveData?.suggestions && msg.cognitiveData.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {msg.cognitiveData.suggestions.map((suggestion, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => setInput(suggestion)}
                            className="text-left text-[10px] font-medium text-neutral-400 hover:text-white bg-neutral-900/80 hover:bg-neutral-800/80 border border-neutral-800 hover:border-neutral-700 px-2.5 py-1 rounded-lg transition-all"
                          >
                            💡 {suggestion}
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.cognitiveData && msg.cognitiveData.diagnosis.cognitiveDistortion !== 'Tidak Ada' && (
                      <div className="space-y-4 mt-3">
                        <RealityDiagnosisCard diagnosis={msg.cognitiveData.diagnosis} />
                        <ReadingRoadmap citations={msg.cognitiveData.citations} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Progress Logs */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="flex-1 space-y-3">
                {progressLog.length > 0 ? (
                  <div className="rounded-xl border border-neutral-900 bg-neutral-950/80 p-3.5 max-w-xs">
                    <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] font-bold mb-1.5">
                      <Terminal className="w-3 h-3 text-primary" />
                      <span>TAMI Pipeline</span>
                    </div>
                    <div className="space-y-1 font-mono text-[9px] text-neutral-500">
                      {progressLog.map((log, idx) => (
                        <div key={idx} className="flex items-start gap-1">
                          <span className="text-primary">&gt;</span>
                          <span>{log}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-1 text-primary animate-pulse">
                        <span>&gt;</span>
                        <span className="flex items-center gap-1">
                          Analyzing... <Loader2 className="w-2 h-2 animate-spin" />
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="inline-block max-w-[90%] bg-neutral-900/50 border border-neutral-900 text-neutral-400 text-xs px-4 py-3 rounded-2xl rounded-tl-none leading-relaxed italic animate-pulse">
                    TAMI sedang berpikir...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="border-t border-neutral-900 bg-neutral-950/80 p-4">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mulai konsultasi realitas karir & keuangan..."
              disabled={isLoading}
              className="w-full bg-neutral-900/60 border border-neutral-800 text-white rounded-full py-3.5 pl-5 pr-14 text-xs focus:outline-none focus:border-neutral-700 transition-colors placeholder:text-neutral-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-950 hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default FloatingTamiChat;
