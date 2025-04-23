import React from 'react';
import { useLocation } from 'wouter';
import { formatDate } from '@/lib/utils';
import { type Assessment } from '@shared/schema';

interface TimelineItemProps {
  assessment: Assessment;
  isLatest: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ assessment, isLatest }) => {
  const [, navigate] = useLocation();
  
  const handleViewDetails = () => {
    navigate(`/results/${assessment.id}`);
  };
  
  // For simplicity, we're not implementing the download functionality
  const handleDownload = () => {
    alert('Download functionality would be implemented here');
  };
  
  // Format the date for display
  const formattedDate = formatDate(assessment.date);

  return (
    <div className="relative pl-24">
      <div className={`absolute left-14 transform -translate-x-1/2 w-5 h-5 rounded-full ${
        isLatest ? 'bg-secondary' : 'bg-gray-300'
      } border-4 border-white`}></div>
      <div className="absolute left-0 top-0 text-sm text-muted-foreground">{formattedDate}</div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Quarterly Assessment</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isLatest ? 'bg-blue-100 text-secondary' : 'bg-gray-100 text-gray-800'
          }`}>
            Score: {assessment.overallScore}/100
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          {isLatest 
            ? "Latest assessment of your organization's digital maturity across all business units."
            : "Previous assessment of your organization's digital maturity across all business units."}
        </p>
        <div className="flex">
          <button 
            onClick={handleViewDetails}
            className="text-sm text-secondary font-medium mr-4 hover:underline"
          >
            View Details
          </button>
          <button 
            onClick={handleDownload}
            className="text-sm text-muted-foreground font-medium hover:underline"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
