import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlanModal from '../../components/PlanModal';
import { Plan } from '@/app/api/plan/route';

// Mock the fetch API
global.fetch = jest.fn();

describe('PlanModal Component', () => {
  const mockPlan: Plan = {
    id: '1',
    name: 'Basic Plan',
    price: '10',
    description: 'Basic subscription',
    features: ['Feature 1', 'Feature 2'],
    discount: 10,
    isActive: true,
    no_stores: '5',
    commission_rate: 5,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    deleted_at: null,
  };

  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    plan: null,
    onPlanSaved: jest.fn(),
    cookieHeader: 'mock-cookie',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders the modal when isOpen is true', () => {
    render(<PlanModal {...defaultProps} />);
    expect(screen.getByText('Add New Plan')).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')[0]).toBeInTheDocument(); // Name
    expect(screen.getAllByRole('spinbutton')[0]).toBeInTheDocument(); // Price
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<PlanModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Add New Plan')).not.toBeInTheDocument();
  });

  it('renders edit mode with pre-filled form data', () => {
    render(<PlanModal {...defaultProps} plan={mockPlan} />);
    expect(screen.getByText('Edit Plan')).toBeInTheDocument();
    const textboxes = screen.getAllByRole('textbox');
    const spinbuttons = screen.getAllByRole('spinbutton');
    expect(textboxes[0]).toHaveValue('Basic Plan'); // Name
    expect(textboxes[1]).toHaveValue('Basic subscription'); // Description
    expect(spinbuttons[0]).toHaveValue(10); // Price
    expect(textboxes[2]).toHaveValue('Feature 1,Feature 2'); // Features
    expect(textboxes[3]).toHaveValue('5'); // Number of Stores
    expect(spinbuttons[2]).toHaveValue(5); // Commission Rate
    expect(spinbuttons[1]).toHaveValue(10); // Discount
    expect(screen.getByRole('checkbox', { name: /active/i })).toBeChecked();
  });

  it('updates form fields on user input', async () => {
    const user = userEvent.setup();
    render(<PlanModal {...defaultProps} />);
    const textboxes = screen.getAllByRole('textbox');
    const spinbuttons = screen.getAllByRole('spinbutton');

    await user.type(textboxes[0], 'New Plan'); // Name
    await user.type(textboxes[1], 'Test description'); // Description
    await user.type(spinbuttons[0], '20'); // Price
    await user.type(textboxes[2], 'Feat1,Feat2'); // Features
    await user.type(textboxes[3], '3'); // Number of Stores
    await user.type(spinbuttons[2], '4'); // Commission Rate
    await user.type(spinbuttons[1], '15'); // Discount
    await user.click(screen.getByRole('checkbox', { name: /active/i }));

    expect(textboxes[0]).toHaveValue('New Plan');
    expect(textboxes[1]).toHaveValue('Test description');
    expect(spinbuttons[0]).toHaveValue(20);
    expect(textboxes[2]).toHaveValue('Feat1,Feat2');
    expect(textboxes[3]).toHaveValue('3');
    expect(spinbuttons[2]).toHaveValue(4);
    expect(spinbuttons[1]).toHaveValue(15);
    expect(screen.getByRole('checkbox', { name: /active/i })).toBeChecked();
  });

  it('creates a new plan successfully', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<PlanModal {...defaultProps} />);
    const textboxes = screen.getAllByRole('textbox');
    const spinbuttons = screen.getAllByRole('spinbutton');

    await user.type(textboxes[0], 'New Plan'); // Name
    await user.type(spinbuttons[0], '20'); // Price
    await user.type(textboxes[3], '3'); // Number of Stores
    await user.type(spinbuttons[2], '4'); // Commission Rate
    await user.type(textboxes[2], 'Feat1,Feat2'); // Features
    await user.type(spinbuttons[1], '15'); // Discount
    await user.click(screen.getByRole('checkbox', { name: /active/i }));
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: 'mock-cookie',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: 'New Plan',
          price: '20',
          description: '',
          features: ['Feat1', 'Feat2'],
          discount: 15,
          isActive: true,
          no_stores: '3',
          commission_rate: 4,
        }),
      });
      expect(defaultProps.onPlanSaved).toHaveBeenCalled();
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it('updates an existing plan successfully', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<PlanModal {...defaultProps} plan={mockPlan} />);
    const textboxes = screen.getAllByRole('textbox');

    await user.clear(textboxes[0]); // Name
    await user.type(textboxes[0], 'Updated Plan');
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/plan?id=1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: 'mock-cookie',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: 'Updated Plan',
          price: '10',
          description: 'Basic subscription',
          features: ['Feature 1', 'Feature 2'],
          discount: 10,
          isActive: true,
          no_stores: '5',
          commission_rate: 5,
        }),
      });
      expect(defaultProps.onPlanSaved).toHaveBeenCalled();
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it('shows error on create failure', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Create failed' }),
    });

    render(<PlanModal {...defaultProps} />);
    const textboxes = screen.getAllByRole('textbox');
    const spinbuttons = screen.getAllByRole('spinbutton');

    await user.type(textboxes[0], 'New Plan'); // Name
    await user.type(spinbuttons[0], '20'); // Price
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText('Create failed')).toBeInTheDocument();
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });

  it('shows error on update failure', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Update failed' }),
    });

    render(<PlanModal {...defaultProps} plan={mockPlan} />);
    const textboxes = screen.getAllByRole('textbox');

    await user.type(textboxes[0], 'Updated Plan'); // Name
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText('Update failed')).toBeInTheDocument();
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });

  it('closes modal on cancel', async () => {
    const user = userEvent.setup();
    render(<PlanModal {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('disables buttons while loading', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ ok: true, json: async () => ({ success: true }) }), 100))
    );

    render(<PlanModal {...defaultProps} />);
    const textboxes = screen.getAllByRole('textbox');
    const spinbuttons = screen.getAllByRole('spinbutton');

    await user.type(textboxes[0], 'New Plan'); // Name
    await user.type(spinbuttons[0], '20'); // Price
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();

    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });
});