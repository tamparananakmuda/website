'use client';

import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { TAM_CHART_COLORS, TAM_CHART_FONTS, type BaseChartProps } from './tam-theme';

interface TreemapDatum {
  name: string;
  value: number;
  color?: string;
  children?: TreemapDatum[];
  [key: string]: any;
}

interface TAMTreemapProps extends BaseChartProps {
  data: TreemapDatum[];
  unit?: string;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as TreemapDatum;
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
        {d.value}
      </p>
    </div>
  );
}

export function TAMTreemap({ data, title, subtitle, source, height = 320, unit = '' }: TAMTreemapProps) {
  const colors = [TAM_CHART_COLORS.primary, TAM_CHART_COLORS.secondary, TAM_CHART_COLORS.tertiary, TAM_CHART_COLORS.quaternary, TAM_CHART_COLORS.quinary];
  const treemapData = data.map((d, i) => ({
    ...d,
    fill: d.color || colors[i % colors.length],
  }));

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-6 shadow-2xl">
      {(title || subtitle) && (
        <div className="mb-5">
          {title && <h4 className="font-display text-base font-bold text-white">{title}</h4>}
          {subtitle && <p className="mt-1 text-xs text-white/40">{subtitle}</p>}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <Treemap
          data={treemapData}
          dataKey="value"
          nameKey="name"
          stroke="#0A0A0A"
          content={(props: any) => {
            const { x, y, width, height, name, fill } = props;
            if (width < 50 || height < 30) return <g key={`empty-${x}-${y}`} />;
            return (
              <g key={`${name}-${x}-${y}`}>
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={fill}
                  fillOpacity={0.85}
                  stroke="#0A0A0A"
                  strokeWidth={2}
                />
                <text
                  x={x + width / 2}
                  y={y + height / 2 - 8}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={TAM_CHART_FONTS.size}
                  fontFamily={TAM_CHART_FONTS.family}
                  fontWeight={600}
                >
                  {name}
                </text>
                <text
                  x={x + width / 2}
                  y={y + height / 2 + 10}
                  textAnchor="middle"
                  fill="#ffffffaa"
                  fontSize={TAM_CHART_FONTS.sizeSmall}
                  fontFamily={TAM_CHART_FONTS.family}
                >
                  {props.value}{unit}
                </text>
              </g>
            );
          }}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
      {source && <p className="mt-3 text-[10px] text-white/30">Sumber: {source}</p>}
    </div>
  );
}
