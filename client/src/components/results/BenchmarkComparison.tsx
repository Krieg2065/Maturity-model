import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

interface BenchmarkComparisonProps {
  categoryScores: Record<string, number>;
}

const BenchmarkComparison: React.FC<BenchmarkComparisonProps> = ({ categoryScores }) => {
  // Industry benchmark data (mock values - in a real app, would come from an API)
  const industryBenchmarks: Record<string, number> = {
    "Strategic Governance & Value Management": 68,
    "Program & Project Execution": 72,
    "Technical Architecture & Infrastructure": 65,
    "Security, Compliance & Data Management": 78,
    "Business Process & Solution Design": 62,
    "Core Module Configuration": 70,
    "Change Management & User Adoption": 65,
    "Support & Continuous Improvement": 60
  };

  // Prepare data for the chart
  const data = Object.entries(categoryScores).map(([category, score]) => {
    const truncatedCategory = category.length > 18 ? category.substring(0, 18) + '...' : category;
    return {
      category: truncatedCategory,
      fullCategory: category,
      score: score,
      benchmark: industryBenchmarks[category] || 0,
      gap: Math.abs(score - (industryBenchmarks[category] || 0)),
      leading: score >= (industryBenchmarks[category] || 0)
    };
  });

  // Sort data by gap size (largest to smallest)
  data.sort((a, b) => b.gap - a.gap);

  // Custom tooltip to display full category name
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const fullCategory = payload[0].payload.fullCategory;
      const score = payload[0].payload.score;
      const benchmark = payload[0].payload.benchmark;
      const gap = payload[0].payload.gap;
      const leading = payload[0].payload.leading;
      
      return (
        <div className="bg-white p-3 shadow-md border rounded-lg">
          <p className="font-semibold">{fullCategory}</p>
          <p className="text-sm">Your score: <span className="font-medium">{score}</span></p>
          <p className="text-sm">Industry benchmark: <span className="font-medium">{benchmark}</span></p>
          <p className="text-sm">
            Gap: <span className="font-medium">{gap}</span> 
            {leading 
              ? <span className="text-green-600"> (Leading)</span> 
              : <span className="text-amber-600"> (Lagging)</span>
            }
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Compare your organization's maturity scores with industry benchmarks to identify areas where 
        you're leading or lagging against peers.
      </div>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="category" type="category" width={120} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine x={0} stroke="#000" />
            <Bar name="Your Score" dataKey="score" fill="#3498DB" barSize={20} />
            <Bar name="Industry Benchmark" dataKey="benchmark" fill="#2C3E50" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-500 mt-4">
        <h4 className="font-semibold mb-1">Benchmark Insights</h4>
        <p className="text-sm">
          {data.filter(d => d.leading).length > 5 ? 
            "Your organization is outperforming industry benchmarks in most dimensions. Focus on maintaining your leadership position." : 
            data.filter(d => d.leading).length > 3 ?
            "Your organization has a balanced position with some areas of leadership. Address largest gaps for overall improvement." :
            "Your organization is trailing behind industry benchmarks in most dimensions. Consider prioritizing dimensions with the largest gaps."
          }
        </p>
      </div>
    </div>
  );
};

export default BenchmarkComparison;