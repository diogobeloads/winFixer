import React from 'react';

interface ErrorCardProps {
  error?: any;
  code?: string;
  title?: string;
  description?: string;
  onDiagnose?: () => void;
  [key: string]: any;
}

const ErrorCard: React.FC<ErrorCardProps> = (props) => {
  const { error, code, title, description, onDiagnose } = props;
  const e = error ?? { code, title, description, onDiagnose };
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-xl font-bold">{e.code}: {e.title}</h3>
      <p className="text-gray-700">{e.description}</p>
      <button 
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        onClick={e.onDiagnose}
      >
        Diagnosticar
      </button>
    </div>
  );
};

export default ErrorCard;