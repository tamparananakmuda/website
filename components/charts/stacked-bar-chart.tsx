'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { TAM_CHART_COLORS, TAM_CHART_FONTS, type BaseChartProps } from './tam-theme';

interface StackedBarDatum {
  label: string;
  [key: string]: string | number;
}

interface TAMStackedBarChartProps extends BaseChartProps {
  data: StackedBarDatum[];
  series: { key: string; name: string; color?: string }[];
  yLabel?: string;
  xLabel?: string;
  unit?: string;
}

const DEFAULT_COLORS = [TAM_CHART_COLORS.primary, TAM_CHART_COLORS.secondary, TAM_CHART_COLORS.tertiary, TAM_CHART_COLORS.quaternary];

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
      <p style={{ fontSize: TAM_CHART_FONTS.size, color: TAM_CHART_COLORS.text, margin: 0, fontWeight: 600, marginBottom: 6 }}>
        {label}
      </p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ fontSize: TAM_CHART_FONTS.size, color: p.fill, margin: '2px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.fill, display: 'inline-block' }} />
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  );
}

export function TAMStackedBarChart({ data, series, title, subtitle, source, height = 320, yLabel, xLabel, unit = '%' }: TAMStackedBarChartProps) {
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
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
          <Legend
            verticalAlign="top"
            iconType="circle"
            wrapperStyle={{ fontFamily: TAM_CHART_FONTS.family, fontSize: TAM_CHART_FONTS.size, color: TAM_CHART_COLORS.text, paddingBottom: 12 }}
          />
          {series.map((s, i) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.name}
              stackId="a"
              fill={s.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
              radius={i === series.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
              maxBarSize={80}
            >
              {i === series.length - 1 && (
                <LabelList
                  dataKey={s.key}
                  position="top"
                  formatter={(v: any) => `${v}${unit}`}
                  style={{ fill: TAM_CHART_COLORS.text, fontSize: TAM_CHART_FONTS.sizeSmall, fontFamily: TAM_CHART_FONTS.family, fontWeight: 600 }}
                />
              )}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
      {source && <p className="mt-3 text-[10px] text-white/30">Sumber: {source}</p>}
    </div>
  );
}
