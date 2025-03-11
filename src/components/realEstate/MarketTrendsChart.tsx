
import React, { useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Button } from "@/components/ui/button";

const MarketTrendsChart = () => {
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y' | 'all'>('6m');
  
  // Sample data for market trends
  const data = {
    '1m': [
      { name: 'W1', listings: 42, sales: 12, avgPrice: 430 },
      { name: 'W2', listings: 45, sales: 15, avgPrice: 435 },
      { name: 'W3', listings: 48, sales: 14, avgPrice: 438 },
      { name: 'W4', listings: 47, sales: 16, avgPrice: 442 },
    ],
    '3m': [
      { name: 'Jan', listings: 40, sales: 10, avgPrice: 420 },
      { name: 'Feb', listings: 42, sales: 12, avgPrice: 425 },
      { name: 'Mar', listings: 47, sales: 16, avgPrice: 442 },
    ],
    '6m': [
      { name: 'Jan', listings: 38, sales: 8, avgPrice: 410 },
      { name: 'Feb', listings: 40, sales: 10, avgPrice: 420 },
      { name: 'Mar', listings: 42, sales: 12, avgPrice: 425 },
      { name: 'Apr', listings: 45, sales: 15, avgPrice: 435 },
      { name: 'May', listings: 48, sales: 14, avgPrice: 438 },
      { name: 'Jun', listings: 47, sales: 16, avgPrice: 442 },
    ],
    '1y': [
      { name: 'Jan', listings: 32, sales: 5, avgPrice: 390 },
      { name: 'Feb', listings: 35, sales: 7, avgPrice: 395 },
      { name: 'Mar', listings: 36, sales: 8, avgPrice: 400 },
      { name: 'Apr', listings: 38, sales: 8, avgPrice: 410 },
      { name: 'May', listings: 40, sales: 10, avgPrice: 420 },
      { name: 'Jun', listings: 42, sales: 12, avgPrice: 425 },
      { name: 'Jul', listings: 45, sales: 15, avgPrice: 435 },
      { name: 'Aug', listings: 48, sales: 14, avgPrice: 438 },
      { name: 'Sep', listings: 47, sales: 16, avgPrice: 442 },
      { name: 'Oct', listings: 48, sales: 18, avgPrice: 445 },
      { name: 'Nov', listings: 47, sales: 17, avgPrice: 450 },
      { name: 'Dec', listings: 48, sales: 15, avgPrice: 455 },
    ],
    'all': [
      { name: '2020', listings: 25, sales: 5, avgPrice: 360 },
      { name: '2021', listings: 30, sales: 12, avgPrice: 380 },
      { name: '2022', listings: 40, sales: 20, avgPrice: 420 },
      { name: '2023', listings: 48, sales: 15, avgPrice: 455 },
    ],
  };

  const formatYAxis = (value: number) => {
    return `$${value}k`;
  };

  return (
    <div className="h-[350px]">
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing data for the past {
            timeRange === '1m' ? 'month' :
            timeRange === '3m' ? '3 months' :
            timeRange === '6m' ? '6 months' :
            timeRange === '1y' ? 'year' : 'all time'
          }
        </div>
        <div className="flex space-x-1">
          <Button 
            variant={timeRange === '1m' ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeRange('1m')}
          >
            1M
          </Button>
          <Button 
            variant={timeRange === '3m' ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeRange('3m')}
          >
            3M
          </Button>
          <Button 
            variant={timeRange === '6m' ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeRange('6m')}
          >
            6M
          </Button>
          <Button 
            variant={timeRange === '1y' ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeRange('1y')}
          >
            1Y
          </Button>
          <Button 
            variant={timeRange === 'all' ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeRange('all')}
          >
            ALL
          </Button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data[timeRange]}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            tickFormatter={formatYAxis} 
          />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'avgPrice') {
                return [`$${value}k`, 'Avg. Price'];
              }
              return [value, name === 'listings' ? 'Listings' : 'Sales'];
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="listings"
            stroke="#4f46e5"
            activeDot={{ r: 8 }}
            name="Listings"
            strokeWidth={2}
          />
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="sales" 
            stroke="#06b6d4" 
            name="Sales"
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgPrice"
            stroke="#10b981"
            name="Avg. Price"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketTrendsChart;
