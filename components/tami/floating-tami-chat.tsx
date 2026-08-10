'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Maximize2, Loader2, Terminal, User, Trash2, PlusCircle, Sparkles, Square, Mic, AlertTriangle } from 'lucide-react';
import { TamiIcon } from './tami-icon';
import { TamiCognitiveResponse } from '@/lib/tami/cognitive/types';
import { RealityDiagnosisCard } from './reality-diagnosis-card';
import { ReadingRoadmap } from './reading-roadmap';
import Link from 'next/link';
import { ChatContentRenderer } from './chat-content-renderer';
import { StreamingMessage } from './streaming-message';
import { useTamiStream } from './use-tami-stream';
import { FeedbackButtons } from './feedback-buttons';
import { saveMoodEntry } from './mood-tracker';
import { useVoiceInput } from './use-voice-input';
import { OnboardingMessage, hasSeenOnboarding, markOnboardingSeen } from './onboarding-message';

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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [proactiveGreeting, setProactiveGreeting] = useState<string | null>(null);
  const [isDegraded, setIsDegraded] = useState(false);
  const [hasActiveResponse, setHasActiveResponse] = useState(false);
  const sessionIdRef = useRef<string>('');
  const isExternalUpdate = useRef(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const { isListening: isVoiceListening, isSupported: voiceSupported, startListening, stopListening } = useVoiceInput((text) => setInput(text));
  
  const containerRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load conversation history from localStorage on mount
  useEffect(() => {
    // T7-2: Generate or restore persistent session ID for proactive engine
    const storedSid = localStorage.getItem('tami_session_id');
    if (storedSid) {
      sessionIdRef.current = storedSid;
    } else {
      const newSid = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      sessionIdRef.current = newSid;
      localStorage.setItem('tami_session_id', newSid);
    }

    const saved = localStorage.getItem('tami_conversation_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed);
        // T7-2: Fetch proactive greeting for returning users
        if (parsed.length > 0) {
          fetch('/api/tami/proactive', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: sessionIdRef.current }),
          })
            .then(res => res.json())
            .then(data => {
              if (data.greeting) setProactiveGreeting(data.greeting);
            })
            .catch(() => {});
        }
      } catch (e) {
        console.error('Failed to load conversation history', e);
      }
    } else if (!hasSeenOnboarding()) {
      setShowOnboarding(true);
    }
    setIsLoaded(true);

    // Listen for updates from full-page TAMI chat
    const handleHistoryUpdate = () => {
      const latest = localStorage.getItem('tami_conversation_history');
      if (latest) {
        try {
          isExternalUpdate.current = true;
          setMessages(JSON.parse(latest));
        } catch (err) {
          console.error('Failed to sync history from tami_history_updated event', err);
        }
      } else {
        isExternalUpdate.current = true;
        setMessages([]);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tami_conversation_history') {
        try {
          isExternalUpdate.current = true;
          setMessages(e.newValue ? JSON.parse(e.newValue) : []);
        } catch (err) {
          console.error('Failed to sync history from storage event', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tami_history_updated', handleHistoryUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tami_history_updated', handleHistoryUpdate);
    };
  }, []);

  // Save conversation when changed
  useEffect(() => {
    if (isLoaded) {
      const wasExternal = isExternalUpdate.current;
      isExternalUpdate.current = false;
      localStorage.setItem('tami_conversation_history', JSON.stringify(messages));
      // Only dispatch event if this update is from user action, not from external sync
      // to prevent infinite loop between floating chat and full-page chat
      if (!wasExternal) {
        window.dispatchEvent(new Event('tami_history_updated'));
      }
    }
  }, [messages, isLoaded]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const assistantIdRef = useRef<string | null>(null);
  const streamedTextRef = useRef('');
  const cognitiveDataRef = useRef<Omit<TamiCognitiveResponse, 'conversationalReply'> | null>(null);

  const { stream: streamTami, isStreaming: sseStreaming, abort: abortStream } = useTamiStream({
    onCognitiveData: (data) => {
      cognitiveDataRef.current = data;
      timersRef.current.forEach(clearTimeout);
      setProgressLog([]);

      // Track mood for trend analysis
      if (data.mindState?.primaryEmotion && data.mindState?.resilienceScore) {
        saveMoodEntry(
          data.mindState.primaryEmotion,
          data.mindState.resilienceScore,
          data.severityLevel || 'ringan',
        );
      }

      // T7-6: Track degraded mode for UI banner
      setIsDegraded(!!data.isDegraded);

      const id = `assistant-${Date.now()}`;
      assistantIdRef.current = id;
      streamedTextRef.current = '';
      setMessages((prev) => [...prev, {
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
      }]);
    },
    onToken: (token) => {
      streamedTextRef.current += token;
      const currentText = streamedTextRef.current;
      const id = assistantIdRef.current;
      if (id) {
        setMessages((prev) => prev.map(m => m.id === id ? { ...m, content: currentText } : m));
      }
    },
    onComplete: (fullText) => {
      const id = assistantIdRef.current;
      if (id && fullText) {
        setMessages((prev) => prev.map(m => m.id === id ? { ...m, content: fullText } : m));
      }
      assistantIdRef.current = null;
      streamedTextRef.current = '';
      cognitiveDataRef.current = null;
    },
    onError: (error) => {
      timersRef.current.forEach(clearTimeout);
      let friendlyMsg: string;
      if (error.includes('429') || error.includes('rate limit') || error.includes('Terlalu banyak')) {
        friendlyMsg = 'Tunggu sebentar ya, kamu chat terlalu cepat. Coba lagi dalam beberapa detik.';
      } else if (error.includes('fetch') || error.includes('network') || error.includes('Failed to fetch')) {
        friendlyMsg = 'Koneksi terputus. Cek internet kamu lalu coba kirim lagi ya.';
      } else if (error.includes('timeout') || error.includes('Timeout')) {
        friendlyMsg = 'TAMI butuh waktu lebih lama dari biasanya. Coba pertanyaan yang lebih singkat.';
      } else {
        friendlyMsg = 'Maaf, TAMI lagi ada kendala teknis. Coba lagi ya.';
      }
      setMessages((prev) => [
        ...prev,
        { id: `error-${Date.now()}`, role: 'assistant', content: friendlyMsg },
      ]);
    },
  });

  // Abort SSE stream on unmount to prevent server waste
  // Always abort — abortRef.current?.abort() is a no-op if no active controller
  useEffect(() => {
    return () => {
      abortStream();
    };
  }, [abortStream]);

  // Auto-scroll: follow streaming text growth
  const lastMessageContent = messages.length > 0 ? messages[messages.length - 1].content : '';
  useEffect(() => {
    if (chatContainerRef.current && (messages.length > 0 || isLoading)) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: sseStreaming ? 'auto' : 'smooth',
      });
    }
  }, [messages.length, isLoading, lastMessageContent, sseStreaming]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || sseStreaming) return;

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
      timers.push(setTimeout(() => addLog('Membaca kondisi mental...'), 100));
      timers.push(setTimeout(() => addLog('Menganalisis pertanyaan...'), 350));
    } else if (complexity === 'high') {
      timers.push(setTimeout(() => addLog('Mendiagnosis kondisi mental...'), 150));
      timers.push(setTimeout(() => addLog('Memindai konten RAG TAM...'), 450));
      timers.push(setTimeout(() => addLog('Membedah bias berpikir...'), 850));
    }

    // Clear proactive greeting once user starts chatting
    setProactiveGreeting(null);

    try {
      const historyPayload = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      setHasActiveResponse(true);
      await streamTami(currentInput, historyPayload);
    } catch (err) {
      console.error(err);
      timers.forEach(clearTimeout);
      const rawMsg = err instanceof Error ? err.message : 'Unknown error';
      let errorMsg: string;
      if (rawMsg.includes('429') || rawMsg.includes('rate limit') || rawMsg.includes('Terlalu banyak')) {
        errorMsg = 'Tunggu sebentar ya, kamu chat terlalu cepat. Coba lagi dalam beberapa detik.';
      } else if (rawMsg.includes('fetch') || rawMsg.includes('network') || rawMsg.includes('Failed to fetch')) {
        errorMsg = 'Koneksi terputus. Cek internet kamu lalu coba kirim lagi ya.';
      } else if (rawMsg.includes('timeout') || rawMsg.includes('Timeout')) {
        errorMsg = 'TAMI butuh waktu lebih lama dari biasanya. Coba pertanyaan yang lebih singkat.';
      } else {
        errorMsg = 'Maaf, TAMI lagi ada kendala teknis. Coba lagi ya.';
      }
      setMessages((prev) => [
        ...prev,
        { id: `error-${Date.now()}`, role: 'assistant', content: errorMsg },
      ]);
    } finally {
      timers.forEach(clearTimeout);
      setIsLoading(false);
      setHasActiveResponse(false);
      // Reset degraded state after response completes
      setIsDegraded(false);
    }
  };

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex items-end justify-end pointer-events-none p-0 sm:p-0">
      {/* Backdrop overlay for focus on mobile screens */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs pointer-events-auto sm:hidden"
        onClick={onClose}
      />

      {/* Main Panel - Sleek Bottom Right Floating Card */}
      <div 
        ref={containerRef}
        className="relative w-full sm:w-[420px] h-full sm:h-[580px] max-h-[100vh] sm:max-h-[85vh] flex flex-col border-t sm:border border-neutral-800 bg-neutral-950/95 sm:rounded-3xl overflow-hidden shadow-2xl shadow-black/80 backdrop-blur-2xl pointer-events-auto animate-in slide-in-from-bottom-5 duration-300"
      >
        {/* Glow effect at top border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-90" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 bg-neutral-900/50 px-4 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <TamiIcon className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-xs tracking-wide">KONSULTASI TAMI AI</span>
                <span className="bg-primary/10 text-primary border border-primary/20 text-[8px] font-extrabold px-1.5 py-0.5 rounded tracking-wider">
                  PORTAL
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {/* New Chat Button - start fresh, preserve old history in full-page */}
            {messages.length > 0 && (
              <button
                onClick={() => {
                  setMessages([]);
                  localStorage.removeItem('tami_conversation_history');
                  // Generate new session ID for proactive engine
                  const newSid = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
                  localStorage.setItem('tami_session_id', newSid);
                  sessionIdRef.current = newSid;
                  window.dispatchEvent(new Event('tami_history_updated'));
                }}
                title="Sesi Chat Baru"
                className="flex items-center gap-1 px-2 py-1 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all text-[10px] font-bold"
              >
                <PlusCircle className="w-3 h-3 text-primary" />
                <span>Baru</span>
              </button>
            )}

            {/* Clear Chat Button - same as new, kept for explicit delete intent */}
            {messages.length > 0 && (
              <button
                onClick={() => {
                  setMessages([]);
                  localStorage.removeItem('tami_conversation_history');
                  // Generate new session ID for proactive engine
                  const newSid = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
                  localStorage.setItem('tami_session_id', newSid);
                  sessionIdRef.current = newSid;
                  window.dispatchEvent(new Event('tami_history_updated'));
                }}
                title="Hapus Obrolan"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-900 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Maximize to full page */}
            <Link
              href="/tami"
              onClick={() => {
                // Save current state before navigating so full page can restore
                if (sseStreaming || isLoading) {
                  sessionStorage.setItem('tami_streaming_active', 'true');
                }
                // Ensure latest messages are saved
                localStorage.setItem('tami_conversation_history', JSON.stringify(messages));
                window.dispatchEvent(new Event('tami_history_updated'));
                onClose();
              }}
              title="Buka Halaman Penuh"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </Link>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 space-y-6" role="log" aria-live="polite" aria-label="Riwayat percakapan TAMI">
          {/* T7-6: Degraded mode banner */}
          {isDegraded && (
            <div className="flex items-center gap-2 rounded-xl border border-amber-800/60 bg-amber-950/40 px-3 py-2 text-[10px] text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>TAMI sedang dalam mode terbatas. Respons mungkin kurang optimal, tapi tetap bisa mendengarkan kamu.</span>
            </div>
          )}

          {/* T7-2: Proactive greeting for returning users */}
          {proactiveGreeting && messages.length === 0 && !showOnboarding && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
                <TamiIcon className="w-4 h-4" />
              </div>
              <div className="bg-neutral-900/60 border border-neutral-800/80 text-neutral-200 text-xs px-4 py-3 rounded-2xl rounded-tl-sm">
                {proactiveGreeting}
              </div>
            </div>
          )}

          {messages.length === 0 && (
            showOnboarding ? (
              <div className="py-6 px-2">
                <OnboardingMessage onSuggestionClick={(text) => {
                  markOnboardingSeen();
                  setShowOnboarding(false);
                  setInput(text);
                }} />
              </div>
            ) : (
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
            )
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
                    {/* Severity Level Badge - only after streaming complete */}
                    {msg.cognitiveData?.severityLevel && !sseStreaming && (
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[8px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-full border ${
                          msg.cognitiveData.severityLevel === 'berat'
                            ? 'bg-red-950/60 border-red-800/60 text-red-300'
                            : msg.cognitiveData.severityLevel === 'sedang'
                            ? 'bg-amber-950/60 border-amber-800/60 text-amber-300'
                            : 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300'
                        }`}>
                          {msg.cognitiveData.severityLevel === 'berat' ? '🔴 Berat' : msg.cognitiveData.severityLevel === 'sedang' ? '🟡 Sedang' : '🟢 Ringan'}
                        </span>
                      </div>
                    )}
                    <div className="bg-neutral-900/60 border border-neutral-800/80 text-neutral-200 text-xs px-4 py-3 rounded-2xl rounded-tl-sm leading-relaxed shadow-sm">
                      <StreamingMessage
                        content={msg.content}
                        isLatest={msg.id === messages[messages.length - 1]?.id && msg.role === 'assistant'}
                        isStreaming={sseStreaming && msg.id === assistantIdRef.current}
                      />
                    </div>

                    {/* Feedback buttons (only after streaming complete and non-empty) */}
                    {msg.content && !sseStreaming && !hasActiveResponse && (
                      <FeedbackButtons messageId={msg.id} query={messages[messages.indexOf(msg) - 1]?.content || ''} reply={msg.content} />
                    )}

                    {/* WhatsApp Escalation Button - only after streaming complete */}
                    {msg.cognitiveData?.escalationUrl && !sseStreaming && (
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

                    {/* Quick Suggestions buttons - only after streaming complete */}
                    {msg.cognitiveData?.suggestions && msg.cognitiveData.suggestions.length > 0 && !sseStreaming && (
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

                    {msg.cognitiveData && !sseStreaming && (msg.cognitiveData.actionPlan?.length > 0 || msg.cognitiveData.citations?.length > 0) && (
                      <div className="space-y-4 mt-3">
                        <RealityDiagnosisCard diagnosis={msg.cognitiveData.diagnosis} />
                        <ReadingRoadmap citations={msg.cognitiveData.citations} />

                        {msg.cognitiveData.actionPlan && msg.cognitiveData.actionPlan.length > 0 && (
                          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3.5 backdrop-blur-xl">
                            <h3 className="font-bold text-white text-[11px] mb-2.5 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-primary" />
                              Rencana Aksi Konkret
                            </h3>
                            <div className="space-y-2.5">
                              {msg.cognitiveData.actionPlan.map((step, stepIdx) => (
                                <div key={`step-${stepIdx}-${step.timeframe}`} className="border-b border-neutral-800/60 pb-2 last:border-b-0 last:pb-0">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[11px] font-bold text-white">{step.title}</span>
                                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-neutral-400 bg-neutral-950 border border-neutral-800 px-1.5 py-0.5 rounded">
                                      {step.timeframe.replace('_', ' ')}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-neutral-400 leading-relaxed">{step.description}</p>
                                  {step.expectedObstacle && (
                                    <p className="text-[9px] text-amber-500/70 leading-relaxed mt-1 italic">Hambatan: {step.expectedObstacle}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Progress Logs */}
          {isLoading && (
            <div className="flex gap-3" role="status" aria-live="polite" aria-label="TAMI sedang memproses">
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
                          Menganalisis... <Loader2 className="w-2 h-2 animate-spin" />
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
              aria-label="Ketik pertanyaan untuk TAMI"
              className="w-full bg-neutral-900/60 border border-neutral-800 text-white rounded-full py-3.5 pl-5 pr-20 text-xs focus:outline-none focus:border-neutral-700 transition-colors placeholder:text-neutral-500"
            />
            {voiceSupported && !sseStreaming && (
              <button
                type="button"
                onClick={isVoiceListening ? stopListening : startListening}
                aria-label={isVoiceListening ? 'Berhenti merekam' : 'Input suara'}
                className={`absolute right-11 flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                  isVoiceListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            )}
            {sseStreaming ? (
              <button
                type="button"
                onClick={abortStream}
                aria-label="Hentikan respons"
                className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                <Square className="w-3 h-3 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="Kirim pesan"
                className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-950 hover:bg-neutral-200 transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
export default FloatingTamiChat;
