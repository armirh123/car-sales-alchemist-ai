
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Car, Users, DollarSign, FileText, Command } from "lucide-react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'vehicle' | 'customer' | 'lead' | 'sale' | 'report';
  category: string;
}

interface GlobalSearchProps {
  onSelect?: (result: SearchResult) => void;
}

const GlobalSearch = ({ onSelect }: GlobalSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sample search data - in real app this would come from your data store
  const searchData: SearchResult[] = [
    {
      id: '1',
      title: '2023 Toyota Camry',
      description: 'Silver sedan with 15,000 miles',
      type: 'vehicle',
      category: 'Inventory'
    },
    {
      id: '2', 
      title: 'John Smith',
      description: 'Customer interested in SUVs',
      type: 'customer',
      category: 'Customers'
    },
    {
      id: '3',
      title: 'Hot Lead - Sarah Johnson',
      description: 'Looking for luxury sedan',
      type: 'lead', 
      category: 'Leads'
    },
    {
      id: '4',
      title: 'Sales Report - October',
      description: 'Monthly sales performance report',
      type: 'report',
      category: 'Reports'
    }
  ];

  useKeyboardShortcuts([
    {
      key: 'k',
      ctrlKey: true,
      callback: () => {
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      },
      description: 'Open global search'
    },
    {
      key: 'Escape',
      callback: () => setIsOpen(false),
      description: 'Close search'
    }
  ]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = searchData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered.slice(0, 8)); // Limit results
  }, [query]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'vehicle': return <Car className="h-4 w-4" />;
      case 'customer': return <Users className="h-4 w-4" />;
      case 'lead': return <Users className="h-4 w-4" />;
      case 'sale': return <DollarSign className="h-4 w-4" />;
      case 'report': return <FileText className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vehicle': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-green-100 text-green-800';
      case 'lead': return 'bg-orange-100 text-orange-800';
      case 'sale': return 'bg-purple-100 text-purple-800';
      case 'report': return 'bg-slate-100 text-slate-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleResultClick = (result: SearchResult) => {
    onSelect?.(result);
    setIsOpen(false);
    setQuery('');
  };

  if (!isOpen) {
    return (
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search everything... (Ctrl+K)"
            className="pl-10 pr-16"
            onClick={() => setIsOpen(true)}
            readOnly
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Badge variant="outline" className="text-xs">
              <Command className="h-3 w-3 mr-1" />
              K
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          ref={inputRef}
          placeholder="Search everything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
          <CardContent className="p-0">
            {results.length === 0 && query ? (
              <div className="p-4 text-center text-slate-500">
                No results found for "{query}"
              </div>
            ) : results.length === 0 ? (
              <div className="p-4 text-center text-slate-500">
                Start typing to search...
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="p-3 hover:bg-slate-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-slate-400">
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{result.title}</span>
                          <Badge className={getTypeColor(result.type)} variant="secondary">
                            {result.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">{result.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GlobalSearch;
