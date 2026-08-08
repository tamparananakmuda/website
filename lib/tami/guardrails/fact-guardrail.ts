import { CitationRef } from '../cognitive/types';
import { ArticleChunk } from '../rag/knowledge-graph';

export interface FactValidationResult {
  valid: boolean;
  sanitizedReply: string;
  sanitizedCitations: CitationRef[];
  warnings: string[];
}

/**
 * Memverifikasi dan membersihkan respons TAMI agar tidak ada rujukan artikel/seri,
 * slug URL, atau klaim eksternal fiktif yang tidak ada di dalam database RAG TAM.
 */
export function validateTamiFacts(
  replyText: string,
  citations: CitationRef[],
  availableChunks: ArticleChunk[]
): FactValidationResult {
  const warnings: string[] = [];
  const validSlugs = new Set(availableChunks.map(c => c.slug));
  const validTitles = new Set(availableChunks.map(c => c.title.toLowerCase()));

  // 1. Filter Citations agar hanya berisi artikel/seri yang benar-benar ada di RAG
  const sanitizedCitations = citations.filter(c => {
    const exists = validSlugs.has(c.slug) || validTitles.has(c.title.toLowerCase());
    if (!exists) {
      warnings.push(`Dikeluarkan kutipan fiktif/tidak terdaftar: "${c.title}" (${c.slug})`);
    }
    return exists;
  });

  // 2. Pemindaian & perbaikan otomatis link markdown [Judul](/artikel/slug) atau [Judul](/seri/slug)
  let sanitizedReply = replyText.replace(
    /\[([^\]]+)\]\((?:\/artikel\/|\/seri\/|\/)?([a-zA-Z0-9_-]+)\)/g,
    (fullMatch, title, slug) => {
      // Cek apakah slug ada di database
      if (validSlugs.has(slug)) {
        // Cari jenis konten (artikel / seri)
        const chunk = availableChunks.find(c => c.slug === slug);
        const prefix = chunk?.type === 'series' ? '/seri/' : '/artikel/';
        return `[${title}](${prefix}${slug})`;
      }

      // Jika slug tidak valid, coba cari berdasarkan kemiripan judul (title matching)
      const matchedChunk = availableChunks.find(c =>
        c.title.toLowerCase().includes(title.toLowerCase()) ||
        title.toLowerCase().includes(c.title.toLowerCase())
      );

      if (matchedChunk) {
        const prefix = matchedChunk.type === 'series' ? '/seri/' : '/artikel/';
        warnings.push(`Link slug "${slug}" dikoreksi ke "${matchedChunk.slug}" berdasarkan kemiripan judul.`);
        return `[${title}](${prefix}${matchedChunk.slug})`;
      }

      // Jika benar-benar fiktif dan tidak ditemukan match, ubah menjadi teks cetak tebal biasa tanpa link aktif
      warnings.push(`Tautan fiktif dibersihkan dari teks: "${title}" (${slug})`);
      return `**${title}**`;
    }
  );

  return {
    valid: warnings.length === 0,
    sanitizedReply,
    sanitizedCitations,
    warnings
  };
}
