
import React from 'react';
import { cn } from '@/lib/utils';

type EnhancedDonutChartProps = {
  data: {
    name: string;
    value: number;
    color: string;
    gradientFrom?: string;
    gradientTo?: string;
  }[];
  title: string;
  subtitle?: string;
  size?: number;
  thickness?: number;
  className?: string;
  animation?: boolean;
  showLegend?: boolean;
  legendPosition?: 'bottom' | 'right';
  gradients?: boolean;
};

export const EnhancedDonutChart: React.FC<EnhancedDonutChartProps> = ({
  data,
  title,
  subtitle,
  size = 320,
  thickness = 60,
  className,
  animation = true,
  showLegend = true,
  legendPosition = 'right',
  gradients = true,
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2;
  const innerRadius = radius - thickness;
  const centerX = radius;
  const centerY = radius;
  const labelRadius = radius + 25; // Increased label distance from the chart
  
  let currentAngle = 0;
  
  const segments = data.map((item, index) => {
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    
    const gradientId = `gradient-${index}`;
    
    return {
      ...item,
      startAngle,
      endAngle,
      gradientId,
      percentage: ((item.value / total) * 100).toFixed(1)
    };
  });
  
  const polarToCartesian = (
    centerX: number, 
    centerY: number, 
    radius: number, 
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };
  
  const createArc = (
    x: number, 
    y: number, 
    radius: number, 
    startAngle: number, 
    endAngle: number
  ) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(" ");
  };

  const getLighterColor = (color: string, amount: number = 0.3) => {
    // Convert hex to RGB
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);

    // Make lighter
    r = Math.min(255, r + Math.round((255 - r) * amount));
    g = Math.min(255, g + Math.round((255 - g) * amount));
    b = Math.min(255, b + Math.round((255 - b) * amount));

    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  
  return (
    <div className={cn(
      "flex flex-col items-center justify-center",
      legendPosition === 'right' ? "md:flex-row md:items-start" : "",
      className
    )} style={{ width: legendPosition === 'right' ? 'auto' : size, height: 'auto' }}>
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            {gradients && segments.map((segment, index) => (
              <linearGradient
                key={`gradient-${index}`}
                id={segment.gradientId}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={segment.gradientFrom || segment.color} />
                <stop offset="100%" stopColor={segment.gradientTo || getLighterColor(segment.color, 0.4)} />
              </linearGradient>
            ))}
          </defs>

          {segments.length > 0 ? (
            segments.map((segment, index) => {
              const startOuter = polarToCartesian(centerX, centerY, radius, segment.startAngle);
              const endOuter = polarToCartesian(centerX, centerY, radius, segment.endAngle);
              const startInner = polarToCartesian(centerX, centerY, innerRadius, segment.startAngle);
              const endInner = polarToCartesian(centerX, centerY, innerRadius, segment.endAngle);
              
              const largeArcFlag = segment.endAngle - segment.startAngle <= 180 ? "0" : "1";
              
              const d = [
                `M ${startOuter.x} ${startOuter.y}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
                `L ${endInner.x} ${endInner.y}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}`,
                'Z'
              ].join(' ');
              
              // Calculate midpoint angle for label positioning
              const midAngle = segment.startAngle + (segment.endAngle - segment.startAngle) / 2;
              const labelPos = polarToCartesian(centerX, centerY, labelRadius, midAngle);
              
              return (
                <g key={index}>
                  <path
                    d={d}
                    fill={gradients ? `url(#${segment.gradientId})` : segment.color}
                    stroke="white"
                    strokeWidth={2}
                    style={animation ? {
                      transform: 'scale(1)',
                      opacity: 1,
                      transition: `opacity 0.8s ease-out, transform 0.8s ease-out ${index * 0.1}s`
                    } : undefined}
                    className="drop-shadow-lg hover:brightness-105 transition-all cursor-pointer"
                  />
                  
                  {segment.value / total > 0.05 && (
                    <g>
                      <line
                        x1={polarToCartesian(centerX, centerY, radius + 5, midAngle).x}
                        y1={polarToCartesian(centerX, centerY, radius + 5, midAngle).y}
                        x2={labelPos.x}
                        y2={labelPos.y}
                        stroke={segment.color}
                        strokeWidth={2}
                        className="opacity-75"
                      />
                      <circle
                        cx={labelPos.x}
                        cy={labelPos.y}
                        r={20}
                        fill="white"
                        className="drop-shadow-sm"
                      />
                      <text
                        x={labelPos.x}
                        y={labelPos.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={segment.color}
                        className="text-sm font-bold"
                        style={animation ? {
                          opacity: 1,
                          transition: `opacity 1s ease-out ${0.5 + index * 0.1}s`
                        } : undefined}
                      >
                        {segment.percentage}%
                      </text>
                    </g>
                  )}
                </g>
              );
            })
          ) : (
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="#f1f1f1"
              stroke="#e2e2e2"
              strokeWidth={1}
            />
          )}
          
          <circle
            cx={centerX}
            cy={centerY}
            r={innerRadius}
            fill="white"
            className="drop-shadow-sm"
          />
        </svg>
        
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{ margin: thickness }}
        >
          <span className="text-3xl font-bold">{title}</span>
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
          {data.length === 0 && <span className="text-xs text-gray-400 mt-1">No data available</span>}
        </div>
      </div>
      
      {data.length > 0 && showLegend && (
        <div className={cn(
          "mt-8 space-y-3",
          legendPosition === 'right' ? "ml-8" : ""
        )}>
          {segments.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ 
                  background: item.gradientFrom && item.gradientTo 
                    ? `linear-gradient(135deg, ${item.gradientFrom}, ${item.gradientTo})` 
                    : item.color,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              />
              <span className="font-medium">{item.name}</span>
              <span className="text-sm text-gray-500">
                ({item.value} jobs - {item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedDonutChart;
