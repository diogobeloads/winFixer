import React from 'react';

interface SearchResult {
  code: string;
  title: string;
  description: string;
  relevance: string;
}

interface SearchResultsProps {
  results?: SearchResult[];
  onDiagnose?: (code: string) => void;
  setQuery?: any;
  onDiagnose?: any;
  [key: string]: any;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results = [], onDiagnose }) => {
  return (
    <div className="mt-4">
      {results.length > 0 ? (
        <ul className="space-y-4">
          {results.map((result) => (
            <li key={result.code} className="border rounded-lg p-4 shadow-md">
              <h3 className="text-lg font-semibold">{result.code}</h3>
              <p className="text-gray-700">{result.title}</p>
              <p className="text-sm text-gray-500">{result.description}</p>
              <p className="text-sm text-green-600">{result.relevance}</p>
              <button
                onClick={() => onDiagnose(result.code)}
                className="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
              >
                Diagnosticar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Nenhum resultado encontrado.</p>
      )}
    </div>
  );
};

export default SearchResults;