import React, { ReactElement, CSSProperties } from 'react';
import { getCategorySignature } from './category-signatures';

export type ImageSize = 'og' | 'feature' | 'card' | 'sosial' | 'newsletter';

export interface TemplateProps {
  title: string;
  category?: string;
  categoryColor?: string;
  categorySlug?: string;
  excerpt?: string;
  readingTime?: number;
  publishedAt?: string | null;
  authorName?: string;
  isPremium?: boolean;
  isSponsored?: boolean;
  seriesCurrent?: number;
  seriesTotal?: number;
  coverImageUrl?: string | null;
  size: ImageSize;
  platform?: string;
  handle?: string;
  editionNumber?: number;
  ogHeadline?: string;
}

type SizeConfig = {
  width: number;
  height: number;
  paddingX: number;
  paddingY: number;
  titleFont: number;
  titleLineHeight: number;
  titleMaxChars: number;
  excerptFont: number;
  metadataFont: number;
  categoryFont: number;
  issueFont: number;
  brandFont: number;
  taglineFont: number;
  badgeFont: number;
  badgePaddingX: number;
  badgePaddingY: number;
  divider1Width: number;
  divider2Width: number;
  barWidth: number;
  barPosition: 'right' | 'top';
  signatureSize: number;
  signaturePosition: 'bottom-left' | 'bottom-right';
  showExcerpt: boolean;
  showMetadata: boolean;
  showAuthor: boolean;
  showTagline: boolean;
  showDivider2: boolean;
  showCategorySignature: boolean;
  brandMarkHeight: number;
  footerMarkHeight: number;
  gapAfterHeader: number;
  gapAfterDivider1: number;
  gapAfterTitle: number;
  gapAfterDivider2: number;
  gapAfterExcerpt: number;
  headerHeight: number;
  panelPaddingX: number;
  panelPaddingY: number;
  panelRadius: number;
  titleMaxWidth: number;
  excerptMaxWidth: number;
  accentLineWidth: number;
  accentLineGap: number;
};

const CONFIGS: Record<ImageSize, SizeConfig> = {
  og: {
    width: 1200, height: 630, paddingX: 100, paddingY: 80,
    titleFont: 72, titleLineHeight: 1.05, titleMaxChars: 80,
    excerptFont: 22, metadataFont: 14, categoryFont: 12,
    issueFont: 12, brandFont: 18, taglineFont: 13, badgeFont: 11,
    badgePaddingX: 10, badgePaddingY: 4,
    divider1Width: 0, divider2Width: 0,
    barWidth: 0, barPosition: 'right',
    signatureSize: 240, signaturePosition: 'bottom-right',
    showExcerpt: true, showMetadata: true, showAuthor: false, showTagline: true,
    showDivider2: false, showCategorySignature: true,
    brandMarkHeight: 24, footerMarkHeight: 16,
    gapAfterHeader: 8, gapAfterDivider1: 12, gapAfterTitle: 24,
    gapAfterDivider2: 12, gapAfterExcerpt: 16, headerHeight: 24,
    panelPaddingX: 48, panelPaddingY: 48, panelRadius: 16,
    titleMaxWidth: 940, excerptMaxWidth: 880,
    accentLineWidth: 20, accentLineGap: 40,
  },
  feature: {
    width: 1600, height: 900, paddingX: 140, paddingY: 100,
    titleFont: 88, titleLineHeight: 1.05, titleMaxChars: 100,
    excerptFont: 28, metadataFont: 18, categoryFont: 14,
    issueFont: 14, brandFont: 22, taglineFont: 15, badgeFont: 13,
    badgePaddingX: 14, badgePaddingY: 6,
    divider1Width: 0, divider2Width: 0,
    barWidth: 0, barPosition: 'right',
    signatureSize: 320, signaturePosition: 'bottom-right',
    showExcerpt: true, showMetadata: true, showAuthor: true, showTagline: true,
    showDivider2: false, showCategorySignature: true,
    brandMarkHeight: 28, footerMarkHeight: 20,
    gapAfterHeader: 8, gapAfterDivider1: 12, gapAfterTitle: 28,
    gapAfterDivider2: 16, gapAfterExcerpt: 20, headerHeight: 28,
    panelPaddingX: 60, panelPaddingY: 60, panelRadius: 20,
    titleMaxWidth: 1200, excerptMaxWidth: 1100,
    accentLineWidth: 24, accentLineGap: 48,
  },
  card: {
    width: 800, height: 450, paddingX: 64, paddingY: 40,
    titleFont: 44, titleLineHeight: 1.1, titleMaxChars: 50,
    excerptFont: 0, metadataFont: 0, categoryFont: 10,
    issueFont: 10, brandFont: 14, taglineFont: 0, badgeFont: 10,
    badgePaddingX: 8, badgePaddingY: 4,
    divider1Width: 0, divider2Width: 0,
    barWidth: 0, barPosition: 'top',
    signatureSize: 160, signaturePosition: 'bottom-right',
    showExcerpt: false, showMetadata: false, showAuthor: false, showTagline: false,
    showDivider2: false, showCategorySignature: true,
    brandMarkHeight: 20, footerMarkHeight: 14,
    gapAfterHeader: 6, gapAfterDivider1: 10, gapAfterTitle: 0,
    gapAfterDivider2: 0, gapAfterExcerpt: 0, headerHeight: 20,
    panelPaddingX: 32, panelPaddingY: 32, panelRadius: 12,
    titleMaxWidth: 640, excerptMaxWidth: 0,
    accentLineWidth: 12, accentLineGap: 24,
  },
  sosial: {
    width: 1200, height: 630, paddingX: 100, paddingY: 80,
    titleFont: 60, titleLineHeight: 1.05, titleMaxChars: 100,
    excerptFont: 20, metadataFont: 14, categoryFont: 12,
    issueFont: 12, brandFont: 18, taglineFont: 13, badgeFont: 11,
    badgePaddingX: 10, badgePaddingY: 4,
    divider1Width: 0, divider2Width: 0,
    barWidth: 0, barPosition: 'right',
    signatureSize: 240, signaturePosition: 'bottom-right',
    showExcerpt: false, showMetadata: false, showAuthor: false, showTagline: true,
    showDivider2: false, showCategorySignature: false,
    brandMarkHeight: 24, footerMarkHeight: 16,
    gapAfterHeader: 8, gapAfterDivider1: 12, gapAfterTitle: 28,
    gapAfterDivider2: 12, gapAfterExcerpt: 16, headerHeight: 24,
    panelPaddingX: 48, panelPaddingY: 48, panelRadius: 16,
    titleMaxWidth: 900, excerptMaxWidth: 0,
    accentLineWidth: 20, accentLineGap: 40,
  },
  newsletter: {
    width: 1200, height: 300, paddingX: 80, paddingY: 60,
    titleFont: 28, titleLineHeight: 1.2, titleMaxChars: 80,
    excerptFont: 20, metadataFont: 14, categoryFont: 0,
    issueFont: 14, brandFont: 28, taglineFont: 20, badgeFont: 0,
    badgePaddingX: 0, badgePaddingY: 0,
    divider1Width: 80, divider2Width: 0,
    barWidth: 0, barPosition: 'right',
    signatureSize: 0, signaturePosition: 'bottom-left',
    showExcerpt: false, showMetadata: false, showAuthor: false, showTagline: true,
    showDivider2: false, showCategorySignature: false,
    brandMarkHeight: 28, footerMarkHeight: 0,
    gapAfterHeader: 12, gapAfterDivider1: 0, gapAfterTitle: 0,
    gapAfterDivider2: 0, gapAfterExcerpt: 0, headerHeight: 32,
    panelPaddingX: 0, panelPaddingY: 0, panelRadius: 0,
    titleMaxWidth: 0, excerptMaxWidth: 0,
    accentLineWidth: 0, accentLineGap: 0,
  },
};

const COLORS = {
  bg: '#0A0A0A',
  bgElevated: '#141414',
  textPrimary: '#E5E5E5',
  textSecondary: '#737373',
  accent: '#D13A3A',
  paper: '#FAF9F6',
  border: 'rgba(229,229,229,0.06)',
};

const FONT_DISPLAY = 'Syne';
const FONT_BODY = 'Plus Jakarta Sans';
const FONT_MONO = 'JetBrains Mono';

const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function truncateTitle(title: string, maxChars: number): string {
  if (title.length <= maxChars) return title;
  const truncated = title.substring(0, maxChars - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxChars * 0.6) {
    return truncated.substring(0, lastSpace) + '...';
  }
  return truncated + '...';
}

function formatIssueMark(dateString: string | null | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).substring(2);
  return `${day}.${month}.${year}`;
}

function formatLongDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return `${date.getDate()} ${MONTHS_ID[date.getMonth()]} ${date.getFullYear()}`;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function BrandMark({ height }: { height: number }): ReactElement {
  return (
    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
      <div style={{ width: '3px', height: `${height}px`, backgroundColor: COLORS.accent }} />
      <div style={{ width: '3px', height: `${height}px`, backgroundColor: COLORS.accent }} />
    </div>
  );
}

function Divider({ width, height = 2 }: { width: number; height?: number }): ReactElement {
  return (
    <div style={{
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: COLORS.accent,
      flexShrink: 0,
    }} />
  );
}

function Badge({ text, color, fontSize, paddingX, paddingY }: {
  text: string; color: string; fontSize: number; paddingX: number; paddingY: number;
}): ReactElement {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1px solid ${color}`,
      color: color,
      fontFamily: FONT_DISPLAY,
      fontSize: `${fontSize}px`,
      fontWeight: 700,
      letterSpacing: '0.1em',
      paddingTop: `${paddingY}px`,
      paddingBottom: `${paddingY}px`,
      paddingLeft: `${paddingX}px`,
      paddingRight: `${paddingX}px`,
      flexShrink: 0,
    }}>
      {text}
    </div>
  );
}

function SeriesProgress({ current, total, fontSize }: {
  current: number; total: number; fontSize: number;
}): ReactElement {
  const percentage = Math.round((current / total) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
      <span style={{
        fontFamily: FONT_DISPLAY,
        fontSize: `${fontSize}px`,
        fontWeight: 700,
        color: COLORS.accent,
        letterSpacing: '0.15em',
      }}>
        {String(current).padStart(2, '0')}/{String(total).padStart(2, '0')}
      </span>
      <div style={{
        width: '60px',
        height: '4px',
        backgroundColor: COLORS.bgElevated,
        borderRadius: '2px',
        overflow: 'hidden',
        display: 'flex',
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: COLORS.accent,
        }} />
      </div>
    </div>
  );
}

function Avatar({ name, size }: { name: string; size: number }): ReactElement {
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      backgroundColor: COLORS.bgElevated,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{
        fontFamily: FONT_DISPLAY,
        fontSize: `${Math.round(size * 0.44)}px`,
        fontWeight: 700,
        color: COLORS.textPrimary,
      }}>
        {getInitials(name)}
      </span>
    </div>
  );
}

function getPlatformColor(platform?: string): string {
  switch (platform?.toLowerCase()) {
    case 'x': case 'twitter': return '#E5E5E5';
    case 'instagram': case 'ig': return '#E1306C';
    case 'tiktok': return '#25F4EE';
    case 'youtube': case 'yt': return '#FF0000';
    default: return COLORS.textSecondary;
  }
}

function getPlatformIcon(platform: string | undefined, size: number): ReactElement | null {
  if (!platform) return null;
  const p = platform.toLowerCase();
  const iconStyle: CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (p === 'x' || p === 'twitter') {
    return (
      <div style={iconStyle}>
        <div style={{
          width: `${size * 0.6}px`,
          height: `${size * 0.6}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <div style={{ width: '100%', height: '2px', backgroundColor: COLORS.textPrimary, transform: 'rotate(0deg)', marginBottom: '2px' }} />
          <div style={{ width: '100%', height: '2px', backgroundColor: COLORS.textPrimary, transform: 'rotate(0deg)' }} />
        </div>
      </div>
    );
  }
  if (p === 'instagram' || p === 'ig') {
    return (
      <div style={{
        ...iconStyle,
        border: `2px solid ${COLORS.textPrimary}`,
        borderRadius: `${size * 0.25}px`,
      }}>
        <div style={{
          width: `${size * 0.3}px`,
          height: `${size * 0.3}px`,
          borderRadius: '50%',
          border: `2px solid ${COLORS.textPrimary}`,
        }} />
      </div>
    );
  }
  if (p === 'tiktok') {
    return (
      <div style={iconStyle}>
        <div style={{
          width: `${size * 0.5}px`,
          height: `${size * 0.5}px`,
          backgroundColor: COLORS.textPrimary,
          borderRadius: '50%',
        }} />
      </div>
    );
  }
  if (p === 'youtube' || p === 'yt') {
    return (
      <div style={{
        ...iconStyle,
        backgroundColor: '#FF0000',
        borderRadius: `${size * 0.2}px`,
      }}>
        <div style={{
          width: 0,
          height: 0,
          borderTop: `${size * 0.15}px solid transparent`,
          borderBottom: `${size * 0.15}px solid transparent`,
          borderLeft: `${size * 0.2}px solid ${COLORS.textPrimary}`,
        }} />
      </div>
    );
  }
  return null;
}

export function OgTemplate(props: TemplateProps): ReactElement {
  const cfg = CONFIGS[props.size];
  const hasCover = !!props.coverImageUrl;
  const isSosial = props.size === 'sosial';
  const isNewsletter = props.size === 'newsletter';
  const isCard = props.size === 'card';

  const issueMark = formatIssueMark(props.publishedAt);
  const longDate = formatLongDate(props.publishedAt);
  const displayTitle = truncateTitle(props.title, cfg.titleMaxChars);
  const categoryColor = props.categoryColor || COLORS.textSecondary;
  const barColor = isSosial ? getPlatformColor(props.platform) : categoryColor;

  const rootStyle: CSSProperties = {
    width: `${cfg.width}px`,
    height: `${cfg.height}px`,
    backgroundColor: COLORS.bg,
    backgroundImage: `
      radial-gradient(circle at 10% 20%, ${categoryColor}24 0%, transparent 60%),
      radial-gradient(circle at 90% 80%, ${categoryColor}0d 0%, transparent 50%),
      linear-gradient(135deg, #070707 0%, #0d0d0d 100%)
    `,
    display: 'flex',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
  };

  const dotPattern: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'radial-gradient(circle, rgba(229,229,229,0.02) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
  };

  const categoryBarStyle: CSSProperties = cfg.barPosition === 'right'
    ? {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: `${cfg.barWidth}px`,
        backgroundColor: barColor,
      }
    : {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: `${cfg.barWidth}px`,
        backgroundColor: barColor,
      };

  const contentStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: `${cfg.paddingY}px`,
    paddingBottom: `${cfg.paddingY}px`,
    paddingLeft: `${cfg.paddingX}px`,
    paddingRight: `${cfg.paddingX + (cfg.barPosition === 'right' ? cfg.barWidth : 0)}px`,
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 1,
  };

  const headerRowStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: `${cfg.headerHeight}px`,
    flexShrink: 0,
  };

  const headerLeftStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '12px',
    flexShrink: 0,
  };

  const headerRightStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '16px',
    flexShrink: 0,
  };

  const titleStyle: CSSProperties = {
    fontFamily: FONT_DISPLAY,
    fontSize: `${cfg.titleFont}px`,
    fontWeight: 700,
    color: COLORS.textPrimary,
    letterSpacing: '-0.03em',
    lineHeight: cfg.titleLineHeight,
    display: 'flex',
    flexDirection: 'column',
  };

  const excerptStyle: CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: `${cfg.excerptFont}px`,
    fontWeight: 400,
    color: COLORS.textSecondary,
    lineHeight: 1.5,
    display: 'flex',
    flexDirection: 'column',
  };

  const metadataStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  };

  const metadataTextStyle: CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: `${cfg.metadataFont}px`,
    fontWeight: 400,
    color: COLORS.textSecondary,
    display: 'flex',
    alignItems: 'center',
    lineHeight: 1,
  };

  const separatorStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2px',
    height: `${cfg.metadataFont * 1.2}px`,
    backgroundColor: COLORS.textSecondary,
    flexShrink: 0,
    opacity: 0.5,
    marginLeft: '8px',
    marginRight: '4px',
  };

  const footerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  };

  const footerRowStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
  };

  const footerBrandStyle: CSSProperties = {
    fontFamily: FONT_DISPLAY,
    fontSize: `${cfg.brandFont}px`,
    fontWeight: 700,
    color: COLORS.textPrimary,
    letterSpacing: '-0.02em',
  };

  const footerTaglineStyle: CSSProperties = {
    fontFamily: FONT_BODY,
    fontSize: `${cfg.taglineFont}px`,
    fontWeight: 400,
    color: COLORS.textSecondary,
    marginTop: '4px',
  };

  const issueMarkStyle: CSSProperties = {
    fontFamily: FONT_MONO,
    fontSize: `${cfg.issueFont}px`,
    fontWeight: 400,
    color: COLORS.textSecondary,
    flexShrink: 0,
  };

  const categoryTextStyle: CSSProperties = {
    fontFamily: FONT_DISPLAY,
    fontSize: `${cfg.categoryFont}px`,
    fontWeight: 700,
    color: COLORS.textSecondary,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    flexShrink: 0,
  };

  if (isNewsletter) {
    return (
      <div style={rootStyle}>
        <div style={dotPattern} />
        <div style={contentStyle}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <BrandMark height={cfg.brandMarkHeight} />
            <span style={footerBrandStyle}>TAMPARAN ANAK MUDA</span>
          </div>
          <div style={{ height: '12px', flexShrink: 0 }} />
          <span style={{
            fontFamily: FONT_BODY,
            fontSize: `${cfg.taglineFont}px`,
            color: COLORS.textSecondary,
          }}>
            Menyadarkan Generasi Muda akan Kenyataan
          </span>
          <div style={{ flex: 1 }} />
          <Divider width={cfg.divider1Width} />
          <div style={{ height: '12px', flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
            {props.editionNumber !== undefined && (
              <span style={{
                fontFamily: FONT_MONO,
                fontSize: `${cfg.issueFont}px`,
                color: COLORS.textSecondary,
              }}>
                Edition #{String(props.editionNumber).padStart(3, '0')}
              </span>
            )}
            {issueMark && (
              <>
                <span style={{ ...metadataTextStyle, fontSize: `${cfg.issueFont}px` }}>|</span>
                <span style={issueMarkStyle}>{issueMark}</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const coverPhotoOverlay = hasCover ? (
    isCard
      ? { backgroundColor: 'rgba(10,10,10,0.85)' }
      : props.size === 'feature'
        ? { backgroundColor: 'rgba(10,10,10,0.78)' }
        : null
  ) : null;

  const hookHeadline = props.ogHeadline || displayTitle;
  const panelBg = hasCover ? 'rgba(10,10,10,0.5)' : 'rgba(255,255,255,0.015)';

  const panelStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: `${cfg.panelPaddingX}px`,
    paddingRight: `${cfg.panelPaddingX}px`,
    paddingTop: `${cfg.panelPaddingY}px`,
    paddingBottom: `${cfg.panelPaddingY}px`,
    border: `1px solid rgba(255,255,255,0.08)`,
    borderRadius: `${cfg.panelRadius}px`,
    backgroundColor: panelBg,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
    flex: 1,
  };

  const contentWithAccentStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  };

  return (
    <div style={rootStyle}>
      {hasCover && (
        <>
          {props.size === 'og' ? (
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '40%',
              display: 'flex',
            }}>
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
                bottom: 0,
                width: '100%',
                backgroundImage: `linear-gradient(to right, ${COLORS.bg} 0%, ${COLORS.bg} 30%, rgba(10,10,10,0.6) 70%, transparent 100%)`,
              }} />
            </div>
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={props.coverImageUrl!}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
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
                ...coverPhotoOverlay,
              }} />
            </>
          )}
        </>
      )}

      {cfg.showCategorySignature && !hasCover && getCategorySignature(
        props.categorySlug,
        categoryColor,
        { size: cfg.signatureSize, opacity: 0.10 }
      )}

      <div style={contentStyle}>
        {/* Header row */}
        <div style={headerRowStyle}>
          <div style={headerLeftStyle}>
            <BrandMark height={cfg.brandMarkHeight} />
            <span style={{
              ...footerBrandStyle,
              fontSize: `${cfg.brandFont}px`,
              letterSpacing: '0.05em',
            }}>
              TAMPARAN ANAK MUDA
            </span>
          </div>
          <div style={headerRightStyle}>
            {issueMark && <span style={issueMarkStyle}>{issueMark}</span>}
            {props.isPremium && cfg.badgeFont > 0 && (
              <Badge text="PREMIUM" color={COLORS.accent} fontSize={cfg.badgeFont} paddingX={cfg.badgePaddingX} paddingY={cfg.badgePaddingY} />
            )}
            {props.isSponsored && cfg.badgeFont > 0 && (
              <Badge text="SPONSORED" color={COLORS.textSecondary} fontSize={cfg.badgeFont} paddingX={cfg.badgePaddingX} paddingY={cfg.badgePaddingY} />
            )}
          </div>
        </div>

        {/* Spacious margin gap after header */}
        <div style={{ height: '32px', flexShrink: 0 }} />

        {/* Content area with panel */}
        <div style={{
          ...panelStyle,
          position: 'relative',
          paddingLeft: `${cfg.panelPaddingX + cfg.accentLineWidth + 24}px`, // Add space for the inset bar
          overflow: 'hidden',
        }}>
          {/* Inset Accent Column - Positioned absolutely to avoid collision with text flow */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${cfg.accentLineWidth}px`,
            backgroundColor: categoryColor,
          }} />

          {/* Category eyebrow */}
          <span style={{
            fontFamily: FONT_DISPLAY,
            fontSize: `${cfg.categoryFont}px`,
            fontWeight: 700,
            color: categoryColor,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '16px',
            display: 'flex',
          }}>
            {(props.category || 'ARTIKEL')}
          </span>

          {/* Hook headline wrapper to ensure clean separation from excerpt */}
          <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            {isSosial && props.handle ? (
              <>
                <span style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: '24px',
                  fontWeight: 700,
                  color: COLORS.textPrimary,
                  marginBottom: '12px',
                }}>
                  {props.handle}
                </span>
                <span style={{ ...titleStyle, maxWidth: `${cfg.titleMaxWidth}px`, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{hookHeadline}</span>
              </>
            ) : (
              <span style={{ ...titleStyle, maxWidth: `${cfg.titleMaxWidth}px`, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{hookHeadline}</span>
            )}
          </div>

          {/* Excerpt with dedicated top margin for clean spacing */}
          {cfg.showExcerpt && props.excerpt && (
            <span style={{
              ...excerptStyle,
              marginTop: '40px',
              marginBottom: '80px',
              maxWidth: `${cfg.excerptMaxWidth}px`,
              display: 'flex',
            }}>
              {truncateTitle(props.excerpt, 150)}
            </span>
          )}

          {/* Spacer within panel */}
          <div style={{ flex: 1 }} />

          {/* Metadata (Author, reading time, date) */}
          {cfg.showMetadata && (
            <div style={{ ...metadataStyle, display: 'flex', marginTop: '24px', paddingBottom: '20px' }}>
              {cfg.showAuthor && props.authorName && (
                <>
                  <span style={{ ...metadataTextStyle, textTransform: 'uppercase' }}>{props.authorName}</span>
                  <div style={separatorStyle}>{' '}</div>
                </>
              )}
              {props.readingTime !== undefined && (
                <>
                  <span style={metadataTextStyle}>{props.readingTime} MENIT BACA</span>
                  {longDate && <div style={separatorStyle}>{' '}</div>}
                </>
              )}
              {longDate && <span style={{ ...metadataTextStyle, textTransform: 'uppercase' }}>{longDate}</span>}
              {props.seriesCurrent !== undefined && props.seriesTotal !== undefined && (
                <>
                  {(props.readingTime !== undefined || props.authorName) && <div style={separatorStyle}>{' '}</div>}
                  <SeriesProgress current={props.seriesCurrent} total={props.seriesTotal} fontSize={12} />
                </>
              )}
            </div>
          )}
        </div>

        {/* Spacious gap before footer */}
        <div style={{ height: '32px', flexShrink: 0 }} />

        {/* Footer */}
        <div style={footerStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{
              ...footerBrandStyle,
              fontSize: '14px',
              color: COLORS.textSecondary,
              letterSpacing: '0.05em',
            }}>
              TAMPARANANAKMUDA.COM
            </span>
            {cfg.showTagline && (
              <span style={footerTaglineStyle}>
                Menyadarkan Generasi Muda akan Kenyataan
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
