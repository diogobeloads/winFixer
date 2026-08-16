import { useState } from 'react';
import ErrorSearch from '@/components/ErrorSearch';
import SearchResults from '@/components/SearchResults';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (searchQuery) => {
    // Call the API to search for errors
    const response = await fetch(`/api/search?q=${searchQuery}`);
    const data = await response.json();
    setResults(data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search for Windows Errors</h1>
      <ErrorSearch onSearch={handleSearch} setQuery={setQuery} />
      <SearchResults results={results} />
    </div>
  );
};

export default SearchPage;