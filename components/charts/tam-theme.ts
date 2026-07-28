export const TAM_CHART_COLORS = {
  primary: '#f4a825',
  primaryDim: '#f4a82580',
  secondary: '#ef4444',
  tertiary: '#3b82f6',
  quaternary: '#22c55e',
  quinary: '#a855f7',
  grid: '#ffffff0d',
  axis: '#ffffff40',
  text: '#ffffff80',
  textDim: '#ffffff45',
  background: 'transparent',
  tooltipBg: '#0A0A0A',
  tooltipBorder: '#ffffff15',
} as const;

export const TAM_CHART_FONTS = {
  family: 'var(--font-display), system-ui, sans-serif',
  size: 12,
  sizeSmall: 10,
  sizeTitle: 14,
} as const;

export const TAM_CHART_STYLES = {
  fontFamily: TAM_CHART_FONTS.family,
  fontSize: TAM_CHART_FONTS.size,
  colors: [TAM_CHART_COLORS.primary, TAM_CHART_COLORS.secondary, TAM_CHART_COLORS.tertiary, TAM_CHART_COLORS.quaternary, TAM_CHART_COLORS.quinary],
} as const;

export interface BaseChartProps {
  title?: string;
  subtitle?: string;
  source?: string;
  height?: number;
}
