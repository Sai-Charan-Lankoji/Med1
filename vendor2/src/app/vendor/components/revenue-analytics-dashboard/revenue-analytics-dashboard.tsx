"use client";

import { useState, useEffect } from "react";
import { useVendorAnalytics } from "@/app/hooks/storeRevenue/useVendorAnalytics";
import { Building2, DollarSign, ShoppingCart, TrendingUp, Eye, ShoppingBag, Users, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { vendor_id } from "@/app/utils/constant";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import LoadingOverlay from "@/components/ui/LoadingOverlay";

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Animated counter component
const AnimatedCounter = ({ value, formatValue = (val) => val.toLocaleString(), duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const startValue = count;
    const endValue = value;
    
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(startValue + progress * (endValue - startValue));
      setCount(current);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value, duration,count]);

  return formatValue(count);
};

export default function RevenueAnalytics() {
  const [selectedMonth, setSelectedMonth] = useState("All");
  const { data, isLoading, isError } = useVendorAnalytics(vendor_id, selectedMonth);
  const months = ["All", "Dec", "Jan", "Feb", "Mar"];

  // Define chart colors - using explicit values that work well with Chart.js
  const chartColors = {
    // Use fixed colors that match daisyUI theme intent but render reliably
    primary: '#3b82f6',       // Blue
    primaryLight: 'rgba(59, 130, 246, 0.2)',
    secondary: '#f97316',     // Orange
    secondaryLight: 'rgba(249, 115, 22, 0.2)',
    accent: '#8b5cf6',        // Purple
    accentLight: 'rgba(139, 92, 246, 0.2)',
    success: '#10b981',       // Green
    successLight: 'rgba(16, 185, 129, 0.2)',
    warning: '#f59e0b',       // Amber
    warningLight: 'rgba(245, 158, 11, 0.2)',
    error: '#ef4444',         // Red
    errorLight: 'rgba(239, 68, 68, 0.2)',
    info: '#06b6d4',          // Cyan
    infoLight: 'rgba(6, 182, 212, 0.2)',
    neutral: '#6b7280',       // Gray
    neutralLight: 'rgba(107, 114, 128, 0.2)',
    background: '#ffffff',
    text: '#111827',
    textLight: 'rgba(17, 24, 39, 0.7)',
    border: 'rgba(229, 231, 235, 0.5)'
  };

  // Loading state
  if (isLoading) {
    return (
      // <div className="flex items-center justify-center min-h-[60vh] ">
      //   <span className="loading loading-spinner loading-lg text-primary"></span>
      // </div>
      <LoadingOverlay isLoading={isLoading} />
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="alert alert-error max-w-xl mx-auto my-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Error loading analytics data. Please try again later.</span>
      </div>
    );
  }

  if (!data) return null;

  // Prepare chart data with explicit colors
  const monthlyRevenueData = {
    labels: data.commission.monthly_revenue.map(item => item.month),
    datasets: [
      {
        label: 'Revenue',
        data: data.commission.monthly_revenue.map(item => item.revenue),
        borderColor: chartColors.primary,
        backgroundColor: chartColors.primaryLight,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: chartColors.primary,
        pointBorderColor: chartColors.background,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
  };
  
  const revenueDistributionData = {
    labels: ['Final Revenue', 'Admin Commission', 'Non-commissionable'],
    datasets: [
      {
        data: [
          Number.parseFloat(data.commission.final_vendor_revenue),
          Number.parseFloat(data.commission.total_admin_commission),
          Number.parseFloat(data.commission.non_commissionable_revenue)
        ],
        backgroundColor: [
          chartColors.primary,
          chartColors.secondary,
          chartColors.accent
        ],
        borderColor: chartColors.background,
        borderWidth: 2,
        hoverOffset: 15,
      }
    ]
  };
  
  const storeRevenueData = {
    labels: data.commission.stores.map(store => store.store_name),
    datasets: [
      {
        label: 'Revenue',
        data: data.commission.stores.map(store => store.total_revenue),
        backgroundColor: chartColors.primary,
        borderRadius: 6,
      },
      {
        label: 'Commission',
        data: data.commission.stores.map(store => store.total_commission),
        backgroundColor: chartColors.secondary,
        borderRadius: 6,
      }
    ]
  };
  
  const topSellingData = {
    labels: data.products.top_selling_products.map(p => p.product_name),
    datasets: [
      {
        label: 'Revenue',
        data: data.products.top_selling_products.map(p => Number.parseFloat(p.total_revenue)),
        backgroundColor: chartColors.accent,
        borderRadius: 6,
      }
    ]
  };

  const mostViewedData = {
    labels: data.products.most_viewed_products.map(p => p.product_name),
    datasets: [
      {
        label: 'Views',
        data: data.products.most_viewed_products.map(p => p.view_count),
        backgroundColor: chartColors.success,
        borderRadius: 6,
      }
    ]
  };

  // Chart options with explicit colors
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          color: chartColors.text,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          padding: 16
        }
      },
      tooltip: {
        backgroundColor: chartColors.neutral,
        titleColor: chartColors.background,
        bodyColor: chartColors.background,
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        usePointStyle: true,
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: chartColors.textLight,
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: chartColors.border,
          drawBorder: false
        },
        ticks: {
          color: chartColors.textLight,
          font: {
            family: "'Inter', sans-serif",
            size: 11
          },
          callback: (value) => {
            if (value >= 1000) {
              return `$${value / 1000}k`;
            }
            return `$${value}`;
          }
        }
      }
    }
  };
  
  const horizontalBarOptions = {
    ...chartOptions,
    indexAxis: 'y' as const,
    scales: {
      ...chartOptions.scales,
      x: {
        ...chartOptions.scales.x,
        ticks: {
          ...chartOptions.scales.x.ticks,
          callback: (value) => {
            if (value >= 1000) {
              return `$${value / 1000}k`;
            }
            return `$${value}`;
          }
        }
      }
    },
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        display: false
      }
    }
  };
  
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          color: chartColors.text,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          padding: 16
        }
      },
      tooltip: chartOptions.plugins.tooltip
    }
  };

  return (
    <div className=" container flex-1 space-y-6 p-4 md:p-8 bg-base-200">
      {/* Header with Filter Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-primary flex items-center gap-2">
          <DollarSign className="w-8 h-8" />
          Revenue & Analytics
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-base-content/70 flex items-center gap-1">
            <Calendar className="w-4 h-4" /> Period:
          </span>
          <div className="join">
            {months.map((month) => (
              <button
                key={month}
                className={`btn btn-sm join-item ${selectedMonth === month ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setSelectedMonth(month)}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <div className="card card-border bg-base-100">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-base-content/70">Total Revenue</h3>
                <div className="p-2 bg-primary/20 rounded-full">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-primary mt-2">
                $<AnimatedCounter value={Number(data.commission.total_vendor_revenue)} 
                  formatValue={(value) => value.toLocaleString(undefined, { minimumFractionDigits: 2 })} />
              </div>
              <div className="text-xs text-base-content/60 mt-2 flex items-center">
                <span className="badge badge-primary badge-xs mr-1"></span>
                Final: $<AnimatedCounter value={Number(data.commission.final_vendor_revenue)} 
                  formatValue={(value) => value.toLocaleString(undefined, { minimumFractionDigits: 2 })} />
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={item}>
          <div className="card card-border bg-base-100">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-base-content/70">Total Orders</h3>
                <div className="p-2 bg-warning/20 rounded-full">
                  <ShoppingCart className="w-5 h-5 text-warning" />
                </div>
              </div>
              <div className="text-3xl font-bold text-warning mt-2">
                <AnimatedCounter value={data.commission.total_orders} />
              </div>
              <div className="text-xs text-base-content/60 mt-2 flex items-center">
                <span className="badge badge-warning badge-xs mr-1"></span>
                Commission: <AnimatedCounter value={data.commission.commission_total_orders} />
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={item}>
          <div className="card card-border bg-base-100">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-base-content/70">Commission Rate</h3>
                <div className="p-2 bg-success/20 rounded-full">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
              </div>
              <div className="text-3xl font-bold text-success mt-2">{data.commission.commission_rate}</div>
              <div className="text-xs text-base-content/60 mt-2 flex items-center">
                <span className="badge badge-success badge-xs mr-1"></span>
                Total: $<AnimatedCounter value={Number(data.commission.total_admin_commission)} 
                  formatValue={(value) => value.toLocaleString(undefined, { minimumFractionDigits: 2 })} />
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={item}>
          <div className="card card-border bg-base-100">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-base-content/70">Active Stores</h3>
                <div className="p-2 bg-secondary/20 rounded-full">
                  <Building2 className="w-5 h-5 text-secondary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-secondary mt-2">
                <AnimatedCounter value={data.commission.stores.length} />
              </div>
              <div className="text-xs text-base-content/60 mt-2 flex items-center">
                <span className="badge badge-secondary badge-xs mr-1"></span>
                Contributing to revenue
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Engagement Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <div className="card card-border bg-base-100">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-base-content/70">Product Views</h3>
                <div className="p-2 bg-info/20 rounded-full">
                  <Eye className="w-5 h-5 text-info" />
                </div>
              </div>
              <div className="text-3xl font-bold text-info mt-2">
                <AnimatedCounter value={data.engagement.product_views} />
              </div>
              <div className="text-xs text-base-content/60 mt-2 flex items-center">
                <span className="badge badge-info badge-xs mr-1"></span>
                Total page impressions
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={item}>
          <div className="card card-border bg-base-100">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-base-content/70">Cart Abandonment</h3>
                <div className="p-2 bg-error/20 rounded-full">
                  <ShoppingBag className="w-5 h-5 text-error" />
                </div>
              </div>
              <div className="text-3xl font-bold text-error mt-2">
                {data.engagement.cart_abandonment.abandonment_rate}%
              </div>
              <div className="text-xs text-base-content/60 mt-2 flex items-center">
                <span className="badge badge-error badge-xs mr-1"></span>
                Carts: <AnimatedCounter value={data.engagement.cart_abandonment.total_carts} />
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={item}>
          <div className="card card-border bg-base-100">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-base-content/70">Repeat Customers</h3>
                <div className="p-2 bg-accent/20 rounded-full">
                  <Users className="w-5 h-5 text-accent" />
                </div>
              </div>
              <div className="text-3xl font-bold text-accent mt-2">
                <AnimatedCounter value={data.engagement.repeat_purchases.repeat_customer_count} />
              </div>
              <div className="text-xs text-base-content/60 mt-2 flex items-center">
                <span className="badge badge-accent badge-xs mr-1"></span>
                Orders: <AnimatedCounter value={data.engagement.repeat_purchases.total_orders_by_repeat_customers} />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Monthly Revenue */}
        <div className="card card-border bg-base-100">
          <div className="card-body bg-base-200/50 p-4">
            <h3 className="card-title text-base-content text-lg">Monthly Revenue</h3>
          </div>
          <div className="card-body p-6">
            <div className="h-[300px] w-full">
              <Line data={monthlyRevenueData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Revenue Distribution */}
        <div className="card card-border bg-base-100">
          <div className="card-body bg-base-200/50 p-4">
            <h3 className="card-title text-base-content text-lg">Revenue Distribution</h3>
          </div>
          <div className="card-body p-6 flex items-center justify-center">
            <div className="h-[300px] w-full max-w-md">
              <Doughnut data={revenueDistributionData} options={pieOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Store Revenue */}
      <div className="card card-border bg-base-100">
        <div className="card-body bg-base-200/50 p-4">
          <h3 className="card-title text-base-content text-lg">Store-wise Revenue</h3>
        </div>
        <div className="card-body p-6">
          <div className="h-[400px] w-full">
            <Bar data={storeRevenueData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Product Insights */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Top Selling */}
        <div className="card card-border bg-base-100">
          <div className="card-body bg-base-200/50 p-4">
            <h3 className="card-title text-base-content text-lg">Top Selling Products</h3>
          </div>
          <div className="card-body p-6">
            <div className="h-[300px] w-full">
              <Bar data={topSellingData} options={horizontalBarOptions} />
            </div>
          </div>
        </div>

        {/* Most Viewed */}
        <div className="card card-border bg-base-100">
          <div className="card-body bg-base-200/50 p-4">
            <h3 className="card-title text-base-content text-lg">Most Viewed Products</h3>
          </div>
          <div className="card-body p-6">
            <div className="h-[300px] w-full">
              <Bar data={mostViewedData} options={horizontalBarOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}