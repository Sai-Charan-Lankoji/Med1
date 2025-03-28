import { render, screen } from '@testing-library/react';
import VendorsList from '../../components/VendorsList'; // Adjust path as needed
import { Vendor } from '@/app/types/types';

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }: { children: React.ReactNode, href: string }) => <a href={href} {...props}>{children}</a>;
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('VendorsList Component', () => {
  const mockVendors: Vendor[] = [
    {
      id: '1',
      company_name: 'Tech Corp',
      contact_name: 'John Doe',
      registered_number: '12345' as string | undefined,
      status: 'active',
      contact_email: 'john@techcorp.com',
      contact_phone_number: '123-456-7890',
      tax_number: 'TAX123',
      plan: 'Pro',
      plan_id: 'plan1',
      next_billing_date: '2023-12-01T00:00:00Z',
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
          country_code: null,
          province: 'TC',
          postal_code: '12345',
          phone: '123-456-7890',
          vendor_address_id: '1',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-02T00:00:00Z',
          deletedAt: null,
        },
      ],
    },
    {
      id: '2',
      company_name: 'Retail Inc',
      contact_name: 'Jane Smith',
      registered_number: '67890' as string | undefined,
      status: 'inactive',
      contact_email: 'jane@retailinc.com',
      contact_phone_number: '987-654-3210',
      tax_number: 'TAX456',
      plan: 'Basic',
      plan_id: 'plan2',
      next_billing_date: '2023-12-15T00:00:00Z',
      business_type: 'Retail',
      createdAt: '2023-02-01T00:00:00Z',
      updatedAt: '2023-02-02T00:00:00Z',
      deletedAt: null,
      address: [],
    },
  ];

  // Test 1: Renders error message
  it('displays error message when error prop is provided', () => {
    const errorMessage = 'Failed to load vendors';
    render(<VendorsList vendors={[]} error={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  // Test 2: Displays "No vendors found" when vendors array is empty
  it('displays "No vendors found" when vendors array is empty and no error', () => {
    render(<VendorsList vendors={[]} error={null} />);
    expect(screen.getByText('No vendors found.')).toBeInTheDocument();
  });

  // Test 3: Renders table with vendor data
  it('renders vendor data in a table when vendors are provided', () => {
    render(<VendorsList vendors={mockVendors} error={null} />);

    // Check table headers
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Plan')).toBeInTheDocument();
    expect(screen.getByText('Next Billing')).toBeInTheDocument();
    expect(screen.getByText('Business Type')).toBeInTheDocument();

    // Check vendor 1 details
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@techcorp.com')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('12/1/2023')).toBeInTheDocument(); // Localized date
    expect(screen.getByText('Tech')).toBeInTheDocument();

    // Check vendor 2 details
    expect(screen.getByText('Retail Inc')).toBeInTheDocument();
    expect(screen.getByText('67890')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@retailinc.com')).toBeInTheDocument();
    expect(screen.getByText('987-654-3210')).toBeInTheDocument();
    expect(screen.getByText('inactive')).toBeInTheDocument();
    expect(screen.getByText('Basic')).toBeInTheDocument();
    expect(screen.getByText('12/15/2023')).toBeInTheDocument(); // Localized date
    expect(screen.getByText('Retail')).toBeInTheDocument();
  });

  // Test 4: Links are rendered correctly
  it('renders links with correct hrefs', () => {
    render(<VendorsList vendors={mockVendors} error={null} />);

    // Check company links
    const companyLinks = screen.getAllByText('Tech Corp').map((el) => el.closest('a'));
    expect(companyLinks[0]).toHaveAttribute('href', '/admin/vendors/1');

    // Check email link
    const emailLink = screen.getByText('john@techcorp.com').closest('a');
    expect(emailLink).toHaveAttribute('href', 'mailto:john@techcorp.com');

    // Check status link
    const statusLink = screen.getByText('active').closest('a');
    expect(statusLink).toHaveAttribute('href', '/admin/vendors/1');
  });

  // Test 5: Handles missing registered_number
  it('displays "N/A" when registered_number is missing', () => {
    const vendorWithoutRegNum = { ...mockVendors[0], registered_number: '' };
    render(<VendorsList vendors={[vendorWithoutRegNum]} error={null} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});