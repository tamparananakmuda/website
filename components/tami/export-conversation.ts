'use client';

/**
 * Export TAMI conversation to Markdown file (client-side download).
 */

interface ExportMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  cognitiveData?: {
    mindState?: { primaryEmotion?: string; resilienceScore?: number };
    diagnosis?: { cognitiveDistortion?: string; rootCauseAnalysis?: string };
    severityLevel?: string;
    citations?: Array<{ title: string; slug: string; type: string }>;
  };
}

export function exportConversationAsMarkdown(
  messages: ExportMessage[],
  sessionTitle: string = 'Percakapan TAMI',
): void {
  const date = new Date().toISOString().slice(0, 10);
  const lines: string[] = [
    `# ${sessionTitle}`,
    '',
    `**Tanggal:** ${date}`,
    `**Jumlah pesan:** ${messages.length}`,
    '',
    '---',
    '',
  ];

  for (const msg of messages) {
    if (msg.role === 'user') {
      lines.push(`## 🧑 Kamu`, '', msg.content, '');
    } else {
      lines.push(`## 🤖 TAMI`, '', msg.content, '');

      if (msg.cognitiveData) {
        const cd = msg.cognitiveData;
        if (cd.mindState?.primaryEmotion || cd.mindState?.resilienceScore) {
          lines.push(
            `> **Diagnosa:** Emosi=${cd.mindState?.primaryEmotion || '-'} | Ketahanan Mental=${cd.mindState?.resilienceScore || '-'}/10 | Severity=${cd.severityLevel || '-'}`,
          );
        }
        if (cd.diagnosis?.cognitiveDistortion) {
          lines.push(`> **Distorsi Kognitif:** ${cd.diagnosis.cognitiveDistortion}`);
        }
        if (cd.citations && cd.citations.length > 0) {
          lines.push(
            `> **Rekomendasi Bacaan:** ${cd.citations.map((c) => `[${c.title}](/${c.type === 'series' ? 'seri' : c.type === 'whitepaper' ? 'whitepaper' : 'artikel'}/${c.slug})`).join(', ')}`,
          );
        }
        lines.push('');
      }
    }

    lines.push('---', '');
  }

  lines.push('', `*Diekspor dari TAMPARAN ANAK MUDA — tamparananakmuda.com*`);

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tami-${date}-${sessionTitle.slice(0, 30).replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
