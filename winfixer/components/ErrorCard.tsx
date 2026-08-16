import React from 'react';

interface ErrorContext {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  operating_systems?: string[] | null;
  symptoms?: string[] | null;
}

interface ErrorCardProps {
  context: ErrorContext;
  onDiagnose: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const ContextIcon = ({ slug }: { slug: string }) => {
  const icon = slug.includes('store') ? '▣' : slug.includes('driver') ? '⚙' : slug.includes('boot') ? '↻' : slug.includes('activation') ? '✓' : '⌘';

  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-xl font-black text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
      {icon}
    </span>
  );
};

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
    <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ErrorCard({ context, onDiagnose, loading = false, disabled = false }: ErrorCardProps) {
  const operatingSystems = context.operating_systems?.filter(Boolean) ?? [];
  const symptoms = context.symptoms?.filter(Boolean) ?? [];

  return (
    <button
      type="button"
      onClick={onDiagnose}
      disabled={disabled || loading}
      className="group w-full text-left disabled:cursor-not-allowed disabled:opacity-70"
    >
      <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <ContextIcon slug={context.slug} />
          <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
            {loading ? (
              <span className="block h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
            ) : (
              <ArrowIcon />
            )}
          </span>
        </div>

        <h3 className="mt-6 text-xl font-extrabold text-slate-950">{context.name}</h3>
        <p className="mt-2 min-h-14 leading-7 text-slate-600">
          {context.description || 'Diagnóstico direcionado para este contexto do erro.'}
        </p>

        {(operatingSystems.length > 0 || symptoms.length > 0) && (
          <div className="mt-5 flex flex-wrap gap-2">
            {operatingSystems.slice(0, 3).map((item) => (
              <span key={`os-${item}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{item}</span>
            ))}
            {symptoms.slice(0, 2).map((item) => (
              <span key={`symptom-${item}`} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{item}</span>
            ))}
          </div>
        )}

        <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
          <span className="text-sm font-extrabold text-blue-600">{loading ? 'Iniciando diagnóstico...' : 'Começar diagnóstico'}</span>
          <span className="text-xs font-bold text-slate-400">1ª etapa</span>
        </div>
      </div>
    </button>
  );
}
