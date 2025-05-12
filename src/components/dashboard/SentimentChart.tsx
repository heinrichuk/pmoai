
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkstreamSentiment } from '@/types/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SentimentChartProps {
  sentimentData: WorkstreamSentiment[];
  workstreamId?: string;
}

const SentimentChart: React.FC<SentimentChartProps> = ({ sentimentData, workstreamId }) => {
  // Filter by workstream if provided
  const filteredData = workstreamId 
    ? sentimentData.filter(item => item.workstreamId === workstreamId) 
    : sentimentData;
  
  // Format data for the chart
  const chartData = filteredData.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    sentiment: item.score,
  }));
  
  // Color gradient based on sentiment
  const gradientOffset = () => {
    const dataMax = Math.max(...filteredData.map(item => item.score));
    const dataMin = Math.min(...filteredData.map(item => item.score));
    
    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;
    
    return dataMax / (dataMax - dataMin);
  };
  
  const offset = gradientOffset();
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>
          {workstreamId 
            ? "Workstream Sentiment Analysis" 
            : "Overall Project Sentiment Analysis"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis 
                domain={[-1, 1]} 
                ticks={[-1, -0.5, 0, 0.5, 1]}
                tickFormatter={(value) => {
                  if (value === -1) return 'Negative';
                  if (value === 0) return 'Neutral';
                  if (value === 1) return 'Positive';
                  return '';
                }}
              />
              <Tooltip 
                formatter={(value: number) => [
                  `${Number(value).toFixed(2)} (${
                    value < -0.3 ? 'Negative' : value > 0.3 ? 'Positive' : 'Neutral'
                  })`, 
                  'Sentiment'
                ]}
              />
              <defs>
                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={offset} stopColor="#10b981" stopOpacity={1} />
                  <stop offset={offset} stopColor="#ea384c" stopOpacity={1} />
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="sentiment" 
                stroke="#8884d8" 
                fill="url(#splitColor)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {filteredData.length > 0 && (
          <div className="mt-4 p-4 bg-ubs-gray-100 rounded-md">
            <h4 className="font-semibold mb-2">Latest Summary</h4>
            <p className="text-sm text-ubs-gray-600">
              {filteredData[filteredData.length - 1]?.summary || "No summary available"}
            </p>
            
            {filteredData[filteredData.length - 1]?.keywords && (
              <div className="mt-2">
                <h5 className="text-xs font-semibold text-ubs-gray-500">Key Topics:</h5>
                <div className="flex flex-wrap gap-1 mt-1">
                  {filteredData[filteredData.length - 1].keywords.map((keyword, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs bg-white px-2 py-1 rounded-md text-ubs-gray-600"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SentimentChart;
