
import { useEffect, useRef, useState } from 'react';
import { generateChartColors } from '@/utils/csvParser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BarChartProps {
  data: Record<string, number>;
  title: string;
  height?: number;
}

export const BarChart = ({ data, title, height = 300 }: BarChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    label: string;
    value: number;
    visible: boolean;
  }>({
    x: 0,
    y: 0,
    label: '',
    value: 0,
    visible: false,
  });

  useEffect(() => {
    if (!svgRef.current || Object.keys(data).length === 0) return;

    const svg = svgRef.current;
    const width = svg.clientWidth;
    const chartHeight = height;
    
    // Clear existing content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Margins
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = chartHeight - margin.top - margin.bottom;

    // Prepare data
    const entries = Object.entries(data);
    entries.sort((a, b) => b[1] - a[1]); // Sort by value in descending order
    
    const colors = generateChartColors(entries.length);

    // Create the group element with margin transformation
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${margin.left}, ${margin.top})`);
    svg.appendChild(g);

    // Find max value for scaling
    const maxValue = Math.max(...entries.map(([_, value]) => value));
    
    // Calculate bar width based on number of entries
    const barWidth = innerWidth / entries.length * 0.8;
    const barGap = innerWidth / entries.length * 0.2;

    // Create bars
    entries.forEach(([key, value], index) => {
      const barHeight = (value / maxValue) * innerHeight;
      const x = index * (barWidth + barGap) + barGap / 2;
      const y = innerHeight - barHeight;
      
      // Create bar
      const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bar.setAttribute('x', x.toString());
      bar.setAttribute('y', y.toString());
      bar.setAttribute('width', barWidth.toString());
      bar.setAttribute('height', barHeight.toString());
      bar.setAttribute('fill', colors[index % colors.length]);
      bar.setAttribute('rx', '3'); // Rounded corners
      
      // Add interactivity
      bar.addEventListener('mousemove', (e) => {
        const rect = svg.getBoundingClientRect();
        setTooltipData({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          label: key,
          value: value,
          visible: true,
        });
      });
      
      bar.addEventListener('mouseleave', () => {
        setTooltipData(prev => ({ ...prev, visible: false }));
      });
      
      g.appendChild(bar);
      
      // Add labels below bars
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', (x + barWidth / 2).toString());
      label.setAttribute('y', (innerHeight + 20).toString());
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '10');
      label.setAttribute('fill', 'currentColor');
      label.textContent = key;
      
      // Rotate labels if there are many
      if (entries.length > 6) {
        label.setAttribute('transform', `rotate(45, ${x + barWidth / 2}, ${innerHeight + 20})`);
        label.setAttribute('y', (innerHeight + 10).toString());
        label.setAttribute('x', (x + barWidth / 2 + 5).toString());
        label.setAttribute('text-anchor', 'start');
      }
      
      g.appendChild(label);
    });

    // Create y-axis
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Create y-axis line
    const yAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxisLine.setAttribute('x1', '0');
    yAxisLine.setAttribute('y1', '0');
    yAxisLine.setAttribute('x2', '0');
    yAxisLine.setAttribute('y2', innerHeight.toString());
    yAxisLine.setAttribute('stroke', 'currentColor');
    yAxisLine.setAttribute('stroke-width', '1');
    yAxis.appendChild(yAxisLine);
    
    // Create y-axis ticks and labels
    const numTicks = 5;
    for (let i = 0; i <= numTicks; i++) {
      const y = innerHeight - (i / numTicks) * innerHeight;
      const value = (i / numTicks) * maxValue;
      
      // Create tick
      const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tick.setAttribute('x1', '-5');
      tick.setAttribute('y1', y.toString());
      tick.setAttribute('x2', '0');
      tick.setAttribute('y2', y.toString());
      tick.setAttribute('stroke', 'currentColor');
      tick.setAttribute('stroke-width', '1');
      yAxis.appendChild(tick);
      
      // Create label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', '-10');
      label.setAttribute('y', y.toString());
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('dominant-baseline', 'middle');
      label.setAttribute('font-size', '10');
      label.setAttribute('fill', 'currentColor');
      
      // Format label based on value size
      let formattedValue;
      if (value >= 1_000_000_000) {
        formattedValue = `${(value / 1_000_000_000).toFixed(1)}B`;
      } else if (value >= 1_000_000) {
        formattedValue = `${(value / 1_000_000).toFixed(1)}M`;
      } else if (value >= 1_000) {
        formattedValue = `${(value / 1_000).toFixed(1)}K`;
      } else {
        formattedValue = value.toFixed(0);
      }
      
      label.textContent = formattedValue;
      yAxis.appendChild(label);
    }
    
    g.appendChild(yAxis);
    
    // Create x-axis line
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', '0');
    xAxis.setAttribute('y1', innerHeight.toString());
    xAxis.setAttribute('x2', innerWidth.toString());
    xAxis.setAttribute('y2', innerHeight.toString());
    xAxis.setAttribute('stroke', 'currentColor');
    xAxis.setAttribute('stroke-width', '1');
    g.appendChild(xAxis);

  }, [data, height]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="relative">
          <svg 
            ref={svgRef} 
            width="100%" 
            height={height} 
            className="overflow-visible"
          />
          {tooltipData.visible && (
            <div 
              className="absolute pointer-events-none bg-popover text-popover-foreground shadow-md p-2 rounded text-sm z-50"
              style={{ 
                left: `${tooltipData.x + 10}px`, 
                top: `${tooltipData.y - 30}px`
              }}
            >
              <div className="font-semibold">{tooltipData.label}</div>
              <div>Value: {tooltipData.value.toLocaleString()}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
