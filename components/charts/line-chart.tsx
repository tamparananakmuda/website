'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { TAM_CHART_COLORS, TAM_CHART_FONTS, type BaseChartProps } from './tam-theme';

interface LineChartDatum {
  label: string;
  value: number;
  value2?: number;
}

interface TAMLineChartProps extends BaseChartProps {
  data: LineChartDatum[];
  yLabel?: string;
  xLabel?: string;
  series2Label?: string;
  series1Label?: string;
  unit?: string;
}

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
      <p style={{ fontSize: TAM_CHART_FONTS.size, color: TAM_CHART_COLORS.text, margin: 0, fontWeight: 600 }}>
        {label}
      </p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ fontSize: TAM_CHART_FONTS.sizeTitle, color: p.stroke, margin: '4px 0 0', fontWeight: 700 }}>
          {p.name}: {p.value}{p.payload?.unit || ''}
        </p>
      ))}
    </div>
  );
}

export function TAMLineChart({ data, title, subtitle, source, height = 320, yLabel, xLabel, series1Label, series2Label, unit = '' }: TAMLineChartProps) {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-6 shadow-2xl">
      {(title || subtitle) && (
        <div className="mb-5">
          {title && <h4 className="font-display text-base font-bold text-white">{title}</h4>}
          {subtitle && <p className="mt-1 text-xs text-white/40">{subtitle}</p>}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
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
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff10', strokeWidth: 1 }} />
          <Line
            type="monotone"
            dataKey="value"
            name={series1Label || 'Series 1'}
            stroke={TAM_CHART_COLORS.primary}
            strokeWidth={3}
            dot={{ fill: TAM_CHART_COLORS.primary, r: 5 }}
            activeDot={{ r: 7 }}
            label={{ position: 'top', fill: TAM_CHART_COLORS.text, fontSize: TAM_CHART_FONTS.sizeSmall, fontFamily: TAM_CHART_FONTS.family, formatter: (v: any) => `${v}${unit}` }}
          />
          {data.some(d => d.value2 !== undefined) && (
            <Line
              type="monotone"
              dataKey="value2"
              name={series2Label || 'Series 2'}
              stroke={TAM_CHART_COLORS.secondary}
              strokeWidth={3}
              dot={{ fill: TAM_CHART_COLORS.secondary, r: 5 }}
              activeDot={{ r: 7 }}
              label={{ position: 'top', fill: TAM_CHART_COLORS.text, fontSize: TAM_CHART_FONTS.sizeSmall, fontFamily: TAM_CHART_FONTS.family, formatter: (v: any) => `${v}${unit}` }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      {source && <p className="mt-3 text-[10px] text-white/30">Sumber: {source}</p>}
    </div>
  );
}
