'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Legend } from 'recharts';
import { TAM_CHART_COLORS, TAM_CHART_FONTS, type BaseChartProps } from './tam-theme';

interface ScatterDatum {
  x: number;
  y: number;
  z?: number;
  name?: string;
}

interface TAMScatterChartProps extends BaseChartProps {
  data: ScatterDatum[];
  xLabel?: string;
  yLabel?: string;
  unit?: string;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as ScatterDatum;
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
      {d.name && <p style={{ fontSize: TAM_CHART_FONTS.size, color: TAM_CHART_COLORS.text, margin: 0, fontWeight: 600 }}>{d.name}</p>}
      <p style={{ fontSize: TAM_CHART_FONTS.sizeTitle, color: TAM_CHART_COLORS.primary, margin: '4px 0 0', fontWeight: 700 }}>
        X: {d.x} | Y: {d.y}
      </p>
    </div>
  );
}

export function TAMScatterChart({ data, title, subtitle, source, height = 320, xLabel, yLabel }: TAMScatterChartProps) {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-6 shadow-2xl">
      {(title || subtitle) && (
        <div className="mb-5">
          {title && <h4 className="font-display text-base font-bold text-white">{title}</h4>}
          {subtitle && <p className="mt-1 text-xs text-white/40">{subtitle}</p>}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
          <CartesianGrid stroke={TAM_CHART_COLORS.grid} strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            tick={{ fill: TAM_CHART_COLORS.text, fontSize: TAM_CHART_FONTS.sizeSmall, fontFamily: TAM_CHART_FONTS.family }}
            axisLine={{ stroke: TAM_CHART_COLORS.axis }}
            tickLine={false}
            label={xLabel ? { value: xLabel, position: 'insideBottom', offset: -2, fill: TAM_CHART_COLORS.textDim, fontSize: TAM_CHART_FONTS.sizeSmall } : undefined}
          />
          <YAxis
            type="number"
            dataKey="y"
            tick={{ fill: TAM_CHART_COLORS.text, fontSize: TAM_CHART_FONTS.sizeSmall, fontFamily: TAM_CHART_FONTS.family }}
            axisLine={{ stroke: TAM_CHART_COLORS.axis }}
            tickLine={false}
            label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fill: TAM_CHART_COLORS.textDim, fontSize: TAM_CHART_FONTS.sizeSmall } : undefined}
          />
          <ZAxis type="number" dataKey="z" range={[60, 400]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#ffffff10' }} />
          <Scatter
            data={data}
            fill={TAM_CHART_COLORS.primary}
            fillOpacity={0.6}
          />
        </ScatterChart>
      </ResponsiveContainer>
      {source && <p className="mt-3 text-[10px] text-white/30">Sumber: {source}</p>}
    </div>
  );
}
