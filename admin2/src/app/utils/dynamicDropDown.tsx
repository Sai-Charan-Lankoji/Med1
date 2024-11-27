import React, { useState, useEffect } from 'react';

interface DynamicSelectorProps {
  label: string;
  name: string;
}

const DynamicSelector: React.FC<DynamicSelectorProps> = ({ label, name }) => {
  const [options, setOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`#${name}-dropdown`) && !target.closest(`#${name}-input`)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [name]);

  const handleAddOption = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !options.includes(trimmedValue)) {
      setOptions((prevOptions) => [...prevOptions, trimmedValue]);
      setSelectedValue(trimmedValue); 
      setInputValue(''); 
      setIsDropdownOpen(false); 
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);
    setIsDropdownOpen(false); 
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddOption();
    }
  };

  return (
    <div className="relative mb-6">
      <label htmlFor={name} className="block text-sm font-medium text-gray-500">
        {label}
      </label>
      <div className="flex items-center pt-1">
        <input
          id={`${name}-input`}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={`Add or select a ${label.toLowerCase()}`}
          className="block p-2 outline-none   w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button
          type="button"
          onClick={handleAddOption}
          className="ml-2 p-2  bg-transparent  text-gray-800 border border-gray-700 py-1  hover:bg-gray-200  rounded-md shadow-sm"
        >
          Add
        </button>
      </div>
      {isDropdownOpen && (
        <div id={`${name}-dropdown`} className="absolute z-10 mt-1 w-full border border-gray-300 bg-white shadow-lg rounded-md p-2">
          <select
            id={name}
            name={name}
            value={selectedValue}
            onChange={handleSelectChange}
            className="block outline-none w-full border-none rounded-md shadow-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="" className='p-2' disabled>
              Select {label}
            </option>
            {options.length === 0 && (
              <option value="" disabled>No options available. Add a new one.</option>
            )}
            {options.map((option, index) => (
              <option key={index} value={option} className='p-2' >
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default DynamicSelector;
