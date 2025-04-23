import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, AlertCircle, Check } from 'lucide-react';
import { type Insight } from '@shared/schema';

interface AiAnalysisProps {
  insights: Insight;
}

const AiAnalysis: React.FC<AiAnalysisProps> = ({ insights }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mt-8 mb-4">AI-Powered Analysis</h2>
      <Card>
        <CardContent className="p-6">
          <div className="prose max-w-none">
            <p className="mb-4">
              Based on your assessment responses, our AI analysis has identified the following strengths, challenges, and recommendations for your organization:
            </p>
            
            <h3 className="text-lg font-semibold text-secondary mb-2">Strengths</h3>
            <ul className="list-disc pl-5 mb-4 text-sm space-y-2">
              {insights.strengths.map((strength, index) => (
                <li key={index}>
                  <strong>{strength.split(" ").slice(0, 2).join(" ")}</strong> 
                  {strength.split(" ").slice(2).join(" ")}
                </li>
              ))}
            </ul>
            
            <h3 className="text-lg font-semibold text-accent mb-2">Key Challenges</h3>
            <ul className="list-disc pl-5 mb-4 text-sm space-y-2">
              {insights.challenges.map((challenge, index) => (
                <li key={index}>
                  <strong>{challenge.split(" ").slice(0, 2).join(" ")}</strong> 
                  {challenge.split(" ").slice(2).join(" ")}
                </li>
              ))}
            </ul>
            
            <h3 className="text-lg font-semibold text-emerald-600 mb-2">Strategic Recommendations</h3>
            <ol className="list-decimal pl-5 mb-4 text-sm space-y-3">
              {insights.recommendations.map((rec, index) => (
                <li key={index}>
                  <p className="font-medium">{rec.title}</p>
                  <p>{rec.description}</p>
                </li>
              ))}
            </ol>
            
            <div className="bg-blue-50 p-4 rounded-md border-l-4 border-secondary">
              <h4 className="font-semibold mb-2">Next Steps</h4>
              <p className="text-sm">
                We recommend scheduling a strategy session with key stakeholders to review these findings and develop an implementation roadmap. Focus first on the high-priority recommendations which will have the greatest impact on your organization's digital maturity.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiAnalysis;
