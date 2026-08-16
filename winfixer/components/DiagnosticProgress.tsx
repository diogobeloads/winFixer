import React from 'react';

interface DiagnosticProgressProps {
  currentStep?: number;
  totalSteps?: number;
  currentQuestionIndex?: number;
  totalQuestions?: number;
  [key: string]: any;
}

const DiagnosticProgress: React.FC<DiagnosticProgressProps> = (props) => {
  const currentStep = props.currentStep ?? props.currentQuestionIndex ?? 0;
  const totalSteps = props.totalSteps ?? props.totalQuestions ?? 1;
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full">
      <div
        className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
        style={{ width: `${progressPercentage}%` }}
      >
        {currentStep} of {totalSteps} steps completed
      </div>
    </div>
  );
};

export default DiagnosticProgress;