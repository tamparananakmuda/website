'use client';

import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TAM_CHART_COLORS, TAM_CHART_FONTS, type BaseChartProps } from './tam-theme';

interface FunnelDatum {
  name: string;
  value: number;
  color?: string;
}

interface TAMFunnelChartProps extends BaseChartProps {
  data: FunnelDatum[];
  unit?: string;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as FunnelDatum;
  return (
    <div
      style={{
        background: TAM_CHART_COLORS.tooltipBg,
        border: `1px solid ${TAM_CHART_COLORS.tooltipBorder}`,
        borderRadius: 8,
        padding: '10px 14px',
        fontFamily: TAM_CHART_FONTS.family,
      }}
    >
      <p style={{ fontSize: TAM_CHART_FONTS.size, color: TAM_CHART_COLORS.text, margin: 0, fontWeight: 600 }}>
        {d.name}
      </p>
      <p style={{ fontSize: TAM_CHART_FONTS.sizeTitle, color: TAM_CHART_COLORS.primary, margin: '4px 0 0', fontWeight: 700 }}>
        {d.value}{d.color ? '' : ''}
      </p>
    </div>
  );
}

export function TAMFunnelChart({ data, title, subtitle, source, height = 320, unit = '' }: TAMFunnelChartProps) {
  const colors = [TAM_CHART_COLORS.primary, '#f4a825cc', '#f4a82599', '#f4a82566', '#f4a82533'];
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-6 shadow-2xl">
      {(title || subtitle) && (
        <div className="mb-5">
          {title && <h4 className="font-display text-base font-bold text-white">{title}</h4>}
          {subtitle && <p className="mt-1 text-xs text-white/40">{subtitle}</p>}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <FunnelChart margin={{ top: 16, right: 80, left: 80, bottom: 8 }}>
          <Tooltip content={<CustomTooltip />} />
          <Funnel
            dataKey="value"
            nameKey="name"
            isAnimationActive
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color || colors[i % colors.length]} />
            ))}
            <LabelList
              position="right"
              dataKey="name"
              fill={TAM_CHART_COLORS.text}
              stroke="none"
              fontSize={TAM_CHART_FONTS.size}
              fontFamily={TAM_CHART_FONTS.family}
            />
            <LabelList
              position="center"
              dataKey="value"
              fill="#fff"
              stroke="none"
              fontSize={TAM_CHART_FONTS.sizeTitle}
              fontWeight={700}
              fontFamily={TAM_CHART_FONTS.family}
              formatter={(v: any) => `${v}${unit}`}
            />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
      {source && <p className="mt-3 text-[10px] text-white/30">Sumber: {source}</p>}
    </div>
  );
}
