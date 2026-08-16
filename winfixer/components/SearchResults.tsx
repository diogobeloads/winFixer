'use client';

import React from 'react';
import Link from 'next/link';

export interface SearchResult {
  id: string;
  code: string;
  normalized_code?: string;
  name?: string | null;
  title: string;
  description?: string | null;
  category?: string | null;
  severity?: string | null;
}

interface SearchResultsProps {
  results?: SearchResult[];
  loading?: boolean;
  query?: string;
  onClear?: () => void;
}

const severityLabel: Record<string, string> = {
  baixa: 'Baixa',
  low: 'Baixa',
  media: 'Média',
  medium: 'Média',
  alta: 'Alta',
  high: 'Alta',
  critical: 'Crítica',
};

const severityClasses: Record<string, string> = {
  baixa: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  low: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  media: 'bg-amber-50 text-amber-700 ring-amber-200',
  medium: 'bg-amber-50 text-amber-700 ring-amber-200',
  alta: 'bg-orange-50 text-orange-700 ring-orange-200',
  high: 'bg-orange-50 text-orange-700 ring-orange-200',
  critical: 'bg-red-50 text-red-700 ring-red-200',
};

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
    <path
      d="M4 10h11M11 5l5 5-5 5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const Loader = () => (
  <span
    className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600"
    aria-label="Carregando"
  />
);

const SearchResults: React.FC<SearchResultsProps> = ({
  results = [],
  loading = false,
  query = '',
  onClear,
}) => {
  if (!query && !loading) return null;

  return (
    <section
      aria-live="polite"
      className="mx-auto mt-8 w-full max-w-5xl scroll-mt-28"
    >
      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
          <div className="flex items-center justify-center gap-3 text-slate-600">
            <Loader />
            <span className="font-semibold">Pesquisando na base de erros...</span>
          </div>
        </div>
      ) : results.length > 0 ? (
        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold text-blue-600">Resultado da pesquisa</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                {results.length === 1
                  ? 'Encontramos um erro compatível'
                  : `Encontramos ${results.length} erros compatíveis`}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Busca por <span className="font-semibold text-slate-700">“{query}”</span>
              </p>
            </div>

            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="self-start text-sm font-bold text-slate-500 transition hover:text-blue-600 sm:self-auto"
              >
                Limpar resultado
              </button>
            )}
          </div>

          <div className="grid gap-4">
            {results.map((result) => {
              const severityKey = (result.severity || '').toLowerCase();

              return (
                <article
                  key={result.id || result.code}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 sm:p-7"
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-blue-50 px-3 py-1.5 font-mono text-sm font-bold text-blue-700">
                          {result.code}
                        </span>

                        {result.category && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                            {result.category}
                          </span>
                        )}

                        {result.severity && (
                          <span
                            className={[
                              'rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset',
                              severityClasses[severityKey] || 'bg-slate-100 text-slate-600 ring-slate-200',
                            ].join(' ')}
                          >
                            Severidade: {severityLabel[severityKey] || result.severity}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-5 text-xl font-black text-slate-950 sm:text-2xl">
                        {result.title}
                      </h3>

                      {result.name && result.name !== result.title && (
                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          {result.name}
                        </p>
                      )}

                      <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                        {result.description || 'Não há uma descrição cadastrada para este erro ainda.'}
                      </p>
                    </div>

                    <Link
                      href={`/errors/${encodeURIComponent(result.normalized_code || result.code.replace(/^0x/i, ''))}`}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    >
                      Ver diagnóstico
                      <ArrowIcon />
                    </Link>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-5 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        ✓
                      </span>
                      Informação cadastrada
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <SearchIcon />
                      </span>
                      Veja o contexto e continue o diagnóstico
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 sm:p-10">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-2xl">
              🔎
            </div>
            <h2 className="mt-5 text-2xl font-black text-slate-950">
              Não encontramos esse erro
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Ainda não temos um resultado exato para <strong>“{query}”</strong>.
              Tente o código completo ou descreva o problema de outra forma.
            </p>
            <div className="mt-6 rounded-2xl bg-slate-50 px-5 py-4 text-left text-sm text-slate-600">
              <p className="font-bold text-slate-800">Exemplos</p>
              <ul className="mt-2 space-y-1">
                <li>• 0x80070005</li>
                <li>• Windows Update não instala</li>
                <li>• tela azul ao iniciar</li>
              </ul>
            </div>
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="mt-6 rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                Fazer outra pesquisa
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default SearchResults;
