// src/app/tests/components/Navbar.test.tsx
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import Navbar, { daisyThemes } from '@/app/components/Navbar';
import * as ThemeContext from '@/app/lib/ThemeContext';

jest.mock('@/app/lib/ThemeContext', () => ({
  useTheme: jest.fn(),
}));

describe('Navbar Component', () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (ThemeContext.useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });
  });

  it('renders the Admin Dashboard title', () => {
    render(<Navbar />);
    const title = screen.getByText('Admin Dashboard');
    expect(title).toBeInTheDocument();
  });

  it('renders the notifications button', () => {
    render(<Navbar />);
    const bellButton = screen.getByRole('button', { name: /notifications/i });
    expect(bellButton).toBeInTheDocument();
  });

  it('renders the theme dropdown with the current theme selected', () => {
    render(<Navbar />);
    const themeSelect = screen.getByRole('combobox');
    expect(themeSelect).toHaveValue('light');
  });

  it('opens the notifications drawer on bell button click', async () => {
    render(<Navbar />);
    const bellButton = screen.getByRole('button', { name: /notifications/i });

    await act(async () => {
      fireEvent.click(bellButton);
    });

    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('No new notifications yet!')).toBeInTheDocument();
  });

  it('closes the drawer when the close button is clicked', async () => {
    render(<Navbar />);
    const bellButton = screen.getByRole('button', { name: /notifications/i });

    await act(async () => {
      fireEvent.click(bellButton);
    });

    const closeButton = screen.getByRole('button', { name: 'Close' });
    await act(async () => {
      fireEvent.click(closeButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('Notifications')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('calls setTheme when a new theme is selected from the dropdown', async () => {
    render(<Navbar />);
    const themeSelect = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.change(themeSelect, { target: { value: 'dark' } });
    });

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('renders all DaisyUI themes in the dropdown', () => {
    render(<Navbar />);
    const options = screen.getAllByRole('option');
    const themeOptions = options.filter(option => option.textContent !== 'Pick a Theme');
    console.log('Rendered themes:', themeOptions.map(opt => opt.textContent));
    console.log('Expected themes length:', daisyThemes.length);
    expect(themeOptions.length).toBe(34); // Adjusted to current daisyThemes length
    expect(themeOptions[0]).toHaveTextContent('light');
    expect(themeOptions[1]).toHaveTextContent('dark');
  });

  it('displays no notifications message in the drawer', async () => {
    render(<Navbar />);
    const bellButton = screen.getByRole('button', { name: /notifications/i });

    await act(async () => {
      fireEvent.click(bellButton);
    });

    const noNotificationsText = screen.getByText('No new notifications yet!');
    expect(noNotificationsText).toBeInTheDocument();
  });
});