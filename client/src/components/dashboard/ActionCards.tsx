import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '../../lib/utils';

const ActionCards: React.FC = () => {
  const [, setLocation] = useLocation();
  
  // Fetch the latest assessment
  const { data: assessments, isLoading } = useQuery({
    queryKey: ['/api/assessments'],
  });

  // Get the most recent assessment if any
  const latestAssessment = assessments && assessments.length > 0
    ? assessments[0]
    : null;

  const handleStartAssessment = () => {
    setLocation('/assessment');
  };

  const handleViewLastAssessment = () => {
    if (latestAssessment) {
      setLocation(`/results/${latestAssessment.id}`);
    }
  };

  const handleViewRecommendations = () => {
    if (latestAssessment) {
      setLocation(`/results/${latestAssessment.id}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="flex flex-col justify-between">
        <CardContent className="p-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Start Assessment</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Evaluate your organization's current maturity level with our 10-question assessment.
            </p>
          </div>
          <Button 
            className="w-full" 
            onClick={handleStartAssessment}
          >
            Start New Assessment
          </Button>
        </CardContent>
      </Card>

      <Card className="flex flex-col justify-between">
        <CardContent className="p-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Last Assessment</h3>
            {isLoading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : latestAssessment ? (
              <>
                <p className="text-muted-foreground text-sm mb-1">
                  Completed on {formatDate(latestAssessment.date)}
                </p>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold mr-2">{latestAssessment.overallScore}</span>
                  <span className="text-muted-foreground text-sm">Overall Maturity Score</span>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm mb-4">No assessments yet</p>
            )}
          </div>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleViewLastAssessment}
            disabled={!latestAssessment}
          >
            View Details
          </Button>
        </CardContent>
      </Card>

      <Card className="flex flex-col justify-between">
        <CardContent className="p-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">AI Recommendations</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Key recommendations based on your latest assessment results.
            </p>
          </div>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleViewRecommendations}
            disabled={!latestAssessment}
          >
            View Recommendations
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActionCards;
