import React, { useState } from 'react';

const ErrorSearch: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col items-center">
      <label htmlFor="error-code" className="mb-2 text-lg font-semibold">
        Digite um código de erro ou descreva o problema:
      </label>
      <input
        id="error-code"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="border rounded-md p-2 mb-4 w-full max-w-md"
        placeholder="Ex: 0x80070005"
      />
      <button type="submit" className="bg-blue-500 text-white rounded-md p-2">
        Diagnosticar
      </button>
    </form>
  );
};

export default ErrorSearch;