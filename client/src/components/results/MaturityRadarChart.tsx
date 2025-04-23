import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface MaturityRadarChartProps {
  categoryScores: Record<string, number>;
}

const MaturityRadarChart: React.FC<MaturityRadarChartProps> = ({ categoryScores }) => {
  // Transform category scores into the format needed for the radar chart
  const data = Object.entries(categoryScores).map(([name, value]) => ({
    dimension: name,
    value: value,
    fullMark: 100,
  }));

  // Determine color based on overall maturity
  const getScoreColor = (score: number): string => {
    if (score < 40) return "#E74C3C"; // Red
    if (score < 60) return "#F39C12"; // Amber
    if (score < 80) return "#3498DB"; // Blue
    return "#27AE60"; // Green
  };

  // Calculate average score
  const averageScore = data.reduce((sum, item) => sum + item.value, 0) / data.length;
  const scoreColor = getScoreColor(averageScore);

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />
          <Tooltip 
            formatter={(value) => [`${value}/100`, 'Maturity Score']}
            labelFormatter={(label) => `${label}`}
          />
          <Radar
            name="Maturity"
            dataKey="value"
            stroke={scoreColor}
            fill={scoreColor}
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MaturityRadarChart;