import React from 'react';

interface FixCardProps {
  fix?: any;
  title?: string;
  riskLevel?: string;
  difficulty?: string;
  compatibility?: string;
  evidence?: string;
  confidenceLevel?: string;
  onViewSolution?: () => void;
  [key: string]: any;
}

const FixCard: React.FC<FixCardProps> = (props) => {
  const { fix } = props;
  const {
    title,
    riskLevel,
    difficulty,
    compatibility,
    evidence,
    confidenceLevel,
    onViewSolution,
  } = fix ?? props;
  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm">Risco: {riskLevel}</p>
      <p className="text-sm">Dificuldade: {difficulty}</p>
      <p className="text-sm">Compatibilidade: {compatibility}</p>
      <p className="text-sm">Evidência: {evidence}</p>
      <p className="text-sm">Confiança: {confidenceLevel}</p>
      <button
        className="mt-2 bg-blue-500 text-white rounded px-4 py-2"
        onClick={onViewSolution}
      >
        Ver solução
      </button>
    </div>
  );
};

export default FixCard;