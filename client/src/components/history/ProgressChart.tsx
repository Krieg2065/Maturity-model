import React from 'react';
import { type Assessment } from '@shared/schema';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface ProgressChartProps {
  assessments: Assessment[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ assessments }) => {
  // Sort assessments by date (oldest first)
  const sortedAssessments = [...assessments].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Find the most common categories across all assessments
  const categoryCountMap = new Map<string, number>();
  
  sortedAssessments.forEach(assessment => {
    Object.keys(assessment.categoryScores).forEach(category => {
      categoryCountMap.set(category, (categoryCountMap.get(category) || 0) + 1);
    });
  });
  
  // Get the top 2 most common categories (besides overall)
  const topCategories = Array.from(categoryCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category)
    .slice(0, 2);
  
  // Prepare data for chart
  const chartData = sortedAssessments.map(assessment => {
    const dataPoint: any = {
      date: format(new Date(assessment.date), 'MMM yyyy'),
      "Overall Score": assessment.overallScore,
    };
    
    // Add top categories
    topCategories.forEach(category => {
      if (assessment.categoryScores[category]) {
        dataPoint[category] = assessment.categoryScores[category];
      }
    });
    
    return dataPoint;
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="Overall Score" 
          stroke="#3498DB" 
          activeDot={{ r: 8 }} 
          strokeWidth={2}
        />
        {topCategories.map((category, index) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={index === 0 ? '#E74C3C' : '#27AE60'}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProgressChart;
