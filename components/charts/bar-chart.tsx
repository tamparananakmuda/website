'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { TAM_CHART_COLORS, TAM_CHART_FONTS, type BaseChartProps } from './tam-theme';

interface BarChartDatum {
  label: string;
  value: number;
  color?: string;
  unit?: string;
}

interface TAMBarChartProps extends BaseChartProps {
  data: BarChartDatum[];
  yLabel?: string;
  xLabel?: string;
  horizontal?: boolean;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as BarChartDatum;
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
      <p style={{ fontSize: TAM_CHART_FONTS.sizeTitle, color: TAM_CHART_COLORS.primary, margin: '4px 0 0', fontWeight: 700 }}>
        {d.value}{d.unit || ''}%
      </p>
    </div>
  );
}

export function TAMBarChart({ data, title, subtitle, source, height = 320, yLabel, xLabel, horizontal = false }: TAMBarChartProps) {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-6 shadow-2xl">
      {(title || subtitle) && (
        <div className="mb-5">
          {title && (
            <h4 className="font-display text-base font-bold text-white">{title}</h4>
          )}
          {subtitle && (
            <p className="mt-1 text-xs text-white/40">{subtitle}</p>
          )}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 16, right: 24, left: 8, bottom: 8 }}
        >
          <CartesianGrid
            stroke={TAM_CHART_COLORS.grid}
            strokeDasharray="3 3"
            vertical={!horizontal}
            horizontal={horizontal}
          />
          {horizontal ? (
            <>
              <XAxis
                type="number"
                tick={{ fill: TAM_CHART_COLORS.text, fontSize: TAM_CHART_FONTS.sizeSmall, fontFamily: TAM_CHART_FONTS.family }}
                axisLine={{ stroke: TAM_CHART_COLORS.axis }}
                tickLine={false}
                label={xLabel ? { value: xLabel, position: 'insideBottom', offset: -2, fill: TAM_CHART_COLORS.textDim, fontSize: TAM_CHART_FONTS.sizeSmall } : undefined}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fill: TAM_CHART_COLORS.text, fontSize: TAM_CHART_FONTS.size, fontFamily: TAM_CHART_FONTS.family }}
                axisLine={{ stroke: TAM_CHART_COLORS.axis }}
                tickLine={false}
                width={90}
              />
            </>
          ) : (
            <>
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
            </>
          )}
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={64}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color || TAM_CHART_COLORS.primary} />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              formatter={(v: any) => `${v}%`}
              style={{ fill: TAM_CHART_COLORS.text, fontSize: TAM_CHART_FONTS.sizeSmall, fontFamily: TAM_CHART_FONTS.family, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {source && (
        <p className="mt-3 text-[10px] text-white/30">Sumber: {source}</p>
      )}
    </div>
  );
}
