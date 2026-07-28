'use client';

import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TAM_CHART_COLORS, TAM_CHART_FONTS, type BaseChartProps } from './tam-theme';

interface RadarSeries {
  key: string;
  name: string;
  color?: string;
}

interface RadarDatum {
  metric: string;
  [key: string]: string | number;
}

interface TAMRadarChartProps extends BaseChartProps {
  data: RadarDatum[];
  series: RadarSeries[];
}

const DEFAULT_COLORS = [TAM_CHART_COLORS.primary, TAM_CHART_COLORS.secondary];

function CustomTooltip({ active, payload, label }: any) {
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
      <p style={{ fontSize: TAM_CHART_FONTS.size, color: TAM_CHART_COLORS.text, margin: 0, fontWeight: 600, marginBottom: 4 }}>
        {label}
      </p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ fontSize: TAM_CHART_FONTS.size, color: p.color || p.stroke, margin: '2px 0' }}>
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  );
}

export function TAMRadarChart({ data, series, title, subtitle, source, height = 340 }: TAMRadarChartProps) {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-6 shadow-2xl">
      {(title || subtitle) && (
        <div className="mb-5">
          {title && <h4 className="font-display text-base font-bold text-white">{title}</h4>}
          {subtitle && <p className="mt-1 text-xs text-white/40">{subtitle}</p>}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke={TAM_CHART_COLORS.grid} />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: TAM_CHART_COLORS.text, fontSize: TAM_CHART_FONTS.sizeSmall, fontFamily: TAM_CHART_FONTS.family }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: TAM_CHART_COLORS.textDim, fontSize: 9, fontFamily: TAM_CHART_FONTS.family }}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontFamily: TAM_CHART_FONTS.family, fontSize: TAM_CHART_FONTS.size, color: TAM_CHART_COLORS.text, paddingTop: 12 }}
          />
          {series.map((s, i) => (
            <Radar
              key={s.key}
              name={s.name}
              dataKey={s.key}
              stroke={s.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
              fill={s.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
              fillOpacity={0.15}
              strokeWidth={2}
              dot={{ r: 4, fill: s.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length] }}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
      {source && <p className="mt-3 text-[10px] text-white/30">Sumber: {source}</p>}
    </div>
  );
}
