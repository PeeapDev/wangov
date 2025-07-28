import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'citizen' | 'application' | 'organization' | 'service';
  title: string;
  subtitle?: string;
  highlight?: string;
  url: string;
}

interface SearchBarProps {
  placeholder?: string;
  variant?: 'admin' | 'organization' | 'citizen' | 'ncra';
  role?: 'admin' | 'organization' | 'citizen' | 'ncra';
  maxResults?: number;
  className?: string;
  userRole?: string;
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  variant = 'admin',
  role,
  maxResults = 5,
  className = '',
  userRole = 'admin',
  onSearch
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Use role prop if provided, otherwise fall back to variant
  const activeVariant = role || variant;
  
  // Color variants based on user type
  const variantStyles = {
    admin: 'ring-purple-500 focus:border-purple-500 focus:ring-purple-500',
    organization: 'ring-blue-500 focus:border-blue-500 focus:ring-blue-500',
    citizen: 'ring-green-500 focus:border-green-500 focus:ring-green-500',
    ncra: 'ring-blue-800 focus:border-blue-800 focus:ring-blue-800',
  };
  
  // Mock search results for initial development - will be replaced with actual OpenSearch calls
  const mockSearchResults = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return [];
    
    // If NCRA role, show NCRA-specific results
    if (activeVariant === 'ncra') {
      return [
        {
          id: 'cit1',
          type: 'citizen',
          title: 'John Doe',
          subtitle: 'NIN: 123456789',
          highlight: `Citizen ID matching <strong>${searchQuery}</strong>`,
          url: '/ncra/citizens/123456789'
        },
        {
          id: 'cit2',
          type: 'citizen',
          title: 'Jane Smith',
          subtitle: 'NIN: 987654321',
          highlight: `Citizen profile with name containing <strong>${searchQuery}</strong>`,
          url: '/ncra/citizens/987654321'
        },
        {
          id: 'app1',
          type: 'application',
          title: 'ID Application #APP-2025-001',
          subtitle: 'Submitted: July 25, 2025',
          highlight: `ID application pending biometric verification`,
          url: '/ncra/applications/APP-2025-001'
        },
        {
          id: 'app2',
          type: 'application',
          title: 'Resident Permit #RP-2025-002',
          subtitle: 'Status: Under Review',
          highlight: `Resident permit application for foreigner`,
          url: '/ncra/applications/RP-2025-002'
        },
      ].filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, maxResults);
    }
    
    // Different results based on user role
    const baseResults: SearchResult[] = [
      {
        id: '1',
        type: 'citizen',
        title: 'John Doe',
        subtitle: 'NIN: 123456789',
        highlight: `Citizen <mark>${searchQuery}</mark> matched`,
        url: '/admin/citizens/1'
      },
      {
        id: '2',
        type: 'application',
        title: 'Passport Application',
        subtitle: 'Status: Pending',
        highlight: `Application for <mark>${searchQuery}</mark>`,
        url: '/admin/applications/2'
      },
      {
        id: '3',
        type: 'organization',
        title: 'Ministry of Education',
        subtitle: 'Government',
        highlight: `Organization with <mark>${searchQuery}</mark> services`,
        url: '/admin/organizations/3'
      }
    ];
    
    // Filter results based on role
    if (userRole === 'admin') {
      return baseResults;
    } else if (userRole === 'organization') {
      return baseResults.filter(r => r.type !== 'organization');
    } else {
      return baseResults.filter(r => r.type === 'application' || r.type === 'service');
    }
  };
  
  // Handle search query changes
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim()) {
      setIsLoading(true);
      
      // Debounce the search to prevent too many requests
      const timeout = setTimeout(() => {
        // This will be replaced with actual OpenSearch API call
        const searchResults = mockSearchResults(value);
        setResults(searchResults.slice(0, maxResults));
        setIsLoading(false);
        setShowResults(true);
        
        if (onSearch) {
          onSearch(value);
        }
      }, 300);
      
      return () => clearTimeout(timeout);
    } else {
      setResults([]);
      setShowResults(false);
      setIsLoading(false);
    }
  };
  
  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleResultClick(results[selectedIndex]);
      } else if (query.trim()) {
        // Perform full search when pressing Enter
        navigate(`/search?q=${encodeURIComponent(query)}`);
        setShowResults(false);
      }
    } else if (e.key === 'Escape') {
      setShowResults(false);
    }
  };
  
  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setShowResults(false);
    setQuery('');
  };
  
  // Determine icon based on result type
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'citizen':
        return (
          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'application':
        return (
          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'organization':
        return (
          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'service':
        return (
          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  // Get color based on active variant
  const getVariantColor = () => {
    switch (activeVariant) {
      case 'admin': return 'purple';
      case 'organization': return 'blue';
      case 'citizen': return 'green';
      case 'ncra': return 'blue-800';
      default: return 'blue';
    }
  };
  
  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg 
            className={`w-4 h-4 ${activeVariant === 'ncra' ? 'text-blue-800' : 'text-gray-500'}`} 
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 20 20"
          >
            <path 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" 
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setShowResults(true)}
          placeholder={placeholder}
          className={`p-2 pl-10 w-full text-sm text-gray-900 bg-white rounded-lg border ${variantStyles[activeVariant]} focus:outline-none focus:ring-1 ${className}`}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md py-1 overflow-hidden max-h-96">
          {results.length > 0 ? (
            <>
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-500">Quick Results</p>
              </div>
              <ul className="max-h-60 overflow-y-auto">
                {results.map((result, index) => (
                  <li
                    key={result.id}
                    className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${
                      index === selectedIndex ? 'bg-gray-50' : ''
                    }`}
                    onClick={() => handleResultClick(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-center">
                      {getResultIcon(result.type)}
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{result.title}</p>
                        {result.subtitle && (
                          <p className="text-xs text-gray-500">{result.subtitle}</p>
                        )}
                        {result.highlight && (
                          <p 
                            className="text-xs text-gray-500 mt-1"
                            dangerouslySetInnerHTML={{ __html: result.highlight }}
                          />
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-2 border-t border-gray-100">
                <button
                  className={`text-sm text-${getVariantColor()}-600 hover:text-${getVariantColor()}-800 w-full text-left`}
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(query)}`);
                    setShowResults(false);
                  }}
                >
                  See all results
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-500">No results found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
