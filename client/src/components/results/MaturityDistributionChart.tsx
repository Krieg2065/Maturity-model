import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface MaturityDistributionChartProps {
  categoryScores: Record<string, number>;
}

const MaturityDistributionChart: React.FC<MaturityDistributionChartProps> = ({ categoryScores }) => {
  // Define maturity levels for categorization
  const maturityLevels = [
    { name: "Initial (0-30)", range: [0, 30], color: "#E74C3C" },
    { name: "Developing (31-50)", range: [31, 50], color: "#F39C12" },
    { name: "Defined (51-70)", range: [51, 70], color: "#3498DB" },
    { name: "Advanced (71-85)", range: [71, 85], color: "#27AE60" },
    { name: "Optimized (86-100)", range: [86, 100], color: "#2C3E50" }
  ];

  // Count how many dimensions fall into each maturity level
  const levelCounts = maturityLevels.map(level => {
    const count = Object.values(categoryScores).filter(
      score => score >= level.range[0] && score <= level.range[1]
    ).length;
    
    return {
      name: level.name,
      value: count,
      color: level.color
    };
  });

  // Filter out levels with no dimensions
  const data = levelCounts.filter(item => item.value > 0);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, color } = payload[0].payload;
      
      return (
        <div className="bg-white p-3 shadow-md border rounded-lg">
          <p className="font-medium" style={{ color }}>
            {name}
          </p>
          <p className="text-sm">
            {value} dimension{value !== 1 ? 's' : ''}
            {' '}({Math.round((value / Object.keys(categoryScores).length) * 100)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate the maturity level distribution narrative
  const getMostFrequentLevel = () => {
    if (data.length === 0) return null;
    let maxCount = data[0];
    
    for (let i = 1; i < data.length; i++) {
      if (data[i].value > maxCount.value) {
        maxCount = data[i];
      }
    }
    
    return maxCount;
  };
  
  const mostFrequentLevel = getMostFrequentLevel();
  const totalDimensions = Object.keys(categoryScores).length;
  
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        This chart shows how your dimensions are distributed across maturity levels,
        giving you a quick overview of your overall organizational maturity profile.
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              label={({ name, value, percent }) => 
                `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
              }
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {mostFrequentLevel && (
        <div className="bg-gray-50 p-3 rounded-md border mt-4">
          <h4 className="font-semibold mb-1">Distribution Analysis</h4>
          <p className="text-sm">
            <span className="font-medium" style={{ color: mostFrequentLevel.color }}>
              {mostFrequentLevel.name}
            </span> is your most common maturity level, with{' '}
            {mostFrequentLevel.value} out of {totalDimensions} dimensions 
            ({Math.round((mostFrequentLevel.value / totalDimensions) * 100)}% of your organization) 
            falling in this range. 
            {data.length === 1 
              ? ' Your organization has a consistent maturity level across all dimensions.'
              : data.length >= 4
                ? ' Your organization shows significant variation in maturity across different dimensions.'
                : ' Your organization shows some variation in maturity across dimensions.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default MaturityDistributionChart;