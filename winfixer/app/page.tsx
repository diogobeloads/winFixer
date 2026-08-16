import React from 'react';
import Header from '../components/Header';
import ErrorSearch from '../components/ErrorSearch';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Header />
      <main className="flex flex-col items-center w-full max-w-2xl p-4">
        <h1 className="text-4xl font-bold text-center text-gray-800">WinFixer</h1>
        <p className="mt-2 text-lg text-center text-gray-600">
          Diagnostique e resolva erros do Windows.
        </p>
        <ErrorSearch onSearch={function (query: string): void {
          throw new Error('Function not implemented.');
        } } />
      </main>
    </div>
  );
};

export default HomePage;