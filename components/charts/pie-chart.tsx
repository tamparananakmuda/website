'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TAM_CHART_COLORS, TAM_CHART_FONTS, type BaseChartProps } from './tam-theme';

interface PieDatum {
  name: string;
  value: number;
  color?: string;
}

interface TAMPieChartProps extends BaseChartProps {
  data: PieDatum[];
  unit?: string;
  donut?: boolean;
}

const DEFAULT_COLORS = [TAM_CHART_COLORS.primary, TAM_CHART_COLORS.secondary, TAM_CHART_COLORS.tertiary, TAM_CHART_COLORS.quaternary, TAM_CHART_COLORS.quinary];

function CustomTooltip({ active, payload, unit = '%' }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as PieDatum;
  const total = (payload[0].payload.__total || 0);
  const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : d.value;
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
        {d.value}{unit}
      </p>
    </div>
  );
}

export function TAMPieChart({ data, title, subtitle, source, height = 320, unit = '%', donut = true }: TAMPieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const dataWithTotal = data.map(d => ({ ...d, __total: total }));

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-6 shadow-2xl">
      {(title || subtitle) && (
        <div className="mb-5">
          {title && <h4 className="font-display text-base font-bold text-white">{title}</h4>}
          {subtitle && <p className="mt-1 text-xs text-white/40">{subtitle}</p>}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart data={dataWithTotal}>
          <Pie
            data={dataWithTotal}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={donut ? 60 : 0}
            outerRadius={110}
            paddingAngle={2}
            stroke="#0A0A0A"
            strokeWidth={2}
          >
            {dataWithTotal.map((entry, i) => (
              <Cell key={i} fill={entry.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontFamily: TAM_CHART_FONTS.family, fontSize: TAM_CHART_FONTS.size, color: TAM_CHART_COLORS.text, paddingTop: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
      {source && <p className="mt-3 text-[10px] text-white/30">Sumber: {source}</p>}
    </div>
  );
}
