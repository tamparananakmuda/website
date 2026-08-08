import React from 'react';
import { CitationRef } from '@/lib/tami/cognitive/types';
import { ArrowRight, BookOpen, FileText, Sparkles } from 'lucide-react';
import { TamiIcon } from './tami-icon';
import Link from 'next/link';

interface ReadingRoadmapProps {
  citations: CitationRef[];
}

export const ReadingRoadmap: React.FC<ReadingRoadmapProps> = ({ citations }) => {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-neutral-700 hover:shadow-2xl hover:shadow-primary/10">
      <div className="absolute -left-24 -bottom-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
          <TamiIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-white text-base">Reading Roadmap</h3>
          <p className="text-xs text-neutral-400">Jalur pembelajaran mandiri berdasarkan pembedahan masalahmu.</p>
        </div>
      </div>

      <div className="relative flex flex-col gap-6 pl-4 border-l border-neutral-800">
        {citations.map((cite, index) => {
          const isSeries = cite.type === 'series';
          const articleUrl = isSeries 
            ? `/seri/${cite.slug}` 
            : `/artikel/${cite.slug}`;

          return (
            <div key={cite.slug} className="relative flex flex-col gap-2 group">
              {/* Timeline dot */}
              <div className="absolute -left-[25px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950 text-[10px] font-bold text-neutral-400 group-hover:border-primary group-hover:text-primary transition-colors">
                {index + 1}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border ${
                  isSeries 
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                    : 'bg-primary/10 text-primary border-primary/20'
                }`}>
                  {isSeries ? 'Seri Investigasi' : 'Esai Realita'}
                </span>
                
                {cite.seriesName && cite.seriesOrder && (
                  <span className="text-[9px] font-bold text-neutral-500 bg-neutral-900 px-1.5 py-0.5 rounded">
                    Bagian {cite.seriesOrder}
                  </span>
                )}
              </div>

              <Link 
                href={articleUrl}
                className="group/link flex flex-col gap-1 inline-block text-left"
              >
                <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors flex items-center gap-1">
                  {cite.title}
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-primary" />
                </h4>
                
                <p className="text-xs text-neutral-400 leading-relaxed italic mt-1 pl-3 border-l-2 border-neutral-900 group-hover:border-primary/30 transition-colors">
                  &quot;{cite.relevanceExplanation}&quot;
                </p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ReadingRoadmap;
