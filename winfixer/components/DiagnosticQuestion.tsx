'use client';

import React from 'react';

interface DiagnosticQuestionProps {
  question?: any;
  options?: any[];
  onAnswer?: (answer: any) => void;
}

const DiagnosticQuestion: React.FC<DiagnosticQuestionProps> = ({
  question,
  options,
  onAnswer,
}) => {
  const q = question ?? {};

  const questionText =
    typeof q === 'string'
      ? q
      : q.question ?? q.title ?? 'Pergunta do diagnóstico';

  const rawOptions =
    options ??
    q.options ??
    [];

  const opts = Array.isArray(rawOptions)
    ? rawOptions
    : [];

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
          Pergunta do diagnóstico
        </p>

        <h2 className="text-2xl font-bold leading-tight text-slate-950">
          {questionText}
        </h2>
      </div>

      <div className="space-y-3">
        {opts.length > 0 ? (
          opts.map((option: any, index: number) => {
            const value =
              typeof option === 'object' && option !== null
                ? option.value ?? option.id ?? option.label ?? option.text
                : option;

            const label =
              typeof option === 'object' && option !== null
                ? option.label ??
                  option.text ??
                  option.title ??
                  option.value ??
                  option.id
                : option;

            return (
              <button
                key={index}
                type="button"
                onClick={() => onAnswer?.(value)}
                className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-slate-800">
                    {String(label)}
                  </span>

                  <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
                    →
                  </span>
                </div>
              </button>
            );
          })
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="font-semibold text-amber-900">
              Esta pergunta ainda não possui opções cadastradas.
            </p>

            <p className="mt-1 text-sm text-amber-700">
              Precisamos cadastrar as alternativas para continuar o diagnóstico.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticQuestion;