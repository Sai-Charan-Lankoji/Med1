// app/tests/components/pages/login.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import LoginPage from '@/app/page';
import { toast } from 'react-toastify';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => null,
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Basic Rendering Tests
  test('renders login form with all elements', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  // Form Validation Tests
  test('shows email validation error when email is invalid', async () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('Email');
    await userEvent.type(emailInput, 'invalid-email');
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  test('shows password validation error when password is too short', async () => {
    render(<LoginPage />);
    
    const passwordInput = screen.getByLabelText('Password');
    await userEvent.type(passwordInput, 'short');
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  test('shows password requirements when typing password', async () => {
    render(<LoginPage />);
    
    const passwordInput = screen.getByLabelText('Password');
    await userEvent.type(passwordInput, 'Test123!');

    await waitFor(() => {
      expect(screen.getByText('Password requirements:')).toBeInTheDocument();
      expect(screen.getByText('At least 6 characters')).toBeInTheDocument();
      expect(screen.getByText('At least one uppercase letter')).toBeInTheDocument();
      expect(screen.getByText('At least one number')).toBeInTheDocument();
      expect(screen.getByText('At least one special character')).toBeInTheDocument();
    });
  });

  // Form Submission Tests
  test('successful login redirects to vendors page', async () => {
    const mockRouterPush = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      push: mockRouterPush,
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    render(<LoginPage />);
    
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'Password123!');
    await userEvent.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Login Successful!', expect.any(Object));
      expect(mockRouterPush).toHaveBeenCalledWith('/admin/vendors');
    });
  });

  test('shows error on failed login', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Invalid credentials' }),
    });

    render(<LoginPage />);
    
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'WrongPass123!');
    await userEvent.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials', expect.any(Object));
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  // Forgot Password Tests
  test('opens and closes forgot password modal', async () => {
    render(<LoginPage />);
    
    await userEvent.click(screen.getByText('Forgot password?'));
    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    
    await userEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByText('Forgot Password')).not.toBeInTheDocument();
    });
  });

  test('handles forgot password submission successfully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    render(<LoginPage />);
    
    await userEvent.click(screen.getByText('Forgot password?'));
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.click(screen.getByText('Send Reset Link'));

    await waitFor(() => {
      expect(screen.getByText('Password reset link sent to your email!')).toBeInTheDocument();
    });
  });

  test('shows error for invalid email in forgot password', async () => {
    render(<LoginPage />);
    
    await userEvent.click(screen.getByText('Forgot password?'));
    await userEvent.type(screen.getByLabelText('Email'), 'invalid-email');
    await userEvent.click(screen.getByText('Send Reset Link'));

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  // Password Visibility Toggle Test
  test('toggles password visibility', async () => {
    render(<LoginPage />);
    
    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByRole('button', { name: /eye/i });

    expect(passwordInput).toHaveAttribute('type', 'password');
    
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});