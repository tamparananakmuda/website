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
  bgElevated: '#141414',
  textPrimary: '#E5E5E5',
  textSecondary: '#737373',
  textMuted: '#525252',
  border: 'rgba(229,229,229,0.08)',
};

const FONT_DISPLAY = 'Syne';
const FONT_BODY = 'Plus Jakarta Sans';
const FONT_MONO = 'JetBrains Mono';

const SIZE_CONFIG = {
  card: {
    width: 800,
    height: 450,
    paddingX: 56,
    paddingY: 40,
    episodeFont: 120,
    titleFont: 36,
    seriesTitleFont: 14,
    articleTitleFont: 22,
    excerptFont: 13,
    metaFont: 11,
    labelFont: 10,
    dotSize: 6,
    dotGap: 5,
    brandFont: 13,
    accentWidth: 4,
    episodeOpacity: 0.06,
  },
  feature: {
    width: 1600,
    height: 900,
    paddingX: 100,
    paddingY: 72,
    episodeFont: 240,
    titleFont: 64,
    seriesTitleFont: 22,
    articleTitleFont: 36,
    excerptFont: 22,
    metaFont: 16,
    labelFont: 16,
    dotSize: 10,
    dotGap: 8,
    brandFont: 20,
    accentWidth: 6,
    episodeOpacity: 0.05,
  },
};

const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function formatLongDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return `${date.getDate()} ${MONTHS_ID[date.getMonth()]} ${date.getFullYear()}`;
}

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
  const hasCover = !!props.coverImageUrl;
  const longDate = formatLongDate(props.publishedAt);

  const rootStyle: CSSProperties = {
    width: `${cfg.width}px`,
    height: `${cfg.height}px`,
    backgroundColor: COLORS.bg,
    backgroundImage: `
      linear-gradient(160deg, ${COLORS.bgDeep} 0%, #0d0d0d 50%, ${COLORS.bg} 100%)
    `,
    display: 'flex',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
  };

  // Diagonal stripe pattern for cinematic feel
  const stripePattern: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `repeating-linear-gradient(
      135deg,
      transparent,
      transparent 60px,
      ${catColor}08 60px,
      ${catColor}08 61px
    )`,
    pointerEvents: 'none',
  };

  // Massive episode number as watermark
  const episodeWatermark: CSSProperties = {
    position: 'absolute',
    top: '50%',
    right: `${cfg.paddingX * 0.5}px`,
    transform: 'translateY(-50%)',
    fontFamily: FONT_DISPLAY,
    fontSize: `${cfg.episodeFont}px`,
    fontWeight: 700,
    color: catColor,
    opacity: cfg.episodeOpacity,
    lineHeight: 1,
    letterSpacing: '-0.05em',
    pointerEvents: 'none',
    zIndex: 0,
  };

  // Top accent bar - full width thin line
  const topAccent: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: `${cfg.accentWidth}px`,
    background: `linear-gradient(90deg, ${catColor} 0%, ${catColor} ${Math.round((props.seriesCurrent / props.seriesTotal) * 100)}%, ${COLORS.bgElevated || '#141414'} ${Math.round((props.seriesCurrent / props.seriesTotal) * 100)}%, ${COLORS.bgElevated || '#141414'} 100%)`,
  };

  // Cover image (if any) - right side, faded
  const coverStyle: CSSProperties | null = hasCover ? {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '45%',
    overflow: 'hidden',
  } : null;

  const contentStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    padding: `${cfg.paddingY}px ${cfg.paddingX}px`,
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 2,
  };

  // Episode label row
  const labelRowStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: `${cfg.labelFont * 0.6}px`,
    flexShrink: 0,
  };

  // Dots progress
  const dotsContainer: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: `${cfg.dotGap}px`,
    flexShrink: 0,
  };

  return (
    <div style={rootStyle}>
      {/* Top progress accent bar */}
      <div style={topAccent} />

      {/* Diagonal stripe background */}
      <div style={stripePattern} />

      {/* Cover image on right side */}
      {coverStyle && (
        <div style={coverStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={props.coverImageUrl!}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            alt=""
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(to right, ${COLORS.bg} 0%, ${COLORS.bg} 20%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.4) 100%)`,
          }} />
        </div>
      )}

      {/* Massive episode number watermark */}
      <div style={episodeWatermark}>
        {String(props.seriesCurrent).padStart(2, '0')}
      </div>

      {/* Content */}
      <div style={contentStyle}>
        {/* Top: Episode label + dots */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          marginBottom: `${cfg.paddingY * 0.4}px`,
        }}>
          <div style={labelRowStyle}>
            {/* Colored square indicator */}
            <div style={{
              width: `${cfg.labelFont * 0.8}px`,
              height: `${cfg.labelFont * 0.8}px`,
              backgroundColor: catColor,
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: FONT_DISPLAY,
              fontSize: `${cfg.labelFont}px`,
              fontWeight: 700,
              color: COLORS.textPrimary,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>
              EPISODE {String(props.seriesCurrent).padStart(2, '0')}
            </span>
            <span style={{
              fontFamily: FONT_DISPLAY,
              fontSize: `${cfg.labelFont * 0.85}px`,
              fontWeight: 400,
              color: COLORS.textMuted,
              letterSpacing: '0.1em',
            }}>
              / {String(props.seriesTotal).padStart(2, '0')}
            </span>
          </div>

          {/* Dots progress indicator */}
          <div style={dotsContainer}>
            {Array.from({ length: Math.min(props.seriesTotal, 12) }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: `${cfg.dotSize}px`,
                  height: `${cfg.dotSize}px`,
                  borderRadius: '50%',
                  backgroundColor: i < props.seriesCurrent ? catColor : 'rgba(229,229,229,0.12)',
                  flexShrink: 0,
                }}
              />
            ))}
            {props.seriesTotal > 12 && (
              <span style={{
                fontFamily: FONT_MONO,
                fontSize: `${cfg.labelFont * 0.7}px`,
                color: COLORS.textMuted,
                marginLeft: '4px',
              }}>
                +{props.seriesTotal - 12}
              </span>
            )}
          </div>
        </div>

        {/* Series title - prominent */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          marginBottom: `${cfg.paddingY * 0.3}px`,
        }}>
          <span style={{
            fontFamily: FONT_DISPLAY,
            fontSize: `${cfg.seriesTitleFont}px`,
            fontWeight: 700,
            color: catColor,
            letterSpacing: '0.02em',
            lineHeight: 1.2,
            display: 'flex',
            maxWidth: `${cfg.width * 0.65}px`,
          }}>
            {truncate(props.seriesTitle, 60)}
          </span>
        </div>

        {/* Divider line */}
        <div style={{
          width: `${cfg.width * 0.12}px`,
          height: '2px',
          backgroundColor: catColor,
          flexShrink: 0,
          marginBottom: `${cfg.paddingY * 0.3}px`,
        }} />

        {/* Article title - the hook/headline */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          flex: 1,
        }}>
          <span style={{
            fontFamily: FONT_DISPLAY,
            fontSize: `${cfg.articleTitleFont}px`,
            fontWeight: 700,
            color: COLORS.textPrimary,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            display: 'flex',
            maxWidth: `${cfg.width * 0.7}px`,
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}>
            {truncate(displayTitle, props.size === 'card' ? 50 : 80)}
          </span>

          {/* Excerpt (feature only) */}
          {props.size === 'feature' && props.excerpt && (
            <span style={{
              fontFamily: FONT_BODY,
              fontSize: `${cfg.excerptFont}px`,
              fontWeight: 400,
              color: COLORS.textSecondary,
              lineHeight: 1.5,
              marginTop: '20px',
              maxWidth: `${cfg.width * 0.6}px`,
              display: 'flex',
            }}>
              {truncate(props.excerpt, 140)}
            </span>
          )}
        </div>

        {/* Bottom: metadata + brand */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          marginTop: 'auto',
        }}>
          {/* Metadata */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '12px',
          }}>
            {props.readingTime !== undefined && (
              <span style={{
                fontFamily: FONT_MONO,
                fontSize: `${cfg.metaFont}px`,
                color: COLORS.textSecondary,
                letterSpacing: '0.05em',
              }}>
                {props.readingTime} MENIT BACA
              </span>
            )}
            {longDate && (
              <>
                <span style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  backgroundColor: COLORS.textMuted,
                }} />
                <span style={{
                  fontFamily: FONT_MONO,
                  fontSize: `${cfg.metaFont}px`,
                  color: COLORS.textSecondary,
                  letterSpacing: '0.05em',
                }}>
                  {longDate.toUpperCase()}
                </span>
              </>
            )}
            {props.authorName && props.size === 'feature' && (
              <>
                <span style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  backgroundColor: COLORS.textMuted,
                }} />
                <span style={{
                  fontFamily: FONT_MONO,
                  fontSize: `${cfg.metaFont}px`,
                  color: COLORS.textSecondary,
                  letterSpacing: '0.05em',
                }}>
                  {props.authorName.toUpperCase()}
                </span>
              </>
            )}
          </div>

          {/* Brand */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
          }}>
            <div style={{
              width: '3px',
              height: `${cfg.brandFont}px`,
              backgroundColor: '#D13A3A',
            }} />
            <div style={{
              width: '3px',
              height: `${cfg.brandFont}px`,
              backgroundColor: '#D13A3A',
            }} />
            <span style={{
              fontFamily: FONT_DISPLAY,
              fontSize: `${cfg.brandFont * 0.7}px`,
              fontWeight: 700,
              color: COLORS.textPrimary,
              letterSpacing: '0.05em',
              marginLeft: '4px',
            }}>
              TAMPARAN ANAK MUDA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
