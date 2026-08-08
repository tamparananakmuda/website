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

  // Protect chart/comparison/nerd blocks dari link regex corruption
  const blockPlaceholders: string[] = [];
  let textToSanitize = replyText.replace(
    /```(?:chart:[a-z-]+|calc:(?:inflation-impact|farmer-share)|comparison|nerd)\r?\n[\s\S]*?```/g,
    (match) => {
      const placeholder = `__TAMI_BLOCK_${blockPlaceholders.length}__`;
      blockPlaceholders.push(match);
      return placeholder;
    }
  );

  // 2b. PII Protection: redact phone numbers and email addresses from response
  // Indonesian phone: +62xxx, 08xxx, 62xxx
  textToSanitize = textToSanitize.replace(
    /(\+?62\s?8\d{2,}|08\d{2,})[\d\s-]{4,12}/g,
    '[nomor telepon disembunyikan]'
  );
  // Email addresses
  textToSanitize = textToSanitize.replace(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    '[email disembunyikan]'
  );

  // 2c. External URL sanitization: convert non-TAM external links to plain text
  // Allow only tam.anakmuda.com, wa.me, tel:, healing119.id, 119
  textToSanitize = textToSanitize.replace(
    /\[([^\]]+)\]\((https?:\/\/(?!tam\.|healing119\.|wa\.me)[^\s)]+)\)/g,
    (match, title, url) => {
      warnings.push(`Tautan eksternal non-TAM dihapus: "${url}"`);
      return `**${title}**`;
    }
  );

  // 2. Pemindaian & perbaikan otomatis link markdown [Judul](/artikel/slug), [Judul](/seri/slug), [Judul](/whitepaper/slug)
  textToSanitize = textToSanitize.replace(
    /\[([^\]]+)\]\((?:\/artikel\/|\/seri\/|\/whitepaper\/|\/)?([a-zA-Z0-9_-]+)\)/g,
    (fullMatch, title, slug) => {
      // Cek apakah slug ada di database
      if (validSlugs.has(slug)) {
        // Cari jenis konten (artikel / seri / whitepaper)
        const chunk = availableChunks.find(c => c.slug === slug);
        const prefix = chunk?.type === 'series' ? '/seri/' : chunk?.type === 'whitepaper' ? '/whitepaper/' : '/artikel/';
        return `[${title}](${prefix}${slug})`;
      }

      // Jika slug tidak valid, coba cari berdasarkan kemiripan judul (title matching)
      // Threshold: minimal 60% kata di title user harus ada di title artikel TAM
      const titleWords = title.toLowerCase().split(/\s+/).filter((w: string) => w.length >= 3);
      const matchedChunk = availableChunks.find(c => {
        const cTitleLower = c.title.toLowerCase();
        const cTitleWords = cTitleLower.split(/\s+/).filter((w: string) => w.length >= 3);
        const overlap = titleWords.filter((w: string) => cTitleWords.includes(w)).length;
        const ratio = titleWords.length > 0 ? overlap / titleWords.length : 0;
        return ratio >= 0.6 || (cTitleLower.includes(title.toLowerCase()) && title.length >= 10);
      });

      if (matchedChunk) {
        const prefix = matchedChunk.type === 'series' ? '/seri/' : matchedChunk.type === 'whitepaper' ? '/whitepaper/' : '/artikel/';
        warnings.push(`Link slug "${slug}" dikoreksi ke "${matchedChunk.slug}" berdasarkan kemiripan judul.`);
        return `[${title}](${prefix}${matchedChunk.slug})`;
      }

      // Jika benar-benar fiktif dan tidak ditemukan match, ubah menjadi teks cetak tebal biasa tanpa link aktif
      warnings.push(`Tautan fiktif dibersihkan dari teks: "${title}" (${slug})`);
      return `**${title}**`;
    }
  );

  // Restore chart/comparison/nerd blocks
  const sanitizedReply = textToSanitize.replace(
    /__TAMI_BLOCK_(\d+)__/g,
    (_, idx) => blockPlaceholders[Number(idx)] || ''
  );

  return {
    valid: warnings.length === 0,
    sanitizedReply,
    sanitizedCitations,
    warnings
  };
}
