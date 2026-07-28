'use client';

import { TAMBarChart } from './bar-chart';
import { TAMLineChart } from './line-chart';
import { TAMPieChart } from './pie-chart';
import { TAMStackedBarChart } from './stacked-bar-chart';
import { TAMRadarChart } from './radar-chart';
import { TMAreaChart } from './area-chart';
import { TAMGroupedBarChart } from './grouped-bar-chart';
import { TAMScatterChart } from './scatter-chart';
import { TAMFunnelChart } from './funnel-chart';
import { TAMTreemap } from './treemap-chart';

interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'stacked-bar' | 'radar' | 'area' | 'grouped-bar' | 'scatter' | 'funnel' | 'treemap';
  title?: string;
  subtitle?: string;
  source?: string;
  height?: number;
  data: any[];
  yLabel?: string;
  xLabel?: string;
  horizontal?: boolean;
  series?: { key: string; name: string; color?: string }[];
  series1Label?: string;
  series2Label?: string;
  unit?: string;
  donut?: boolean;
}

export function WhitepaperChartRenderer({ config }: { config: ChartConfig }) {
  const common = {
    title: config.title,
    subtitle: config.subtitle,
    source: config.source,
    height: config.height,
  };

  switch (config.type) {
    case 'bar':
      return (
        <TAMBarChart
          {...common}
          data={config.data}
          yLabel={config.yLabel}
          xLabel={config.xLabel}
          horizontal={config.horizontal}
        />
      );
    case 'line':
      return (
        <TAMLineChart
          {...common}
          data={config.data}
          yLabel={config.yLabel}
          xLabel={config.xLabel}
          series1Label={config.series1Label}
          series2Label={config.series2Label}
          unit={config.unit}
        />
      );
    case 'pie':
      return (
        <TAMPieChart
          {...common}
          data={config.data}
          unit={config.unit}
          donut={config.donut}
        />
      );
    case 'stacked-bar':
      return (
        <TAMStackedBarChart
          {...common}
          data={config.data}
          series={config.series || []}
          yLabel={config.yLabel}
          xLabel={config.xLabel}
          unit={config.unit}
        />
      );
    case 'radar':
      return (
        <TAMRadarChart
          {...common}
          data={config.data}
          series={config.series || []}
        />
      );
    case 'area':
      return (
        <TMAreaChart
          {...common}
          data={config.data}
          yLabel={config.yLabel}
          xLabel={config.xLabel}
          series1Label={config.series1Label}
          series2Label={config.series2Label}
          unit={config.unit}
        />
      );
    case 'grouped-bar':
      return (
        <TAMGroupedBarChart
          {...common}
          data={config.data}
          series={config.series || []}
          yLabel={config.yLabel}
          xLabel={config.xLabel}
          unit={config.unit}
        />
      );
    case 'scatter':
      return (
        <TAMScatterChart
          {...common}
          data={config.data}
          xLabel={config.xLabel}
          yLabel={config.yLabel}
          unit={config.unit}
        />
      );
    case 'funnel':
      return (
        <TAMFunnelChart
          {...common}
          data={config.data}
          unit={config.unit}
        />
      );
    case 'treemap':
      return (
        <TAMTreemap
          {...common}
          data={config.data}
          unit={config.unit}
        />
      );
    default:
      return null;
  }
}
