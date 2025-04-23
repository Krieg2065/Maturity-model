import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import TimelineItem from './TimelineItem';
import ProgressChart from './ProgressChart';

const HistoryView: React.FC = () => {
  // Fetch all assessments
  const { data: assessments, isLoading } = useQuery({
    queryKey: ['/api/assessments'],
  });

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Assessment History</h1>
          <p className="text-muted-foreground mt-2">Review your past assessments and track your progress over time.</p>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <p>Loading assessment history...</p>
        </div>
      </div>
    );
  }

  if (!assessments || assessments.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Assessment History</h1>
          <p className="text-muted-foreground mt-2">Review your past assessments and track your progress over time.</p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-2">No Assessments Yet</h2>
              <p className="text-muted-foreground">
                You haven't completed any assessments yet. Complete your first assessment to start tracking your progress.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Assessment History</h1>
        <p className="text-muted-foreground mt-2">Review your past assessments and track your progress over time.</p>
      </div>

      {/* History Timeline */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6">Past Assessments</h2>
          <div className="relative">
            {/* Timeline Center Line */}
            <div className="absolute h-full w-0.5 bg-gray-200 left-16 top-0"></div>
            
            {/* Timeline Items */}
            <div className="space-y-8">
              {assessments.map((assessment, index) => (
                <TimelineItem 
                  key={assessment.id} 
                  assessment={assessment} 
                  isLatest={index === 0}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Over Time Chart */}
      {assessments.length > 1 && (
        <Card className="mt-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6">Progress Over Time</h2>
            <div className="h-80">
              <ProgressChart assessments={assessments} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HistoryView;
