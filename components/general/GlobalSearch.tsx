import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, CornerDownLeft } from 'lucide-react';
import { ProjectDetails, SearchResult, ViewState } from '../../types';
import { globalSearch } from '../../services/calculationService';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  project: Partial<ProjectDetails> | null;
  onNavigate: (view: ViewState) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, project, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (!query || !project) return [];
    return globalSearch(query, project);
  }, [query, project]);

  const handleSelect = (result: SearchResult) => {
    onNavigate(result.view);
    onClose();
    setQuery('');
  };

  useEffect(() => {
    if (isOpen) {
        // Delay focus to allow for transition
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      }
      if (e.key === 'Enter' && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, onNavigate]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start pt-20" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search size={20} className="text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search members, documents, actions..."
            className="w-full focus:outline-none text-lg text-slate-700"
          />
        </div>
        
        {results.length > 0 && (
          <div className="max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={result.id}
                onClick={() => handleSelect(result)}
                className={`p-4 flex items-center justify-between cursor-pointer ${
                  selectedIndex === index ? 'bg-blue-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <result.icon size={20} className="text-slate-500" />
                  <div>
                    <p className="font-medium text-slate-800">{result.title}</p>
                    <p className="text-sm text-slate-500">{result.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">{result.category}</span>
                    {selectedIndex === index && <CornerDownLeft size={16} className="text-blue-600" />}
                </div>
              </div>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
            <div className="p-16 text-center text-slate-500">
                <p>No results found for "{query}"</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;