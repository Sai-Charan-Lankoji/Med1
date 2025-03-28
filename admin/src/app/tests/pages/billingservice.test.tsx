import { render, screen } from "@testing-library/react";
import BillingServicesPage from "@/app/admin/billingServices/page";
import { headers } from "next/headers";
import { getAllVendors, getOverallAnalytics, Vendor, AnalyticsData } from "@/app/api/billingServices/route";

// Mock headers
jest.mock("next/headers", () => ({
  headers: jest.fn(),
}));

// Mock API calls
jest.mock("@/app/api/billingServices/route", () => ({
  getAllVendors: jest.fn(),
  getOverallAnalytics: jest.fn(),
}));

// Mock AnimatedNumber
jest.mock("@/app/components/AnimatedNumber", () => ({
  AnimatedNumber: ({ value, decimals, prefix }: { value: number; decimals?: number; prefix?: string }) => (
    <span>{`${prefix || ""}${value.toFixed(decimals || 0)}`}</span>
  ),
}));

describe("BillingServicesPage", () => {
  const mockVendors: Vendor[] = [
    {
      id: "1",
      company_name: "VendorCorp",
      contact_name: "John Doe",
      contact_email: "john@vendorcorp.com",
      plan: "Basic",
      business_type: "Retail",
      registered_number: "12345",
      status: "active",
      contact_phone_number: "123-456-7890",
      tax_number: "TAX123",
      plan_id: "plan1",
      next_billing_date: "2025-04-01",
      createdAt: "2023-01-01",
      updatedAt: "2023-01-02",
      deletedAt: null,
      address: [],
    },
  ];

  const mockAnalytics: AnalyticsData = {
    total_vendors: 1,
    total_orders: 10,
    commission_total_orders: 5,
    total_vendor_revenue: "1000",
    total_admin_commission: "100",
    non_commissionable_revenue: "200",
    final_vendor_revenue: "800",
    monthly_revenue: [{ month: "2025-01", revenue: "500" }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders error message when fetch fails", async () => {
    (headers as jest.Mock).mockReturnValue(new Map([["cookie", "mock-cookie"]]));
    (getAllVendors as jest.Mock).mockRejectedValue(new Error("Fetch failed"));
    (getOverallAnalytics as jest.Mock).mockResolvedValue(mockAnalytics);

    render(await BillingServicesPage());
    expect(screen.getByText("Fetch failed")).toBeInTheDocument();
    expect(screen.queryByText("Billing Services")).not.toBeInTheDocument();
  });

  it("renders no vendors message when vendors array is empty", async () => {
    (headers as jest.Mock).mockReturnValue(new Map([["cookie", "mock-cookie"]]));
    (getAllVendors as jest.Mock).mockResolvedValue([]);
    (getOverallAnalytics as jest.Mock).mockResolvedValue({
      total_vendors: 0,
      total_orders: 0,
      commission_total_orders: 0,
      total_vendor_revenue: "0",
      total_admin_commission: "0",
      non_commissionable_revenue: "0",
      final_vendor_revenue: "0",
      monthly_revenue: [],
    });

    render(await BillingServicesPage());
    expect(screen.getByText("No vendors available.")).toBeInTheDocument();
    expect(screen.queryByText("Billing Services")).not.toBeInTheDocument();
  });

  it("renders stats and vendor table on successful fetch", async () => {
    (headers as jest.Mock).mockReturnValue(new Map([["cookie", "mock-cookie"]]));
    (getAllVendors as jest.Mock).mockResolvedValue(mockVendors);
    (getOverallAnalytics as jest.Mock).mockResolvedValue(mockAnalytics);

    render(await BillingServicesPage());

    // Check header
    expect(screen.getByText("Billing Services")).toBeInTheDocument();
    expect(screen.getByText("Overall financial summary and vendor details")).toBeInTheDocument();

    // Check stats
    expect(screen.getByText("Total Vendors")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Total Orders")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Total Vendor Revenue")).toBeInTheDocument();
    expect(screen.getByText("$1000.00")).toBeInTheDocument();
    expect(screen.getByText("Total Admin Commission")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.getByText("Commissionable Orders")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Non-Commissionable Revenue")).toBeInTheDocument();
    expect(screen.getByText("$200.00")).toBeInTheDocument();
    expect(screen.getByText("Final Vendor Revenue")).toBeInTheDocument();
    expect(screen.getByText("$800.00")).toBeInTheDocument();

    // Check table
    expect(screen.getByText("Company Name")).toBeInTheDocument();
    expect(screen.getByText("VendorCorp")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@vendorcorp.com")).toBeInTheDocument();
    expect(screen.getByText("Basic")).toBeInTheDocument();
    expect(screen.getByText("Retail")).toBeInTheDocument();
  });
});