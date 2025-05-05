
import React from 'react';

type DonutChartProps = {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  title: string;
  subtitle?: string;
  size?: number;
  thickness?: number;
};

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title,
  subtitle,
  size = 180,
  thickness = 30,
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2;
  const innerRadius = radius - thickness;
  const centerX = radius;
  const centerY = radius;
  
  let currentAngle = 0;
  
  const segments = data.map((item) => {
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    
    return {
      ...item,
      startAngle,
      endAngle,
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
  
  return (
    <div className="flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {segments.length > 0 ? (
            segments.map((segment, index) => {
              const innerArc = createArc(
                centerX,
                centerY,
                innerRadius,
                segment.startAngle,
                segment.endAngle
              );
              
              const outerArc = createArc(
                centerX,
                centerY,
                radius,
                segment.startAngle,
                segment.endAngle
              );
              
              const largeArcFlag = segment.endAngle - segment.startAngle <= 180 ? "0" : "1";
              
              const startOuter = polarToCartesian(centerX, centerY, radius, segment.startAngle);
              const endOuter = polarToCartesian(centerX, centerY, radius, segment.endAngle);
              const startInner = polarToCartesian(centerX, centerY, innerRadius, segment.startAngle);
              const endInner = polarToCartesian(centerX, centerY, innerRadius, segment.endAngle);
              
              const d = [
                `M ${startOuter.x} ${startOuter.y}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
                `L ${endInner.x} ${endInner.y}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}`,
                'Z'
              ].join(' ');
              
              return (
                <path
                  key={index}
                  d={d}
                  fill={segment.color}
                  stroke="white"
                  strokeWidth={1}
                />
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
      
      {data.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
              <span className="truncate text-xs">{item.name}: {item.value}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonutChart;
