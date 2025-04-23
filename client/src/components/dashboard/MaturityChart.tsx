import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer
} from 'recharts';

const MaturityChart: React.FC = () => {
  const [timePeriod, setTimePeriod] = React.useState('latest');

  // Fetch the latest assessment
  const { data: assessments, isLoading } = useQuery({
    queryKey: ['/api/assessments'],
  });

  // If there are no assessments, show a placeholder
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Maturity Score Breakdown</h2>
            <Select 
              value={timePeriod} 
              onValueChange={setTimePeriod}
              disabled={true}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Last Assessment</SelectItem>
                <SelectItem value="last3">Last 3 Assessments</SelectItem>
                <SelectItem value="last6">Last 6 Assessments</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">Loading maturity data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!assessments || assessments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Maturity Score Breakdown</h2>
            <Select 
              value={timePeriod} 
              onValueChange={setTimePeriod}
              disabled={true}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Last Assessment</SelectItem>
                <SelectItem value="last3">Last 3 Assessments</SelectItem>
                <SelectItem value="last6">Last 6 Assessments</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">No assessment data available. Start an assessment to see your results.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get the latest assessment data
  const latestAssessment = assessments[0];
  
  // Format the data for the radar chart
  const chartData = Object.entries(latestAssessment.categoryScores).map(([category, score]) => ({
    subject: category,
    "Your Score": score,
    "Industry Average": Math.min(Math.round(score * (0.8 + Math.random() * 0.4)), 100) // Mock industry average
  }));

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Maturity Score Breakdown</h2>
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Last Assessment</SelectItem>
              <SelectItem value="last3">Last 3 Assessments</SelectItem>
              <SelectItem value="last6">Last 6 Assessments</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart 
              cx="50%" 
              cy="50%" 
              outerRadius="70%" 
              data={chartData}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#2C3E50', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Your Score"
                dataKey="Your Score"
                stroke="#3498DB"
                fill="#3498DB"
                fillOpacity={0.2}
              />
              <Radar
                name="Industry Average"
                dataKey="Industry Average"
                stroke="#95A5A6"
                fill="#95A5A6"
                fillOpacity={0.2}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaturityChart;
