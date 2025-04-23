import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine
} from 'recharts';
import { formatDate } from '@/lib/utils';
import { Assessment } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface DimensionProgressChartProps {
  assessments: Assessment[];
}

const DimensionProgressChart: React.FC<DimensionProgressChartProps> = ({ assessments }) => {
  const sortedAssessments = [...assessments].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  
  // Get all unique dimensions from all assessments
  const allDimensions = new Set<string>();
  
  sortedAssessments.forEach(assessment => {
    Object.keys(assessment.categoryScores).forEach(dimension => {
      allDimensions.add(dimension);
    });
  });
  
  const dimensionsList = Array.from(allDimensions);
  const [selectedDimension, setSelectedDimension] = useState<string>(
    dimensionsList.length > 0 ? dimensionsList[0] : ''
  );
  
  // Process the data for the chart
  const chartData = sortedAssessments.map(assessment => {
    return {
      date: formatDate(assessment.date),
      rawDate: assessment.date,
      score: assessment.categoryScores[selectedDimension] || 0,
      overallScore: assessment.overallScore
    };
  });
  
  // Calculate improvement rate
  const calculateImprovement = () => {
    if (chartData.length < 2) return null;
    
    const firstScore = chartData[0].score;
    const lastScore = chartData[chartData.length - 1].score;
    const totalChange = lastScore - firstScore;
    const percentageChange = (totalChange / firstScore) * 100;
    
    return {
      points: totalChange.toFixed(1),
      percentage: percentageChange.toFixed(1),
      improved: totalChange > 0
    };
  };
  
  const improvement = calculateImprovement();
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md border rounded-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-primary">
            {selectedDimension}: {payload[0].payload.score}
          </p>
          <p className="text-sm text-secondary">
            Overall: {payload[0].payload.overallScore}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Track how your scores have changed over time for each dimension.
        </div>
        
        <Select 
          value={selectedDimension} 
          onValueChange={setSelectedDimension}
        >
          <SelectTrigger className="w-full sm:w-[280px]">
            <SelectValue placeholder="Select a dimension" />
          </SelectTrigger>
          <SelectContent>
            {dimensionsList.map(dimension => (
              <SelectItem key={dimension} value={dimension}>
                {dimension}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine y={30} stroke="#E74C3C" strokeDasharray="3 3" label={{ value: 'Initial', position: 'right' }} />
            <ReferenceLine y={50} stroke="#F39C12" strokeDasharray="3 3" label={{ value: 'Developing', position: 'right' }} />
            <ReferenceLine y={70} stroke="#3498DB" strokeDasharray="3 3" label={{ value: 'Defined', position: 'right' }} />
            <ReferenceLine y={85} stroke="#27AE60" strokeDasharray="3 3" label={{ value: 'Advanced', position: 'right' }} />
            <Line 
              type="monotone" 
              dataKey="score" 
              name={selectedDimension} 
              stroke="#3498DB" 
              strokeWidth={3}
              activeDot={{ r: 8 }} 
            />
            <Line 
              type="monotone" 
              dataKey="overallScore" 
              name="Overall Score" 
              stroke="#2C3E50" 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {improvement && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">Progress Analysis</h4>
            <p className="text-sm">
              {improvement.improved ? (
                <>
                  <span className="font-medium text-green-600">Improved by {improvement.points} points</span> 
                  ({improvement.percentage}%) since your first assessment.
                  {parseFloat(improvement.percentage) > 20 
                    ? ' This shows significant progress.' 
                    : parseFloat(improvement.percentage) > 10
                      ? ' This shows steady improvement.'
                      : ' This shows gradual progress.'}
                </>
              ) : (
                <>
                  <span className="font-medium text-amber-600">Decreased by {Math.abs(parseFloat(improvement.points))} points</span> 
                  ({Math.abs(parseFloat(improvement.percentage))}%) since your first assessment.
                  Consider revisiting your strategies for this dimension.
                </>
              )}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DimensionProgressChart;