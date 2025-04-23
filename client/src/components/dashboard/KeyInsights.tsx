import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, TrendingUp, HelpCircle, CheckCircle } from 'lucide-react';

const KeyInsights: React.FC = () => {
  // Fetch the latest assessment
  const { data: assessments, isLoading: isLoadingAssessments } = useQuery({
    queryKey: ['/api/assessments'],
  });

  // Get the latest assessment ID
  const latestAssessmentId = assessments && assessments.length > 0
    ? assessments[0].id
    : null;

  // Fetch insights for the latest assessment
  const { data: insights, isLoading: isLoadingInsights } = useQuery({
    queryKey: [`/api/assessments/${latestAssessmentId}/insights`],
    enabled: !!latestAssessmentId,
  });

  const isLoading = isLoadingAssessments || isLoadingInsights;

  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-semibold mt-8 mb-4">Key Insights & Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 rounded-lg bg-slate-100 animate-pulse" />
          <div className="h-40 rounded-lg bg-slate-100 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!latestAssessmentId || !insights) {
    return (
      <div>
        <h2 className="text-xl font-semibold mt-8 mb-4">Key Insights & Recommendations</h2>
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
          <p className="text-muted-foreground">
            Complete an assessment to receive AI-generated insights and recommendations.
          </p>
        </div>
      </div>
    );
  }

  // Get recommendations (at most 4)
  const recommendations = insights.recommendations.slice(0, 4);

  return (
    <div>
      <h2 className="text-xl font-semibold mt-8 mb-4">Key Insights & Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec, index) => (
          <div 
            key={index} 
            className={`recommendation-card ${rec.priority ? 'priority' : ''}`}
          >
            <div className="flex items-start">
              {rec.priority ? (
                <AlertTriangle className="h-6 w-6 text-accent mr-2 flex-shrink-0" />
              ) : (
                <TrendingUp className="h-6 w-6 text-secondary mr-2 flex-shrink-0" />
              )}
              <div>
                <h3 className={`font-semibold ${rec.priority ? 'text-accent' : 'text-secondary'} mb-1`}>{rec.title}</h3>
                <p className="text-sm">{rec.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyInsights;
