import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Label } from 'recharts';

interface PriorityQuadrantChartProps {
  categoryScores: Record<string, number>;
}

const PriorityQuadrantChart: React.FC<PriorityQuadrantChartProps> = ({ categoryScores }) => {
  // Define importance scores for each dimension (mock data for now)
  // In a real application, this could come from user input or predefined business values
  const importanceScores: Record<string, number> = {
    "Strategic Governance & Value Management": 90,
    "Program & Project Execution": 85,
    "Technical Architecture & Infrastructure": 80,
    "Security, Compliance & Data Management": 95,
    "Business Process & Solution Design": 75,
    "Core Module Configuration": 70,
    "Change Management & User Adoption": 85,
    "Support & Continuous Improvement": 65
  };
  
  // Prepare data for the scatter chart
  const data = Object.entries(categoryScores).map(([dimension, score]) => ({
    x: score, // Current maturity score
    y: importanceScores[dimension] || 75, // Importance score (default 75 if not defined)
    z: (importanceScores[dimension] || 75) - score, // Gap size (importance - current)
    name: dimension
  }));
  
  // Function to get color based on gap
  const getGapColor = (gap: number): string => {
    if (gap > 50) return "#E74C3C"; // Critical gap - Red
    if (gap > 30) return "#F39C12"; // Significant gap - Orange
    if (gap > 10) return "#F1C40F"; // Moderate gap - Yellow
    return "#2ECC71"; // Small gap - Green
  };
  
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 40,
            left: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Maturity Score" 
            domain={[0, 100]} 
            label={{ value: 'Current Maturity Score', position: 'bottom', offset: 10 }} 
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Business Importance" 
            domain={[0, 100]} 
            label={{ value: 'Business Importance', angle: -90, position: 'left', offset: 0 }} 
          />
          <ZAxis 
            type="number" 
            dataKey="z" 
            range={[50, 500]} 
            name="Gap Size" 
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            formatter={(value, name, props) => {
              if (name === 'Gap Size') return [`${value}`, name];
              return [`${value}/100`, name];
            }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="p-3 bg-white shadow-md rounded-md border">
                    <p className="font-semibold">{data.name}</p>
                    <p>Maturity: {data.x}/100</p>
                    <p>Importance: {data.y}/100</p>
                    <p>Gap: {data.z} points</p>
                    <p className="text-xs mt-1">
                      {data.z > 30 
                        ? "High priority - requires immediate attention" 
                        : data.z > 10 
                          ? "Medium priority - plan improvements" 
                          : "Low priority - maintain current state"}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          
          {/* Add quadrant lines */}
          <line x1={50} y1={0} x2={50} y2={100} stroke="#ccc" strokeDasharray="3 3" />
          <line x1={0} y1={75} x2={100} y2={75} stroke="#ccc" strokeDasharray="3 3" />
          
          <Scatter
            name="Dimensions"
            data={data}
            fill="#8884d8"
            shape={(props: any) => {
              const { cx, cy, payload } = props;
              return (
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={8} 
                  fill={getGapColor(payload.z)} 
                  stroke="#fff"
                  strokeWidth={2}
                />
              );
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
      
      {/* Quadrant labels */}
      <div className="grid grid-cols-2 text-center text-xs text-muted-foreground mt-2">
        <div>Low Maturity, Low Importance</div>
        <div>High Maturity, Low Importance</div>
        <div>Low Maturity, High Importance</div>
        <div>High Maturity, High Importance</div>
      </div>
    </div>
  );
};

export default PriorityQuadrantChart;