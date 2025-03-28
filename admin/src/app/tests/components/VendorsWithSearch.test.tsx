import { render, screen, fireEvent } from '@testing-library/react';
import VendorsWithSearch from '../../components/VendorsWithSearch'; // Adjust path as needed
type Vendor = {
    id: string;
    company_name: string;
    contact_name: string;
    registered_number: string;
    status: string;
    contact_email: string;
    contact_phone_number: string;
    tax_number: string;
    plan: string;
    plan_id: string;
    next_billing_date: string;
    business_type: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    address: {
      id: string;
      company: string;
      first_name: string;
      last_name: string;
      address_1: string;
      address_2: string;
      city: string;
      province: string;
      postal_code: string;
      phone: string;
      vendor_address_id: string;
    }[];
  };

// Mock VendorsList component
jest.mock('@/app/components/VendorsList', () => {
  const VendorsListMock = ({ vendors, error }: { vendors: Vendor[]; error: string | null }) => (
    <div data-testid="vendors-list">
      {error ? (
        <span>{error}</span>
      ) : vendors.length === 0 ? (
        <span>No vendors</span>
      ) : (
        vendors.map((vendor) => (
          <div key={vendor.id}>{vendor.company_name}</div>
        ))
      )}
    </div>
  );
  VendorsListMock.displayName = 'VendorsListMock';
  return VendorsListMock;
});

// Mock SearchInput component
jest.mock('@/app/components/SearchInput', () => {
  const SearchInputMock = ({ value, onChange, placeholder }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string }) => (
    <input
      data-testid="search-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
  SearchInputMock.displayName = 'SearchInputMock';
  return SearchInputMock;
});

describe('VendorsWithSearch Component', () => {
  const mockVendors: Vendor[] = [
    {
      id: '1',
      company_name: 'Tech Corp',
      contact_name: 'John Doe',
      registered_number: '12345',
      status: 'active',
      contact_email: 'john@techcorp.com',
      contact_phone_number: '123-456-7890',
      tax_number: 'TAX123',
      plan: 'Pro',
      plan_id: 'plan1',
      next_billing_date: '2023-12-01',
      business_type: 'Tech',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
      deletedAt: null,
      address: [
        {
          id: 'addr1',
          company: 'Tech Corp',
          first_name: 'John',
          last_name: 'Doe',
          address_1: '123 Tech St',
          address_2: '',
          city: 'Tech City',
          province: 'TC',
          postal_code: '12345',
          phone: '123-456-7890',
          vendor_address_id: '1',
        },
      ],
    },
    {
      id: '2',
      company_name: 'Retail Inc',
      contact_name: 'Jane Smith',
      registered_number: '67890',
      status: 'active',
      contact_email: 'jane@retailinc.com',
      contact_phone_number: '987-654-3210',
      tax_number: 'TAX456',
      plan: 'Basic',
      plan_id: 'plan2',
      next_billing_date: '2023-12-15',
      business_type: 'Retail',
      createdAt: '2023-02-01T00:00:00Z',
      updatedAt: '2023-02-02T00:00:00Z',
      deletedAt: null,
      address: [],
    },
  ];

  // Test 1: Renders initial vendors
  it('renders initial vendors and title', () => {
    render(<VendorsWithSearch initialVendors={mockVendors} initialError={null} />);
    expect(screen.getByText('Vendors')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('Retail Inc')).toBeInTheDocument();
  });

  // Test 2: Displays error when provided
  it('displays error message when initialError is provided', () => {
    const errorMessage = 'Failed to load vendors';
    render(<VendorsWithSearch initialVendors={[]} initialError={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  // Test 3: Filters vendors based on search query
  it('filters vendors when search input changes', () => {
    render(<VendorsWithSearch initialVendors={mockVendors} initialError={null} />);
    const searchInput = screen.getByTestId('search-input');

    fireEvent.change(searchInput, { target: { value: 'Tech' } });
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.queryByText('Retail Inc')).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'jane' } });
    expect(screen.getByText('Retail Inc')).toBeInTheDocument();
    expect(screen.queryByText('Tech Corp')).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('Retail Inc')).toBeInTheDocument();
  });

  // Test 4: Paginates vendors correctly
  it('paginates vendors and updates on button click', () => {
    // Create 6 vendors to test pagination (5 per page)
    const manyVendors = Array.from({ length: 6 }, (_, i) => ({
      ...mockVendors[0],
      id: `${i + 1}`,
      company_name: `Vendor ${i + 1}`,
    }));

    render(<VendorsWithSearch initialVendors={manyVendors} initialError={null} />);

    // First page: 5 vendors
    expect(screen.getAllByText(/Vendor [1-5]/)).toHaveLength(5);
    expect(screen.queryByText('Vendor 6')).not.toBeInTheDocument();

    // Go to page 2
    const nextButton = screen.getByText('»');
    fireEvent.click(nextButton);
    expect(screen.getByText('Vendor 6')).toBeInTheDocument();
    expect(screen.queryByText('Vendor 1')).not.toBeInTheDocument();

    // Go back to page 1
    const prevButton = screen.getByText('«');
    fireEvent.click(prevButton);
    expect(screen.getByText('Vendor 1')).toBeInTheDocument();
    expect(screen.queryByText('Vendor 6')).not.toBeInTheDocument();
  });

  // Test 5: Disables pagination buttons correctly
  it('disables prev/next buttons at boundaries', () => {
    const manyVendors = Array.from({ length: 6 }, (_, i) => ({
      ...mockVendors[0],
      id: `${i + 1}`,
      company_name: `Vendor ${i + 1}`,
    }));

    render(<VendorsWithSearch initialVendors={manyVendors} initialError={null} />);

    const prevButton = screen.getByText('«');
    const nextButton = screen.getByText('»');

    // On page 1, prev should be disabled
    expect(prevButton).toHaveAttribute('disabled');

    // Go to page 2
    fireEvent.click(nextButton);
    expect(prevButton).not.toHaveAttribute('disabled');
    expect(nextButton).toHaveAttribute('disabled');
  });
});