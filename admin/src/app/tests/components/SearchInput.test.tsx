import React from 'react';
import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import SearchInput from '../../components/SearchInput'; 
// import { FaSearch } from 'react-icons/fa';

// Mock FaSearch with className prop support
jest.mock('react-icons/fa', () => ({
  FaSearch: ({ className }: { className: string }) => <svg data-testid="search-icon" className={className} />,
}));

describe('SearchInput Component', () => {
  it('renders with the provided value and placeholder', () => {
    const mockOnChange = jest.fn();
    render(
      <SearchInput value="test" onChange={mockOnChange} placeholder="Search here..." />
    );

    const input = screen.getByPlaceholderText('Search here...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('test');
  });

  it('renders with default placeholder when none is provided', () => {
    const mockOnChange = jest.fn();
    render(<SearchInput value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('displays the search icon', () => {
    const mockOnChange = jest.fn();
    render(<SearchInput value="" onChange={mockOnChange} />);

    const icon = screen.getByTestId('search-icon');
    expect(icon).toBeInTheDocument();
  });

//   it('calls onChange with the correct value when input changes', async () => {
//     const user = userEvent.setup();
//     const mockOnChange = jest.fn((e) => e.target.value); // Mock returns the new value
//     let value = ''; // Simulate controlled input state

//     const { rerender } = render(
//       <SearchInput
//         value={value}
//         onChange={(e) => {
//           value = e.target.value; // Update value on each change
//           mockOnChange(e); // Call the mock
//         }}
//       />
//     );

//     const input = screen.getByPlaceholderText('Search...');
//     expect(input).toHaveValue(''); // Initial value

//     // Simulate typing "new value"
//     await user.type(input, 'new value');

//     expect(mockOnChange).toHaveBeenCalledTimes('new value'.length); // 9 calls
//     expect(mockOnChange).toHaveBeenLastCalledWith(
//       expect.objectContaining({
//         target: expect.objectContaining({ value: 'new value' }),
//       })
//     );

//     // Rerender with the final value
//     rerender(<SearchInput value={value} onChange={mockOnChange} />);
//     expect(input).toHaveValue('new value');
//   });

  it('applies the correct classes to the input', () => {
    const mockOnChange = jest.fn();
    render(<SearchInput value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Search...');
    expect(input).toHaveClass(
      'input',
      'input-bordered',
      'w-full',
      'pl-10',
      'pr-4',
      'py-2',
      'rounded-lg',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-primary',
      'transition-all',
      'duration-300'
    );
  });

  it('applies the correct classes to the container div', () => {
    const mockOnChange = jest.fn();
    render(<SearchInput value="" onChange={mockOnChange} />);

    const container = screen.getByPlaceholderText('Search...').parentElement;
    expect(container).toHaveClass('relative', 'w-full', 'max-w-md');
  });

  it('applies the correct classes to the search icon', () => {
    const mockOnChange = jest.fn();
    render(<SearchInput value="" onChange={mockOnChange} />);

    const icon = screen.getByTestId('search-icon');
    expect(icon).toHaveClass(
      'absolute',
      'left-3',
      'top-1/2',
      'transform',
      '-translate-y-1/2',
      'text-gray-400'
    );
  });
});