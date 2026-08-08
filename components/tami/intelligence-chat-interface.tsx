'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Terminal, Loader2, Trash2, PlusCircle } from 'lucide-react';
import { TamiCognitiveResponse, ActionStep, CitationRef } from '@/lib/tami/cognitive/types';
import { RealityDiagnosisCard } from './reality-diagnosis-card';
import { ReadingRoadmap } from './reading-roadmap';
import { TamiIcon } from './tami-icon';
import { ChatContentRenderer } from './chat-content-renderer';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  cognitiveData?: Omit<TamiCognitiveResponse, 'conversationalReply'>;
}

export const IntelligenceChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progressLog, setProgressLog] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load conversation history from localStorage
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

    // Sync with other open tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tami_conversation_history' && e.newValue) {
        try {
          setMessages(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Failed to sync history from storage event', err);
        }
      }
    };

    // Sync within the same window across different component instances
    const handleLocalChange = () => {
      const updated = localStorage.getItem('tami_conversation_history');
      if (updated) {
        try {
          setMessages(JSON.parse(updated));
        } catch (err) {
          console.error('Failed to sync history locally', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tami_history_updated', handleLocalChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tami_history_updated', handleLocalChange);
    };
  }, []);

  // Save conversation history to localStorage when changed and dispatch same-page sync event
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tami_conversation_history', JSON.stringify(messages));
      window.dispatchEvent(new Event('tami_history_updated'));
    }
  }, [messages, isLoaded]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, progressLog, isLoading]);

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

    // Parallel simulation logs to keep UI responsive
    if (complexity === 'medium') {
      timers.push(setTimeout(() => addLog('Initializing TAMI Diagnostic...'), 100));
      timers.push(setTimeout(() => addLog('Diagnosing state...'), 350));
      timers.push(setTimeout(() => addLog('Analyzing query...'), 600));
    } else if (complexity === 'high') {
      timers.push(setTimeout(() => addLog('Initializing TAMI Cognitive Diagnostic Pipeline...'), 150));
      timers.push(setTimeout(() => addLog('Mind-State Analyzer: Membaca frekuensi emosi & mendeteksi sinyal krisis...'), 500));
      timers.push(setTimeout(() => addLog('Knowledge Graph RAG: Menscan 150+ esai & seri TAM untuk mencari topik relevan...'), 950));
      timers.push(setTimeout(() => addLog('Adversarial Debate Loop: Memperdebatkan bias berpikir & asumsi logismu...'), 1400));
      timers.push(setTimeout(() => addLog('Execution Synthesizer: Merumuskan rencana tindakan taktis (action roadmap)...'), 1950));
    }

    try {
      // Fetch from API
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/tami/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: currentInput, history: historyPayload }),
      });

      if (!res.ok) {
        throw new Error('Server returned an error');
      }

      const data: TamiCognitiveResponse = await res.json();
      
      // Clean up outstanding logs timers
      timers.forEach(clearTimeout);

      if (complexity !== 'low') {
        addLog('Cognitive Synthesis Engine: Menyusun tamparan realita akhir...');
        await new Promise((r) => setTimeout(r, 200));
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
    } catch (error) {
      console.error(error);
      timers.forEach(clearTimeout);
      addLog('⚠️ Error: Sistem gagal melakukan diagnosa kognitif.');
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Maaf, TAMI sedang mengalami kendala jaringan. Silakan coba kembali beberapa saat lagi.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-[700px] max-w-6xl mx-auto border border-neutral-800/80 bg-neutral-950/70 rounded-3xl overflow-hidden backdrop-blur-2xl shadow-2xl shadow-primary/10">
      {/* Top glowing accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/80 to-transparent" />

      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-neutral-900 bg-neutral-950/80 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <TamiIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-sm tracking-wide">PORTAL KONSULTASI TAMI</span>
              <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-widest">
                v2.0 Advanced
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">Layanan Konsultasi Realitas Karir, Keuangan & Tekanan Hidup Anak Muda</p>
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={() => {
                setMessages([]);
                localStorage.removeItem('tami_conversation_history');
                window.dispatchEvent(new Event('tami_history_updated'));
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-xs font-bold shadow-sm"
              title="Mulai sesi obrolan baru"
            >
              <PlusCircle className="w-3.5 h-3.5 text-primary" />
              <span>Chat Baru</span>
            </button>
          )}

          {messages.length > 0 && (
            <button
              onClick={() => {
                setMessages([]);
                localStorage.removeItem('tami_conversation_history');
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-900 bg-neutral-950 text-neutral-400 hover:text-red-500 hover:bg-neutral-900 transition-colors text-xs font-bold"
              title="Hapus riwayat obrolan"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-neutral-800 bg-neutral-950/80 text-primary">
                <TamiIcon className="w-8 h-8" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Selamat Datang di TAMI Intelligence</h2>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Tumpahkan realita, curhat, kekhawatiran finansial, kebingungan karir, atau dilema hidupmu di sini. TAMI akan membedah akar masalahnya dengan jujur dan realistis.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 w-full pt-4">
              <button 
                onClick={() => setInput("Saya umur 25, gaji pas-pasan, tapi FOMO tiap lihat teman-teman liburan di sosmed. Cara keluarnya gimana?")}
                className="text-left text-xs text-neutral-400 hover:text-white bg-neutral-950/60 border border-neutral-900 hover:border-neutral-800 px-4 py-3 rounded-2xl transition-all"
              >
                &quot;Saya umur 25, gaji pas-pasan, tapi FOMO tiap lihat teman-teman liburan di sosmed. Cara keluarnya gimana?&quot;
              </button>
              <button 
                onClick={() => setInput("Kerja rasanya burnout setengah mati, pengen resign dan rintis bisnis sendiri tapi tabungan tipis.")}
                className="text-left text-xs text-neutral-400 hover:text-white bg-neutral-950/60 border border-neutral-900 hover:border-neutral-800 px-4 py-3 rounded-2xl transition-all"
              >
                &quot;Kerja rasanya burnout setengah mati, pengen resign dan rintis bisnis sendiri tapi tabungan tipis.&quot;
              </button>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="space-y-4">
            {/* User message */}
            {msg.role === 'user' && (
              <div className="flex gap-3 justify-end">
                <div className="max-w-[70%] bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs px-4 py-3 rounded-2xl rounded-tr-none">
                  {msg.content}
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-800 text-neutral-400 border border-neutral-700">
                  <User className="w-4 h-4" />
                </div>
              </div>
            )}

            {/* Assistant message */}
            {msg.role === 'assistant' && (
              <div className="flex gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
                  <TamiIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-6">
                  {/* Chat reply content */}
                  <div className="inline-block max-w-[85%] bg-neutral-900/50 border border-neutral-900 text-neutral-300 text-xs px-4 py-3 rounded-2xl rounded-tl-none leading-relaxed">
                    <ChatContentRenderer content={msg.content} />
                  </div>

                  {/* WhatsApp Escalation Button if present */}
                  {msg.cognitiveData?.escalationUrl && (
                    <div className="mt-3">
                      <a
                        href={msg.cognitiveData.escalationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-bold hover:bg-emerald-900/90 transition-all shadow-lg shadow-emerald-950/40"
                      >
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        💬 Diskusi Intensif via WhatsApp dengan Tim TAM
                      </a>
                    </div>
                  )}

                  {/* Quick Suggestions buttons */}
                  {msg.cognitiveData?.suggestions && msg.cognitiveData.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.cognitiveData.suggestions.map((suggestion, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => setInput(suggestion)}
                          className="text-left text-[11px] font-medium text-neutral-400 hover:text-white bg-neutral-900/80 hover:bg-neutral-800/80 border border-neutral-800 hover:border-neutral-700 px-3 py-1.5 rounded-xl transition-all"
                        >
                          💡 {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Diagnosis Grid if cognitiveData exists and is not a generic greeting */}
                  {msg.cognitiveData && msg.cognitiveData.diagnosis.cognitiveDistortion !== 'Tidak Ada' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <RealityDiagnosisCard diagnosis={msg.cognitiveData.diagnosis} />
                      <div className="space-y-6">
                        <ReadingRoadmap citations={msg.cognitiveData.citations} />
                        
                        {/* Action Steps Card */}
                        <div className="rounded-3xl border border-neutral-800 bg-neutral-950/60 p-6 backdrop-blur-xl">
                          <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Rencana Aksi Konkret
                          </h3>
                          <div className="space-y-4">
                            {msg.cognitiveData.actionPlan.map((step) => (
                              <div key={step.timeframe} className="border-b border-neutral-900 pb-3 last:border-b-0 last:pb-0">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs font-bold text-white">{step.title}</span>
                                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
                                    {step.timeframe.replace('_', ' ')}
                                  </span>
                                </div>
                                <p className="text-[11px] text-neutral-400 leading-relaxed">{step.description}</p>
                                <p className="text-[10px] text-neutral-500 italic mt-1">⚠️ Hambatan: {step.expectedObstacle}</p>
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

        {/* Progress log / Loading State */}
        {isLoading && (
          <div className="flex gap-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <div className="flex-1 space-y-4">
              {progressLog.length > 0 ? (
                <div className="rounded-2xl border border-neutral-900 bg-neutral-950/80 p-4 max-w-md">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold mb-2">
                    <Terminal className="w-4 h-4 text-primary" />
                    <span>Cognitive Intelligence Pipeline</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-[10px] text-neutral-500">
                    {progressLog.map((log, index) => (
                      <div key={index} className="flex items-start gap-1">
                        <span className="text-primary">&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-1 text-primary animate-pulse">
                      <span>&gt;</span>
                      <span className="flex items-center gap-1">
                        Reasoning in progress... <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="inline-block max-w-[85%] bg-neutral-900/50 border border-neutral-900 text-neutral-400 text-xs px-4 py-3 rounded-2xl rounded-tl-none leading-relaxed italic animate-pulse">
                  TAMI sedang berpikir...
                </div>
              )}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Panel */}
      <form onSubmit={handleSend} className="border-t border-neutral-900 bg-neutral-950/80 p-4">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mulai konsultasi realitas karir & keuangan..."
            disabled={isLoading}
            className="w-full bg-neutral-900/60 border border-neutral-800 text-white rounded-full py-4 pl-6 pr-16 text-xs focus:outline-none focus:border-neutral-700 transition-colors placeholder:text-neutral-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-950 hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:hover:bg-white"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
export default IntelligenceChatInterface;
