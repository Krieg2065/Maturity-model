import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils';
import CategoryScores from './CategoryScores';
import AiAnalysis from './AiAnalysis';
import MaturityRadarChart from './MaturityRadarChart';
import DimensionProgressChart from './DimensionProgressChart';
import MaturityDistributionChart from './MaturityDistributionChart';
import PriorityQuadrantChart from './PriorityQuadrantChart';
import BenchmarkComparison from './BenchmarkComparison';
import KeyMetricsTable from './KeyMetricsTable';
// Using simple SVG icons instead of Heroicons to avoid import issues
const ChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" {...props}>
    <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5h-2v12h2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
  </svg>
);

const PresentationChartLineIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" {...props}>
    <path d="M0 0h16v16H0V0zm1 1v14h14V1H1zm5 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-4a.5.5 0 0 0-.5.5zM7 9.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-4a.5.5 0 0 0-.5.5zm.5-2.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1h-4z"/>
    <path d="M3 13.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0-3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0-3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0-3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
  </svg>
);

const ChartPieIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" {...props}>
    <path d="M7.5 1.018a7 7 0 0 0-4.79 11.566L7.5 7.793V1.018zm1 0V7.5h6.482A7.001 7.001 0 0 0 8.5 1.018zM14.982 8.5H8.207l-4.79 4.79A7 7 0 0 0 14.982 8.5zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"/>
  </svg>
);

const TableCellsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" {...props}>
    <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z"/>
  </svg>
);

interface ResultsViewProps {
  onBackToDashboard: () => void;
  onSaveResults?: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ 
  onBackToDashboard,
  onSaveResults
}) => {
  // Get assessment ID from route params
  const [, params] = useRoute<{ id: string }>('/results/:id');
  const assessmentId = params?.id;
  
  // Active tab state
  const [activeTab, setActiveTab] = useState("overview");
  
  // If no ID is provided, fetch the latest assessment
  const { data: assessments, isLoading: isLoadingAssessments } = useQuery({
    queryKey: ['/api/assessments'],
    enabled: !assessmentId,
  });

  // Determine which assessment to fetch
  const targetAssessmentId = assessmentId || 
    (assessments && assessments.length > 0 ? assessments[0].id.toString() : undefined);
  
  // Fetch the specific assessment
  const { data: assessment, isLoading: isLoadingAssessment } = useQuery({
    queryKey: [`/api/assessments/${targetAssessmentId}`],
    enabled: !!targetAssessmentId,
  });
  
  // Fetch insights for the assessment
  const { data: insights, isLoading: isLoadingInsights } = useQuery({
    queryKey: [`/api/assessments/${targetAssessmentId}/insights`],
    enabled: !!targetAssessmentId,
  });
  
  const isLoading = isLoadingAssessments || isLoadingAssessment || isLoadingInsights;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading assessment results...</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4">Assessment Not Found</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't find the assessment you're looking for. Please try another or complete a new assessment.
        </p>
        <Button onClick={onBackToDashboard}>Back to Dashboard</Button>
      </div>
    );
  }

  // Calculate maturity level based on overall score
  const getMaturityLevel = (score: number): string => {
    if (score < 30) return "Initial";
    if (score < 50) return "Developing";
    if (score < 70) return "Defined";
    if (score < 85) return "Advanced";
    return "Optimized";
  };

  const maturityLevel = getMaturityLevel(assessment.overallScore);

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Assessment Results</h1>
          <div>
            <Button
              variant="outline"
              className="mr-3"
              onClick={onBackToDashboard}
            >
              Back to Dashboard
            </Button>
            {onSaveResults && (
              <Button onClick={onSaveResults}>
                Export Report
              </Button>
            )}
          </div>
        </div>
        <p className="text-muted-foreground mt-2">
          Assessment completed on {formatDate(assessment.date)}
        </p>
      </div>

      {/* Overall Score Card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 flex flex-col items-center justify-center">
              <div className="relative">
                <svg className="w-40 h-40" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3498DB"
                    strokeWidth="3"
                    strokeDasharray={`${(assessment.overallScore / 100) * 100}, 100`}
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-3xl font-bold">{assessment.overallScore}</div>
                  <div className="text-sm text-muted-foreground">Overall Score</div>
                </div>
              </div>
              <div className="text-center mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-secondary">
                  {maturityLevel}
                </span>
                <p className="text-sm text-muted-foreground mt-2">
                  Your organization is {assessment.overallScore < 60 
                    ? "showing progress but has key areas for improvement" 
                    : "performing well with opportunities to excel further"}
                </p>
              </div>
            </div>
            
            <div className="col-span-2">
              <CategoryScores categoryScores={assessment.categoryScores} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview" className="flex items-center">
            <ChartBarIcon className="w-4 h-4 mr-2" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="comparisons" className="flex items-center">
            <PresentationChartLineIcon className="w-4 h-4 mr-2" />
            <span>Comparisons</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center">
            <ChartPieIcon className="w-4 h-4 mr-2" />
            <span>Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center">
            <TableCellsIcon className="w-4 h-4 mr-2" />
            <span>Key Metrics</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Maturity Heatmap</CardTitle>
              <CardDescription>
                Visualizes maturity across all dimensions in a radar chart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MaturityRadarChart categoryScores={assessment.categoryScores} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maturity Distribution</CardTitle>
              <CardDescription>
                Shows the distribution of dimensions across maturity levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MaturityDistributionChart categoryScores={assessment.categoryScores} />
            </CardContent>
          </Card>

          {/* AI-powered insights */}
          {insights && <AiAnalysis insights={insights} />}
        </TabsContent>

        {/* Comparisons Tab Content */}
        <TabsContent value="comparisons" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Progress Over Time</CardTitle>
              <CardDescription>
                Track maturity improvement across assessment periods
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assessments && assessments.length > 1 ? (
                <DimensionProgressChart assessments={assessments} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Complete at least one more assessment to see progress over time.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Industry Benchmark Comparison</CardTitle>
              <CardDescription>
                Compare your maturity scores against industry standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BenchmarkComparison categoryScores={assessment.categoryScores} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab Content */}
        <TabsContent value="analysis" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Priority Gap Analysis</CardTitle>
              <CardDescription>
                Maps importance against current maturity to identify critical improvement areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PriorityQuadrantChart categoryScores={assessment.categoryScores} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recommendations Summary</CardTitle>
              <CardDescription>
                Key recommendations and next steps based on your assessment results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {insights ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-secondary mb-2">Top 3 Priority Recommendations</h3>
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                    {insights.recommendations.slice(0, 3).map((rec, idx) => (
                      <div key={idx} className="p-4 bg-blue-50 rounded-lg border-l-4 border-secondary">
                        <h4 className="font-semibold">{rec.title}</h4>
                        <p className="text-sm mt-1">{rec.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-md border-l-4 border-amber-500 mt-6">
                    <h4 className="font-semibold mb-2">Key Focus Areas</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {insights.challenges.map((challenge, idx) => (
                        <li key={idx} className="text-sm">{challenge}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Analysis not available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics Tab Content */}
        <TabsContent value="metrics" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Metrics by Dimension</CardTitle>
              <CardDescription>
                Explore key performance indicators for each dimension
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KeyMetricsTable categoryScores={assessment.categoryScores} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsView;
