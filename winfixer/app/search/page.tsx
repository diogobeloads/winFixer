'use client';

import { useState } from 'react';
import ErrorSearch from '@/components/ErrorSearch';
import SearchResults, { SearchResult } from '@/components/SearchResults';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchQuery: string) => {
    const normalizedQuery = searchQuery.trim();
    if (!normalizedQuery) return;

    setQuery(normalizedQuery);
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(normalizedQuery)}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.[0]?.message || data?.error || 'Erro ao pesquisar.');
      }

      if (!Array.isArray(data)) {
        throw new Error('Resposta inválida da API de pesquisa.');
      }

      setResults(data);
    } catch (err) {
      console.error('Search page error:', err);
      setError(err instanceof Error ? err.message : 'Não foi possível realizar a pesquisa.');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">Base de erros</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Encontre seu erro do Windows
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Pesquise por código, título ou descrição e encontre o próximo passo para investigar o problema.
          </p>
        </div>

        <div className="mt-10">
          <ErrorSearch onSearch={handleSearch} setQuery={setQuery} />
        </div>

        {error && (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-800">
            <p className="font-black">Não foi possível pesquisar.</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        <SearchResults
          results={results}
          loading={loading}
          query={query}
          onClear={clearSearch}
        />
      </div>
    </main>
  );
};

export default SearchPage;
