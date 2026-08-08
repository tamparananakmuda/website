/**
 * Send crisis webhook notification to admin when TAMI detects critical severity.
 * Supports Slack and Discord webhook URLs via environment variable.
 */

const WEBHOOK_URL = process.env.TAMI_CRISIS_WEBHOOK_URL || '';
const WEBHOOK_TYPE = process.env.TAMI_CRISIS_WEBHOOK_TYPE || 'slack'; // 'slack' or 'discord'

interface CrisisNotification {
  emotion: string;
  resilience: number;
  severity: string;
  distortion: string;
  querySnippet: string;
  timestamp: string;
}

/**
 * Send crisis notification to configured webhook.
 * Silent fail if no webhook URL configured.
 */
export async function sendCrisisNotification(data: CrisisNotification): Promise<void> {
  if (!WEBHOOK_URL) return;

  try {
    const payload = WEBHOOK_TYPE === 'discord'
      ? {
          embeds: [{
            title: 'TAMI Crisis Alert',
            color: 0xff0000,
            fields: [
              { name: 'Severity', value: data.severity, inline: true },
              { name: 'Emotion', value: data.emotion, inline: true },
              { name: 'Resilience', value: `${data.resilience}/10`, inline: true },
              { name: 'Distortion', value: data.distortion || '-', inline: false },
              { name: 'Query Snippet', value: `\`\`\`${data.querySnippet}\`\`\``, inline: false },
              { name: 'Timestamp', value: data.timestamp, inline: true },
            ],
            footer: { text: 'TAMPARAN ANAK MUDA - TAMI Crisis Detection' },
          }],
        }
      : {
          text: `TAMI Crisis Alert`,
          attachments: [{
            color: 'danger',
            fields: [
              { title: 'Severity', value: data.severity, short: true },
              { title: 'Emotion', value: data.emotion, short: true },
              { title: 'Resilience', value: `${data.resilience}/10`, short: true },
              { title: 'Distortion', value: data.distortion || '-', short: true },
              { title: 'Query Snippet', value: `\`\`\`${data.querySnippet}\`\`\``, short: false },
              { title: 'Timestamp', value: data.timestamp, short: true },
            ],
          }],
        };

    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log('[TAMI CRISIS] Webhook notification sent');
  } catch (error) {
    console.error('[TAMI CRISIS] Webhook notification failed:', error);
  }
}
