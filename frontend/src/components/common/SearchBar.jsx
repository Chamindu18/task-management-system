import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ placeholder = "Search...", onSearch, className = "" }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <div className={`search-bar ${className}`}>
      <Search className="search-icon" size={20} />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleSearch}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;