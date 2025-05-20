import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => (
  <div className="relative form-floating mb-4">
    <input
      id="search-input"
      type="search"
      className="form-control block w-full px-3 py-4 text-base font-normal text-white bg-clip-padding border border-solid border-gray-400 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 peer transition"
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ height: '3.5rem' }}
    />
    <label
      htmlFor="search-input"
      className="absolute top-0 left-0 z-10 h-full px-3 py-4 text-gray-400 pointer-events-none transition-all duration-200 ease-in-out transform origin-left peer-focus:-translate-y-5 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0"
      >Search by mission name...</label>
  </div>
);

export default SearchInput;
