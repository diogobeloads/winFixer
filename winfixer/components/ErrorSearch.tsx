'use client';

import React, { useState } from 'react';

const ErrorSearch: React.FC<{
  onSearch: (query: string) => void;
  setQuery?: (q: string) => void;
}> = ({ onSearch, setQuery }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const query = inputValue.trim();

    if (!query) return;

    setQuery?.(query);
    onSearch(query);
    setInputValue('');
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl shadow-blue-900/10 ring-1 ring-slate-900/5 transition focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-500/10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 shrink-0 text-slate-400" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>

            <div className="min-w-0 flex-1 text-left">
              <label htmlFor="error-code" className="sr-only">
                Código de erro ou descrição do problema
              </label>
              <input
                id="error-code"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full border-0 bg-transparent p-0 text-base font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0"
                placeholder="Ex: 0x80070005 ou “meu Windows não atualiza”"
                autoComplete="off"
              />
              <p className="mt-1 hidden text-xs text-slate-400 sm:block">
                Código de erro ou descrição do problema
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 font-bold text-white shadow-lg shadow-blue-600/20 transition duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!inputValue.trim()}
          >
            Diagnosticar
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
              <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};

export default ErrorSearch;
