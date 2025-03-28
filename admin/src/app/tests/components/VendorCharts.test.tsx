import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MonthlyRevenue, StoreData } from '@/app/types/types';
import { VendorCharts } from '../../components/VendorCharts';

// Mock recharts components
jest.mock('recharts', () => ({
  LineChart: ({ children, width, height, data }: { children: React.ReactNode; width: number; height: number; data: unknown }) => (
    <div data-testid="line-chart" style={{ width, height }}>
      {JSON.stringify(data)}
      {children}
    </div>
  ),
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  PieChart: ({ children, width, height }: { children: React.ReactNode; width: number; height: number }) => (
    <div data-testid="pie-chart" style={{ width, height }}>
      {children}
    </div>
  ),
  Pie: ({ data, children }: { data: unknown; children: React.ReactNode }) => (
    <div data-testid="pie">{JSON.stringify(data)}{children}</div>
  ),
  Cell: () => <div data-testid="cell" />,
}));

describe('VendorCharts Component', () => {
  const mockMonthlyRevenue: MonthlyRevenue[] = [
    { month: 'Jan', revenue: '1000.50' },
    { month: 'Feb', revenue: '1500.75' },
  ];

  const mockStores: StoreData[] = [
    {
      store_id: '1',
      store_name: 'Store A',
      total_revenue: 2000,
      total_commission: 100,
      orders_count: 10,
    },
    {
      store_id: '2',
      store_name: 'Store B',
      total_revenue: 3000,
      total_commission: 150,
      orders_count: 15,
    },
  ];

  // Test 1: Renders loading state initially
  it('displays loading spinner before mounting', () => {
    const useEffectSpy = jest.spyOn(React, 'useEffect');
    useEffectSpy.mockImplementationOnce(() => {
      // Prevent effect from running
    });

    render(<VendorCharts monthlyRevenue={mockMonthlyRevenue} stores={mockStores} />);
    // Use querySelector to find the loading div since it has no role or testid by default
    const loadingSpinner = screen.getByText((content, element) => 
      element?.className === 'loading loading-spinner loading-lg text-primary'
    );
    expect(loadingSpinner).toBeInTheDocument();
    expect(loadingSpinner).toHaveClass('loading loading-spinner loading-lg text-primary');

    useEffectSpy.mockRestore();
  });

  // Test 2: Renders charts after mounting
  it('renders charts after component mounts', async () => {
    await act(async () => {
      render(<VendorCharts monthlyRevenue={mockMonthlyRevenue} stores={mockStores} />);
    });

    expect(screen.getByText('Monthly Revenue Trend')).toBeInTheDocument();
    expect(screen.getByText('Revenue by Store')).toBeInTheDocument();

    const lineChart = screen.getByTestId('line-chart');
    expect(lineChart).toBeInTheDocument();
    const lineChartJson = lineChart.textContent?.match(/\[.*?\]/)?.[0];
    expect(lineChartJson).toBeDefined();
    const lineChartData = JSON.parse(lineChartJson!);
    expect(lineChartData).toEqual([
      { month: 'Jan', revenue: 1000.5 },
      { month: 'Feb', revenue: 1500.75 },
    ]);

    const pieChart = screen.getByTestId('pie-chart');
    expect(pieChart).toBeInTheDocument();
    const pieJson = screen.getByTestId('pie').textContent?.match(/\[.*?\]/)?.[0];
    expect(pieJson).toBeDefined();
    const pieData = JSON.parse(pieJson!);
    expect(pieData).toEqual([
      { name: 'Store A', value: 2000 },
      { name: 'Store B', value: 3000 },
    ]);
  });

  // Test 3: Handles empty data
  it('renders charts with empty data', async () => {
    await act(async () => {
      render(<VendorCharts monthlyRevenue={[]} stores={[]} />);
    });

    expect(screen.getByText('Monthly Revenue Trend')).toBeInTheDocument();
    expect(screen.getByText('Revenue by Store')).toBeInTheDocument();

    const lineChart = screen.getByTestId('line-chart');
    const lineChartJson = lineChart.textContent?.match(/\[.*?\]/)?.[0];
    expect(lineChartJson).toBeDefined();
    const lineChartData = JSON.parse(lineChartJson!);
    expect(lineChartData).toEqual([]);

    const pie = screen.getByTestId('pie');
    const pieJson = pie.textContent?.match(/\[.*?\]/)?.[0];
    expect(pieJson).toBeDefined();
    const pieData = JSON.parse(pieJson!);
    expect(pieData).toEqual([]);
  });

  // Test 4: Verifies chart components are present
  it('includes all chart subcomponents', async () => {
    await act(async () => {
      render(<VendorCharts monthlyRevenue={mockMonthlyRevenue} stores={mockStores} />);
    });

    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getAllByTestId('tooltip')).toHaveLength(2);
    expect(screen.getAllByTestId('legend')).toHaveLength(2);
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
    expect(screen.getAllByTestId('cell')).toHaveLength(2);
  });
});