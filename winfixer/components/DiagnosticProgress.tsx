import React from 'react';

interface DiagnosticProgressProps {
  currentStep?: number;
  totalSteps?: number;
  currentQuestionIndex?: number;
  totalQuestions?: number;
  [key: string]: any;
}

const DiagnosticProgress: React.FC<DiagnosticProgressProps> = (props) => {
  const currentStep =
    props.currentStep ?? props.currentQuestionIndex ?? 0;

  const totalSteps =
    props.totalSteps ?? props.totalQuestions ?? 1;

  const safeTotalSteps = Math.max(totalSteps, 1);

  // O primeiro passo começa em 0%.
  // Quando o usuário responde a primeira pergunta,
  // passamos para 1/N.
  const progressPercentage = Math.min(
    100,
    Math.max(0, (currentStep / safeTotalSteps) * 100)
  );

  return (
    <div className="w-full">
      {/* Cabeçalho da progressão */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">
          Progresso do diagnóstico
        </span>

        <span className="text-sm font-semibold text-blue-600">
          {currentStep} de {safeTotalSteps}
        </span>
      </div>

      {/* Barra */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500 ease-out"
          style={{
            width: `${progressPercentage}%`,
          }}
        />
      </div>

      {/* Informação inferior */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Pergunta {Math.min(currentStep + 1, safeTotalSteps)} de{' '}
          {safeTotalSteps}
        </span>

        <span className="text-xs font-medium text-slate-500">
          {Math.round(progressPercentage)}%
        </span>
      </div>
    </div>
  );
};

export default DiagnosticProgress;