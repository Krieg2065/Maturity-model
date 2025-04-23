import React from 'react';
import { type QuestionWithOptions } from '@shared/schema';

interface QuestionProps {
  question: QuestionWithOptions;
  selectedOptionId?: number;
  onOptionSelect: (questionId: number, optionId: number, value: number) => void;
}

const Question: React.FC<QuestionProps> = ({ 
  question, 
  selectedOptionId, 
  onOptionSelect 
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        {question.order}. {question.questionText}
      </h2>
      <div className="space-y-3">
        {question.options
          .sort((a, b) => a.order - b.order)
          .map((option) => (
            <div 
              key={option.id}
              className={`assessment-option ${selectedOptionId === option.id ? 'selected' : ''}`}
              onClick={() => onOptionSelect(question.id, option.id, option.value)}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 h-5 w-5 border border-gray-300 rounded-full mr-3 flex items-center justify-center option-radio">
                  <div className={`h-3 w-3 bg-secondary rounded-full option-radio-selected ${selectedOptionId === option.id ? '' : 'hidden'}`}></div>
                </div>
                <div>
                  <p className="font-medium">{option.optionText}</p>
                  {option.description && (
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Question;
