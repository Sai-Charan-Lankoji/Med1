import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlansWithSearch from '../../components/PlansWithSearch'; // Adjust path as needed
import { Plan } from '@/app/api/plan/route';

// Mock dependencies
jest.mock('@/app/components/SearchInput', () => {
  return function MockSearchInput({ value, onChange, placeholder }: { value: string, onChange: (event: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string }) {
    return (
      <input
        data-testid="search-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    );
  };
});

jest.mock('@/app/components/PlanModal', () => {
  return function MockPlanModal({ isOpen, onClose, onPlanSaved, plan }: { isOpen: boolean, onClose: () => void, onPlanSaved: (plans: Plan[]) => void, plan: Plan | null }) {
    if (!isOpen) return null;
    const newPlan: Plan = {
      id: plan?.id || 'new-plan',
      name: plan?.name || 'New Plan',
      price: plan?.price || '50',
      isActive: plan?.isActive ?? true,
      no_stores: plan?.no_stores || "5",
      commission_rate: plan?.commission_rate || 2,
      features: plan?.features || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };
    return (
      <div data-testid="plan-modal">
        <button onClick={() => onClose()}>Close</button>
        <button
          onClick={() => {
            onPlanSaved([newPlan]);
            onClose();
          }}
        >
          Save
        </button>
      </div>
    );
  };
});

jest.mock('@/app/components/DeletePlanModal', () => {
  return function MockDeletePlanModal({ isOpen, onClose, onPlanDeleted, planId }: { isOpen: boolean, onClose: () => void, onPlanDeleted: (callback: (prevPlans: Plan[]) => Plan[]) => void, planId: string }) {
    if (!isOpen) return null;
    return (
      <div data-testid="delete-modal">
        <button onClick={() => onClose()}>Cancel</button>
        <button
          data-testid="delete-confirm"
          onClick={() => {
            onPlanDeleted((prevPlans: Plan[]) => prevPlans.filter((plan) => plan.id !== planId));
            onClose();
          }}
        >
          Delete
        </button>
      </div>
    );
  };
});

jest.mock('lucide-react', () => ({
  Plus: () => <svg data-testid="plus-icon" />,
}));

// Mock global fetch with the correct API response structure
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true, plans: [] }),
  })
) as jest.Mock;

describe('PlansWithSearch Component', () => {
  const mockPlans: Plan[] = [
    {
      id: '1',
      name: 'Basic Plan',
      price: '10',
      isActive: true,
      no_stores: "1",
      commission_rate: 5,
      features: ['Feature 1'],
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      deleted_at: null,
    },
    {
      id: '2',
      name: 'Pro Plan',
      price: '20',
      isActive: true,
      no_stores: "3",
      commission_rate: 3,
      features: ['Feature 2'],
      created_at: '2023-01-02T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
      deleted_at: null,
    },
    {
      id: '3',
      name: 'Draft Plan',
      price: '15',
      isActive: false,
      no_stores: "2",
      commission_rate: 4,
      features: ['Feature 3'],
      created_at: '2023-01-03T00:00:00Z',
      updated_at: '2023-01-03T00:00:00Z',
      deleted_at: null,
    },
  ];

  const defaultProps = {
    initialPlans: mockPlans,
    initialError: null,
    cookieHeader: 'mock-cookie',
  };

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('renders active and inactive plans sections', () => {
    render(<PlansWithSearch {...defaultProps} />);
    expect(screen.getByText('Active Plans')).toBeInTheDocument();
    expect(screen.getByText('Drafts')).toBeInTheDocument();
    expect(screen.getByText('Basic Plan')).toBeInTheDocument();
    expect(screen.getByText('Pro Plan')).toBeInTheDocument();
    expect(screen.getByText('Draft Plan')).toBeInTheDocument();
  });

  it('filters plans based on search input', async () => {
    const user = userEvent.setup();
    render(<PlansWithSearch {...defaultProps} />);
    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'Pro');
    expect(screen.getByText('Pro Plan')).toBeInTheDocument();
    expect(screen.queryByText('Basic Plan')).not.toBeInTheDocument();
    expect(screen.queryByText('Draft Plan')).not.toBeInTheDocument();
  });

  it('shows "No plans found" when search yields no results', async () => {
    const user = userEvent.setup();
    render(<PlansWithSearch {...defaultProps} />);
    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'Nonexistent');
    expect(screen.getByText('No plans found')).toBeInTheDocument();
    expect(screen.queryByText('Basic Plan')).not.toBeInTheDocument();
  });

  it('opens PlanModal when clicking "Add New Plan"', async () => {
    const user = userEvent.setup();
    render(<PlansWithSearch {...defaultProps} />);
    const addButton = screen.getByText('Add New Plan');
    await user.click(addButton);
    expect(screen.getByTestId('plan-modal')).toBeInTheDocument();
  });

  it('adds a new plan via PlanModal', async () => {
    const user = userEvent.setup();
    render(<PlansWithSearch {...defaultProps} />);
    
    const newPlan = {
      id: 'new-plan',
      name: 'New Plan',
      price: '50',
      isActive: true,
      no_stores: "5",
      commission_rate: 2,
      features: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };

    // Mock fetch response for GET /api/plan after saving
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, plans: [...mockPlans, newPlan] }),
      })
    );

    const addButton = screen.getByText('Add New Plan');
    await user.click(addButton);
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    // Wait for the new plan to appear
    await screen.findByText('New Plan', {}, { timeout: 3000 });
    expect(screen.getByText('New Plan')).toBeInTheDocument();

    // Debug if it fails
    if (!screen.queryByText('New Plan')) {
      console.log('Fetch mock called:', (global.fetch as jest.Mock).mock.calls);
      console.log('Fetch mock response:', await (await (global.fetch as jest.Mock).mock.results[0].value).json());
      console.log('DOM after save:', screen.debug());
    }
  });

  it('opens DeletePlanModal when clicking "Delete" on a plan', async () => {
    const user = userEvent.setup();
    render(<PlansWithSearch {...defaultProps} />);
    const deleteButton = within(screen.getByText('Basic Plan').closest('.card')!).getByText('Delete');
    await user.click(deleteButton);
    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
  });

  it('deletes a plan via DeletePlanModal', async () => {
    const user = userEvent.setup();
    render(<PlansWithSearch {...defaultProps} />);
    
    // Mock fetch response for GET /api/plan after deletion
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, plans: mockPlans.filter((plan) => plan.id !== '1') }),
      })
    );

    const deleteButton = within(screen.getByText('Basic Plan').closest('.card')!).getByText('Delete');
    await user.click(deleteButton);
    const deleteConfirm = screen.getByTestId('delete-confirm');
    await user.click(deleteConfirm);

    // Wait for the updated state to reflect
    await screen.findByText('Pro Plan', {}, { timeout: 3000 });
    expect(screen.queryByText('Basic Plan')).not.toBeInTheDocument();
    expect(screen.getByText('Pro Plan')).toBeInTheDocument();

    // Debug if it fails
    if (!screen.queryByText('Pro Plan')) {
      console.log('Fetch mock called:', (global.fetch as jest.Mock).mock.calls);
      console.log('Fetch mock response:', await (await (global.fetch as jest.Mock).mock.results[0].value).json());
      console.log('DOM after delete:', screen.debug());
    }
  });

  it('displays error message when initialError is provided', () => {
    render(<PlansWithSearch {...defaultProps} initialError="Failed to load plans" />);
    expect(screen.getByText('Failed to load plans')).toBeInTheDocument();
  });

  it('shows "No plans in this section" when a section is empty', () => {
    const noActivePlans = mockPlans.filter((plan) => !plan.isActive);
    render(<PlansWithSearch {...defaultProps} initialPlans={noActivePlans} />);
    const activeSection = screen.getByText('Active Plans').parentElement!;
    expect(within(activeSection).getByText('No plans in this section.')).toBeInTheDocument();
  });
});