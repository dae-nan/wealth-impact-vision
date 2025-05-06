
import { useEffect, useRef, useState } from 'react';
import { generateChartColors } from '@/utils/csvParser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PieChartProps {
  data: Record<string, number>;
  title: string;
  height?: number;
}

export const PieChart = ({ data, title, height = 300 }: PieChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    label: string;
    value: number;
    percent: string;
    visible: boolean;
  }>({
    x: 0,
    y: 0,
    label: '',
    value: 0,
    percent: '',
    visible: false,
  });

  useEffect(() => {
    if (!svgRef.current || Object.keys(data).length === 0) return;

    const svg = svgRef.current;
    const width = svg.clientWidth;
    const chartHeight = height;
    const radius = Math.min(width, chartHeight) / 2 * 0.8;
    
    // Clear existing content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Create the group element
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${width / 2}, ${chartHeight / 2})`);
    svg.appendChild(g);

    // Prepare data
    const entries = Object.entries(data);
    const total = entries.reduce((sum, [_, value]) => sum + value, 0);
    const colors = generateChartColors(entries.length);

    // Sort entries by value (descending)
    entries.sort((a, b) => b[1] - a[1]);

    // Calculate angles for pie slices
    let startAngle = 0;
    const formattedData = entries.map(([key, value], index) => {
      const percentage = value / total;
      const angle = percentage * 2 * Math.PI;
      const slice = {
        key,
        value,
        percentage,
        startAngle,
        endAngle: startAngle + angle,
        color: colors[index % colors.length],
      };
      startAngle += angle;
      return slice;
    });

    // Draw the pie slices
    formattedData.forEach((slice) => {
      const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      
      // SVG arc path
      const x1 = radius * Math.cos(slice.startAngle - Math.PI / 2);
      const y1 = radius * Math.sin(slice.startAngle - Math.PI / 2);
      const x2 = radius * Math.cos(slice.endAngle - Math.PI / 2);
      const y2 = radius * Math.sin(slice.endAngle - Math.PI / 2);
      
      // Determine if the arc is large or small
      const largeArcFlag = slice.endAngle - slice.startAngle > Math.PI ? 1 : 0;
      
      const pathData = [
        `M 0 0`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `Z`
      ].join(' ');
      
      arc.setAttribute('d', pathData);
      arc.setAttribute('fill', slice.color);
      arc.setAttribute('stroke', 'rgba(255, 255, 255, 0.1)');
      arc.setAttribute('stroke-width', '1');
      
      // Add event listeners for interactivity
      arc.addEventListener('mousemove', (e) => {
        const rect = svg.getBoundingClientRect();
        setTooltipData({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          label: slice.key,
          value: slice.value,
          percent: `${(slice.percentage * 100).toFixed(1)}%`,
          visible: true,
        });
      });
      
      arc.addEventListener('mouseleave', () => {
        setTooltipData(prev => ({ ...prev, visible: false }));
      });
      
      g.appendChild(arc);
    });

    // Add legend
    const legendGap = 20;
    const legendItemHeight = 20;
    const legendX = width / 2 + radius + 20;
    const legendY = chartHeight / 2 - (formattedData.length * legendItemHeight) / 2;

    const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    legend.setAttribute('transform', `translate(${legendX}, ${legendY})`);

    formattedData.forEach((slice, i) => {
      const legendItem = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      legendItem.setAttribute('transform', `translate(0, ${i * legendGap})`);

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', '10');
      rect.setAttribute('height', '10');
      rect.setAttribute('fill', slice.color);
      legendItem.appendChild(rect);

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', '15');
      text.setAttribute('y', '9');
      text.setAttribute('font-size', '10');
      text.setAttribute('fill', 'currentColor');
      text.textContent = `${slice.key} (${(slice.percentage * 100).toFixed(1)}%)`;
      legendItem.appendChild(text);

      legend.appendChild(legendItem);
    });

    svg.appendChild(legend);

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
                top: `${tooltipData.y + 10}px`,
                transform: 'translate(0, -50%)'
              }}
            >
              <div className="font-semibold">{tooltipData.label}</div>
              <div>Value: {tooltipData.value.toLocaleString()}</div>
              <div>{tooltipData.percent}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
