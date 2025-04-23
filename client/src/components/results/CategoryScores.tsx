import React from 'react';
import { Progress } from '@/components/ui/progress';

interface CategoryScoresProps {
  categoryScores: Record<string, number>;
}

const CategoryScores: React.FC<CategoryScoresProps> = ({ categoryScores }) => {
  // Colors for different score ranges
  const getScoreColor = (score: number): string => {
    if (score < 40) return "bg-accent"; // Red
    if (score < 60) return "bg-amber-500"; // Amber
    return "bg-emerald-500"; // Green
  };

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Category Scores</h3>
      <div className="space-y-4">
        {Object.entries(categoryScores)
          .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
          .map(([category, score]) => (
            <div key={category}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{category}</span>
                <span className="text-sm font-medium">{score}/100</span>
              </div>
              <Progress 
                value={score} 
                className="progress-bar" 
                indicatorColor={getScoreColor(score)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default CategoryScores;
