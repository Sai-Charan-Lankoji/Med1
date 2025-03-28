import { render, screen } from '@testing-library/react';
import VendorDetails from '../../components/VendorDetails'; // Adjust path based on your structure

// Mock the Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }: { children: React.ReactNode, href: string }) => <a href={href} {...props}>{children}</a>;
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock the BackButton component
jest.mock('@/app/components/BackButton', () => {
  const MockBackButton = () => <button>Back</button>;
  MockBackButton.displayName = 'MockBackButton';
  return MockBackButton;
});

describe('VendorDetails Component', () => {
  const mockVendorId = 'vendor123';
  const mockStore = {
    id: 'store1',
    name: 'Test Store',
    default_currency_code: 'USD',
    swap_link_template: 'swap-template',
    payment_link_template: 'payment-template',
    invite_link_template: 'invite-template',
    store_type: 'Retail',
    publishableapikey: 'pk_test_123',
    store_url: 'https://teststore.com',
    vendor_id: 'vendor123',
    default_sales_channel_id: 'channel1',
    default_location_id: null,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  };

  // Test 1: Renders with no stores
  it('displays "No stores found" when stores array is empty', () => {
    render(<VendorDetails stores={[]} error={null} vendorId={mockVendorId} />);
    expect(screen.getByText('No stores found for this vendor.')).toBeInTheDocument();
  });

  // Test 2: Renders error message
  it('displays error message when error prop is provided', () => {
    const errorMessage = 'Failed to load stores';
    render(<VendorDetails stores={[]} error={errorMessage} vendorId={mockVendorId} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  // Test 3: Renders store details correctly
  it('renders store details when stores are provided', () => {
    render(<VendorDetails stores={[mockStore]} error={null} vendorId={mockVendorId} />);

    // Check vendor ID in title

    // Check store-specific details
    expect(screen.getByText('Test Store')).toBeInTheDocument();
    expect(screen.getByText('Retail')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('https://teststore.com')).toBeInTheDocument();
    expect(screen.getByText('pk_test_123')).toBeInTheDocument();
    expect(screen.getByText('channel1')).toBeInTheDocument();
    expect(screen.getByText('1/1/2023')).toBeInTheDocument();
    expect(screen.getByText('1/2/2023')).toBeInTheDocument(); 
  });

  // Test 4: Renders BackButton
  it('includes a back button', () => {
    render(<VendorDetails stores={[]} error={null} vendorId={mockVendorId} />);
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  // Test 5: Renders multiple stores
  it('renders multiple stores correctly', () => {
    const secondStore = { ...mockStore, id: 'store2', name: 'Second Store' };
    render(<VendorDetails stores={[mockStore, secondStore]} error={null} vendorId={mockVendorId} />);
    expect(screen.getByText('Test Store')).toBeInTheDocument();
    expect(screen.getByText('Second Store')).toBeInTheDocument();
  });
});