'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { TAM_CHART_COLORS, TAM_CHART_FONTS, type BaseChartProps } from './tam-theme';

interface GroupedBarDatum {
  label: string;
  [key: string]: string | number;
}

interface TAMGroupedBarChartProps extends BaseChartProps {
  data: GroupedBarDatum[];
  series: { key: string; name: string; color?: string }[];
  yLabel?: string;
  xLabel?: string;
  unit?: string;
}

function CustomTooltip({ active, payload, label, series }: any) {
  if (!active || !payload?.length) return null;
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
        {label}
      </p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ fontSize: TAM_CHART_FONTS.sizeTitle, color: p.fill, margin: '4px 0 0', fontWeight: 700 }}>
          {p.name}: {p.value}{series?.unit || ''}
        </p>
      ))}
    </div>
  );
}

export function TAMGroupedBarChart({ data, series, title, subtitle, source, height = 320, yLabel, xLabel, unit = '' }: TAMGroupedBarChartProps) {
  const colors = [TAM_CHART_COLORS.primary, TAM_CHART_COLORS.secondary, TAM_CHART_COLORS.tertiary, TAM_CHART_COLORS.quaternary, TAM_CHART_COLORS.quinary];
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-6 shadow-2xl">
      {(title || subtitle) && (
        <div className="mb-5">
          {title && <h4 className="font-display text-base font-bold text-white">{title}</h4>}
          {subtitle && <p className="mt-1 text-xs text-white/40">{subtitle}</p>}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
          <CartesianGrid stroke={TAM_CHART_COLORS.grid} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fill: TAM_CHART_COLORS.text, fontSize: TAM_CHART_FONTS.size, fontFamily: TAM_CHART_FONTS.family }}
            axisLine={{ stroke: TAM_CHART_COLORS.axis }}
            tickLine={false}
            label={xLabel ? { value: xLabel, position: 'insideBottom', offset: -2, fill: TAM_CHART_COLORS.textDim, fontSize: TAM_CHART_FONTS.sizeSmall } : undefined}
          />
          <YAxis
            tick={{ fill: TAM_CHART_COLORS.text, fontSize: TAM_CHART_FONTS.sizeSmall, fontFamily: TAM_CHART_FONTS.family }}
            axisLine={{ stroke: TAM_CHART_COLORS.axis }}
            tickLine={false}
            label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fill: TAM_CHART_COLORS.textDim, fontSize: TAM_CHART_FONTS.sizeSmall } : undefined}
          />
          <Tooltip content={<CustomTooltip series={{ unit }} />} cursor={{ fill: '#ffffff05' }} />
          <Legend
            wrapperStyle={{ fontFamily: TAM_CHART_FONTS.family, fontSize: TAM_CHART_FONTS.size, color: TAM_CHART_COLORS.text }}
          />
          {series.map((s, i) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.name}
              fill={s.color || colors[i % colors.length]}
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      {source && <p className="mt-3 text-[10px] text-white/30">Sumber: {source}</p>}
    </div>
  );
}
