import React from 'react';

interface DiagnosticQuestionProps {
  question?: any;
  options?: any[];
  onAnswer?: (answer: any) => void;
  [key: string]: any;
}

const DiagnosticQuestion: React.FC<DiagnosticQuestionProps> = ({ question, options, onAnswer }) => {
  const q = question ?? {};
  const opts = options ?? q.options ?? [];
  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-lg font-semibold mb-2">{q.title ?? q}</h2>
      <div className="flex flex-col">
        {opts.map((option: any, index: number) => (
          <button
            key={index}
            className="mb-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => onAnswer && onAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DiagnosticQuestion;