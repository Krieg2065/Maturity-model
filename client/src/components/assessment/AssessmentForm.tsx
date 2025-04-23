import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import Question from './Question';

const AssessmentForm: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { optionId: number, value: number }>>({});
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Fetch questions
  const { data: questions, isLoading } = useQuery({
    queryKey: ['/api/questions'],
  });

  const totalQuestions = questions?.length || 0;
  const currentQuestion = questions?.[currentQuestionIndex];
  const progress = totalQuestions ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  // Submit assessment mutation
  const submitAssessment = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/assessments', data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/assessments'] });
      navigate(`/results/${data.assessment.id}`);
      toast({
        title: "Assessment Completed",
        description: "Your maturity assessment has been processed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleOptionSelect = (questionId: number, optionId: number, value: number) => {
    setAnswers({
      ...answers,
      [questionId]: { optionId, value }
    });
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit the assessment
      const answersRecord: Record<string, any> = {};
      const categoryScores: Record<string, number> = {};
      const categories = new Map<string, { total: number, count: number }>();

      // Calculate scores by category and format answers
      Object.entries(answers).forEach(([questionIdStr, answer]) => {
        const questionId = parseInt(questionIdStr);
        const question = questions?.find(q => q.id === questionId);
        
        answersRecord[questionId] = { 
          questionId, 
          optionId: answer.optionId, 
          value: answer.value 
        };

        if (question) {
          const category = question.category;
          const currentCategory = categories.get(category) || { total: 0, count: 0 };
          currentCategory.total += answer.value;
          currentCategory.count += 1;
          categories.set(category, currentCategory);
        }
      });

      // Calculate average score per category
      categories.forEach((value, category) => {
        categoryScores[category] = Math.round(value.total / value.count);
      });

      // Calculate overall score (average of category scores)
      const overallScore = Math.round(
        Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / 
        Object.values(categoryScores).length
      );

      submitAssessment.mutate({
        overallScore,
        categoryScores,
        answers: answersRecord
      });
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading assessment questions...</p>
      </div>
    );
  }

  const currentQuestionAnswered = currentQuestion ? !!answers[currentQuestion.id] : false;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Company Maturity Assessment</h1>
          <Button variant="ghost" size="icon" onClick={handleClose} className="h-9 w-9">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-muted-foreground mt-2">
          Complete all 10 questions to receive your organization's maturity assessment.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Progress</span>
          <span className="font-medium">{currentQuestionIndex + 1} of {totalQuestions} Questions</span>
        </div>
        <div className="progress-bar">
          <div className="progress-value" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        {currentQuestion && (
          <Question
            question={currentQuestion}
            selectedOptionId={answers[currentQuestion.id]?.optionId}
            onOptionSelect={handleOptionSelect}
          />
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={!currentQuestionAnswered || submitAssessment.isPending}
        >
          {submitAssessment.isPending 
            ? "Processing..."
            : currentQuestionIndex === totalQuestions - 1 
              ? "Complete Assessment" 
              : "Next Question"
          }
        </Button>
      </div>
    </div>
  );
};

export default AssessmentForm;
