'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import ErrorSearch from '../components/ErrorSearch';

const HomePage = () => {
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (searchQuery: string) => {
    const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
    const data = await res.json();
    setResults(data || []);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Header />
      <main className="flex flex-col items-center w-full max-w-2xl p-4">
        <h1 className="text-4xl font-bold text-center text-gray-800">WinFixer</h1>
        <p className="mt-2 text-lg text-center text-gray-600">
          Diagnostique e resolva erros do Windows.
        </p>
        <ErrorSearch onSearch={handleSearch} setQuery={() => {}} />
      </main>
    </div>
  );
};

export default HomePage;