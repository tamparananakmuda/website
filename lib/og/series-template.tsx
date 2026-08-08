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
  bg: '#0B0B0B',
  bgDeep: '#070707',
  textPrimary: '#FAFAFA',
  textSecondary: '#9A9A9A',
  textMuted: '#4A4A4A',
  white: '#FFFFFF',
  rule: '#1C1C1C',
};

const FONT_DISPLAY = 'Plus Jakarta Sans';
const FONT_BODY = 'Plus Jakarta Sans';
const FONT_MONO = 'JetBrains Mono';

const SIZE_CONFIG = {
  card: {
    width: 800,
    height: 450,
    leftWidth: 520,
    paddingX: 52,
    paddingY: 40,
    rightPaddingX: 36,
    headlineFont: 44,
    excerptFont: 17,
    episodeNumFont: 72,
    episodeLabelFont: 11,
    seriesTitleFont: 13,
    brandFont: 10,
    metaFont: 10,
    accentBarWidth: 3,
    accentBarHeight: 60,
    progressWidth: 80,
    progressHeight: 2,
    ruleWidth: 48,
    ruleHeight: 1,
    glowOpacity: '05',
    dividerOpacity: '15',
    gapBeforeHeadline: 16,
    gapBeforeExcerpt: 28,
    gapBeforeRule: 24,
  },
  feature: {
    width: 1600,
    height: 900,
    leftWidth: 1040,
    paddingX: 90,
    paddingY: 68,
    rightPaddingX: 60,
    headlineFont: 80,
    excerptFont: 28,
    episodeNumFont: 140,
    episodeLabelFont: 18,
    seriesTitleFont: 22,
    brandFont: 16,
    metaFont: 14,
    accentBarWidth: 4,
    accentBarHeight: 120,
    progressWidth: 160,
    progressHeight: 3,
    ruleWidth: 80,
    ruleHeight: 2,
    glowOpacity: '03',
    dividerOpacity: '10',
    gapBeforeHeadline: 28,
    gapBeforeExcerpt: 44,
    gapBeforeRule: 40,
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
    backgroundImage: `linear-gradient(160deg, ${COLORS.bgDeep} 0%, ${COLORS.bg} 50%, #0D0D0D 100%)`,
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
  };

  return (
    <div style={rootStyle}>
      {/* Single subtle glow - right panel only */}
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        width: `${cfg.width - cfg.leftWidth}px`,
        height: '100%',
        backgroundImage: `radial-gradient(ellipse at 50% 40%, ${catColor}${cfg.glowOpacity} 0%, transparent 65%)`,
        display: 'flex',
        flexShrink: 0,
      }} />

      {/* LEFT 65% - The Hook (episode-specific content) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: `${cfg.leftWidth}px`,
        height: '100%',
        padding: `${cfg.paddingY}px ${cfg.paddingX}px`,
        boxSizing: 'border-box',
        flexShrink: 0,
      }}>
        {/* Top: category eyebrow */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <div style={{
            width: `${cfg.accentBarWidth}px`,
            height: `${cfg.episodeLabelFont}px`,
            backgroundColor: catColor,
            borderRadius: '1px',
            flexShrink: 0,
            display: 'flex',
          }} />
          <span style={{
            fontFamily: FONT_DISPLAY,
            fontSize: `${cfg.episodeLabelFont}px`,
            fontWeight: 700,
            color: catColor,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginLeft: '10px',
            display: 'flex',
          }}>
            {(props.category || 'SERI').toUpperCase()}
          </span>
        </div>

        {/* Center block - vertically centered headline + excerpt */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
        }}>
          {/* Headline - oversized, editorial, dominant */}
          <span style={{
            fontFamily: FONT_DISPLAY,
            fontSize: `${cfg.headlineFont}px`,
            fontWeight: 800,
            color: COLORS.textPrimary,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            textAlign: 'left',
            display: 'flex',
            maxWidth: `${cfg.leftWidth - cfg.paddingX * 2}px`,
            flexShrink: 0,
          }}>
            {truncate(displayTitle, props.size === 'card' ? 44 : 72)}
          </span>

          {/* Excerpt - feature only */}
          {props.size === 'feature' && props.excerpt && (
            <>
              <div style={{ height: `${cfg.gapBeforeExcerpt}px`, flexShrink: 0, display: 'flex' }} />
              <span style={{
                fontFamily: FONT_BODY,
                fontSize: `${cfg.excerptFont}px`,
                fontWeight: 400,
                color: COLORS.textSecondary,
                lineHeight: 1.5,
                textAlign: 'left',
                display: 'flex',
                maxWidth: `${cfg.leftWidth - cfg.paddingX * 2.2}px`,
                flexShrink: 0,
              }}>
                {truncate(props.excerpt, 120)}
              </span>
            </>
          )}
        </div>

        {/* Bottom: thin rule + brand */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <div style={{
            width: `${cfg.ruleWidth}px`,
            height: `${cfg.ruleHeight}px`,
            backgroundColor: COLORS.rule,
            flexShrink: 0,
            display: 'flex',
          }} />
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: '14px',
            flexShrink: 0,
          }}>
            <div style={{
              width: '2px',
              height: `${cfg.brandFont}px`,
              backgroundColor: '#D13A3A',
              borderRadius: '1px',
              flexShrink: 0,
              display: 'flex',
            }} />
            <div style={{
              width: '2px',
              height: `${cfg.brandFont}px`,
              backgroundColor: '#D13A3A',
              borderRadius: '1px',
              marginLeft: '2px',
              flexShrink: 0,
              display: 'flex',
            }} />
            <span style={{
              fontFamily: FONT_DISPLAY,
              fontSize: `${cfg.brandFont * 0.7}px`,
              fontWeight: 700,
              color: COLORS.textPrimary,
              letterSpacing: '0.1em',
              marginLeft: '8px',
              display: 'flex',
            }}>
              TAMPARAN ANAK MUDA
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT 35% - Episode Identity Zone (consistent across all episodes) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${cfg.width - cfg.leftWidth}px`,
        height: '100%',
        padding: `${cfg.paddingY}px ${cfg.rightPaddingX}px`,
        boxSizing: 'border-box',
        flexShrink: 0,
      }}>
        {/* Vertical accent bar */}
        <div style={{
          width: `${cfg.accentBarWidth}px`,
          height: `${cfg.accentBarHeight}px`,
          backgroundColor: catColor,
          borderRadius: '2px',
          flexShrink: 0,
          display: 'flex',
        }} />

        {/* Episode number - massive, standalone */}
        <span style={{
          fontFamily: FONT_DISPLAY,
          fontSize: `${cfg.episodeNumFont}px`,
          fontWeight: 700,
          color: COLORS.textPrimary,
          lineHeight: 0.9,
          letterSpacing: '-0.05em',
          marginTop: '24px',
          display: 'flex',
          flexShrink: 0,
        }}>
          {epStr}
        </span>

        {/* Total episodes - subtle */}
        <span style={{
          fontFamily: FONT_MONO,
          fontSize: `${cfg.metaFont}px`,
          color: COLORS.textMuted,
          letterSpacing: '0.15em',
          marginTop: '8px',
          display: 'flex',
          flexShrink: 0,
        }}>
          DARI {totalStr}
        </span>

        {/* Spacer */}
        <div style={{ flex: 1, display: 'flex' }} />

        {/* Progress bar - thin, minimal */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex',
            width: `${cfg.progressWidth}px`,
            height: `${cfg.progressHeight}px`,
            borderRadius: '1px',
            backgroundColor: COLORS.rule,
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: catColor,
              flexShrink: 0,
              display: 'flex',
            }} />
          </div>
          <span style={{
            fontFamily: FONT_MONO,
            fontSize: `${cfg.metaFont}px`,
            color: COLORS.textMuted,
            letterSpacing: '0.1em',
            marginTop: '8px',
            display: 'flex',
          }}>
            {progressPercent}%
          </span>
        </div>
      </div>
    </div>
  );
}
