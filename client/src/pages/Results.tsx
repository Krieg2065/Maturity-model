import React from 'react';
import { useLocation } from 'wouter';
import ResultsView from '@/components/results/ResultsView';
import { useToast } from '@/hooks/use-toast';

const Results: React.FC = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const handleBackToDashboard = () => {
    navigate('/');
  };
  
  const handleSaveResults = () => {
    // This is a mock function as results are already saved on the server
    toast({
      title: "Assessment Saved",
      description: "Your assessment results have been saved successfully.",
    });
  };
  
  return (
    <div>
      <ResultsView 
        onBackToDashboard={handleBackToDashboard} 
        onSaveResults={handleSaveResults}
      />
    </div>
  );
};

export default Results;
