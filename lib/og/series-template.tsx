import React, { ReactElement, CSSProperties } from 'react';

export type SeriesImageSize = 'card' | 'feature';

export interface SeriesTemplateProps {
  title: string;
  seriesTitle: string;
  seriesCurrent: number;
  seriesTotal: number;
  categoryColor: string;
  category?: string;
  excerpt?: string;
  readingTime?: number;
  publishedAt?: string | null;
  authorName?: string;
  ogHeadline?: string;
  coverImageUrl?: string | null;
  size: SeriesImageSize;
}

const COLORS = {
  bg: '#0A0A0A',
  bgDeep: '#050505',
  textPrimary: '#FAFAFA',
  textSecondary: '#A0A0A0',
  textMuted: '#555555',
  white: '#FFFFFF',
};

const FONT_DISPLAY = 'Syne';
const FONT_BODY = 'Plus Jakarta Sans';
const FONT_MONO = 'JetBrains Mono';

const SIZE_CONFIG = {
  card: {
    width: 800,
    height: 450,
    paddingX: 52,
    paddingY: 40,
    watermarkFont: 320,
    watermarkRight: -40,
    watermarkTop: 50,
    watermarkOpacity: 0.05,
    headlineFont: 36,
    excerptFont: 15,
    badgeFont: 12,
    badgeHeight: 26,
    badgePaddingX: 12,
    brandFont: 11,
    progressHeight: 3,
    progressWidth: 100,
    metaFont: 10,
    glowOpacity: '08',
  },
  feature: {
    width: 1600,
    height: 900,
    paddingX: 90,
    paddingY: 68,
    watermarkFont: 640,
    watermarkRight: -80,
    watermarkTop: 100,
    watermarkOpacity: 0.04,
    headlineFont: 64,
    excerptFont: 26,
    badgeFont: 20,
    badgeHeight: 42,
    badgePaddingX: 20,
    brandFont: 18,
    progressHeight: 5,
    progressWidth: 180,
    metaFont: 16,
    glowOpacity: '06',
  },
};

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.substring(0, max - 3);
  const lastSpace = cut.lastIndexOf(' ');
  if (lastSpace > max * 0.6) return cut.substring(0, lastSpace) + '...';
  return cut + '...';
}

export function SeriesOgTemplate(props: SeriesTemplateProps): ReactElement {
  const cfg = SIZE_CONFIG[props.size];
  const catColor = props.categoryColor || COLORS.textSecondary;
  const displayTitle = props.ogHeadline || props.title;
  const progressPercent = Math.round((props.seriesCurrent / props.seriesTotal) * 100);
  const epStr = String(props.seriesCurrent).padStart(2, '0');
  const totalStr = String(props.seriesTotal).padStart(2, '0');

  const rootStyle: CSSProperties = {
    width: `${cfg.width}px`,
    height: `${cfg.height}px`,
    backgroundColor: COLORS.bg,
    backgroundImage: `radial-gradient(ellipse at 78% 50%, ${catColor}${cfg.glowOpacity} 0%, transparent 55%), linear-gradient(160deg, ${COLORS.bgDeep} 0%, ${COLORS.bg} 65%)`,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
  };

  return (
    <div style={rootStyle}>
      {/* 1. WATERMARK - painted first = behind everything. Massive episode number. */}
      <div style={{
        position: 'absolute',
        top: `${cfg.watermarkTop}px`,
        right: `${cfg.watermarkRight}px`,
        fontFamily: FONT_DISPLAY,
        fontSize: `${cfg.watermarkFont}px`,
        fontWeight: 800,
        color: catColor,
        opacity: cfg.watermarkOpacity,
        lineHeight: 0.85,
        letterSpacing: '-0.08em',
        display: 'flex',
        flexShrink: 0,
      }}>
        {epStr}
      </div>

      {/* 2. CONTENT - painted after = on top of watermark */}
      {/* Top row: badge left, series total right */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${cfg.paddingY}px ${cfg.paddingX}px 0`,
        flexShrink: 0,
      }}>
        {/* Episode badge - solid colored pill, consistent corner */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: catColor,
          borderRadius: `${cfg.badgeHeight / 2}px`,
          paddingLeft: `${cfg.badgePaddingX}px`,
          paddingRight: `${cfg.badgePaddingX}px`,
          height: `${cfg.badgeHeight}px`,
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: FONT_DISPLAY,
            fontSize: `${cfg.badgeFont}px`,
            fontWeight: 700,
            color: COLORS.bg,
            letterSpacing: '0.1em',
            display: 'flex',
          }}>
            EP {epStr} / {totalStr}
          </span>
        </div>

        {/* Series total indicator - subtle */}
        <span style={{
          fontFamily: FONT_MONO,
          fontSize: `${cfg.metaFont}px`,
          color: COLORS.textMuted,
          letterSpacing: '0.1em',
          display: 'flex',
        }}>
          {progressPercent}% COMPLETE
        </span>
      </div>

      {/* 3. CENTER - Headline dominates 70% of frame */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `0 ${cfg.paddingX}px`,
        flex: 1,
      }}>
        <span style={{
          fontFamily: FONT_DISPLAY,
          fontSize: `${cfg.headlineFont}px`,
          fontWeight: 700,
          color: COLORS.textPrimary,
          letterSpacing: '-0.025em',
          lineHeight: 1.08,
          textAlign: 'center',
          display: 'flex',
          maxWidth: `${cfg.width * 0.62}px`,
        }}>
          {truncate(displayTitle, props.size === 'card' ? 48 : 80)}
        </span>

        {/* Excerpt - feature only */}
        {props.size === 'feature' && props.excerpt && (
          <span style={{
            fontFamily: FONT_BODY,
            fontSize: `${cfg.excerptFont}px`,
            fontWeight: 400,
            color: COLORS.textSecondary,
            lineHeight: 1.5,
            textAlign: 'center',
            marginTop: '24px',
            display: 'flex',
            maxWidth: `${cfg.width * 0.5}px`,
          }}>
            {truncate(props.excerpt, 130)}
          </span>
        )}
      </div>

      {/* 4. BOTTOM - Brand left, progress bar right */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `0 ${cfg.paddingX}px ${cfg.paddingY}px`,
        flexShrink: 0,
      }}>
        {/* Brand */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <div style={{
            width: '3px',
            height: `${cfg.brandFont}px`,
            backgroundColor: '#D13A3A',
            borderRadius: '1px',
            flexShrink: 0,
            display: 'flex',
          }} />
          <div style={{
            width: '3px',
            height: `${cfg.brandFont}px`,
            backgroundColor: '#D13A3A',
            borderRadius: '1px',
            marginLeft: '2px',
            flexShrink: 0,
            display: 'flex',
          }} />
          <span style={{
            fontFamily: FONT_DISPLAY,
            fontSize: `${cfg.brandFont * 0.65}px`,
            fontWeight: 700,
            color: COLORS.textPrimary,
            letterSpacing: '0.08em',
            marginLeft: '8px',
            display: 'flex',
          }}>
            TAMPARAN ANAK MUDA
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex',
            width: `${cfg.progressWidth}px`,
            height: `${cfg.progressHeight}px`,
            borderRadius: '2px',
            backgroundColor: 'rgba(255,255,255,0.06)',
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: catColor,
              borderRadius: '2px',
              flexShrink: 0,
              display: 'flex',
            }} />
          </div>
          <span style={{
            fontFamily: FONT_MONO,
            fontSize: `${cfg.metaFont}px`,
            color: COLORS.textMuted,
            letterSpacing: '0.05em',
            display: 'flex',
          }}>
            {epStr}/{totalStr}
          </span>
        </div>
      </div>
    </div>
  );
}
