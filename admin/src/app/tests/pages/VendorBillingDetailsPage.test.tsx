import { render, screen } from "@testing-library/react";
import VendorBillingDetailsPage from "@/app/admin/billingServices/[vendorId]/page";
import { headers } from "next/headers";
import { getAnalyticsByVendor, VendorAnalyticsData } from "@/app/api/billingServices/route";

// Mock headers
jest.mock("next/headers", () => ({
  headers: jest.fn(),
}));

// Mock API call
jest.mock("@/app/api/billingServices/route", () => ({
  getAnalyticsByVendor: jest.fn(),
}));

// Mock components
jest.mock("@/app/components/VendorCharts", () => ({
  VendorCharts: () => (
    <div data-testid="vendor-charts">Charts</div>
  ),
}));

// Fix: Mock NotifyButton as a direct function, not an object with default
jest.mock("@/app/components/NotifyButton", () => ({
  __esModule: true,
  default: () => (
    <button data-testid="notify-button">Notify</button>
  ),
}));

describe("VendorBillingDetailsPage", () => {
  const mockAnalytics: VendorAnalyticsData = {
    vendor_id: "1",
    vendor_name: "VendorCorp",
    commission_rate: "10",
    stores: [
      {
        store_id: "s1",
        store_name: "Store 1",
        total_revenue: 500,
        total_commission: 50,
        orders_count: 5,
      },
    ],
    monthly_revenue: [{ month: "2025-01", revenue: "500" }],
    next_billing_date: "2025-04-01",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders error message when fetch fails", async () => {
    (headers as jest.Mock).mockReturnValue(new Map([["cookie", "mock-cookie"]]));
    (getAnalyticsByVendor as jest.Mock).mockRejectedValue(new Error("Fetch failed"));

    render(await VendorBillingDetailsPage({ params: { vendorId: "1" } }));
    expect(screen.getByText("Fetch failed")).toBeInTheDocument();
    expect(screen.queryByText("VendorCorp Billing Details")).not.toBeInTheDocument();
  });

  // it("renders vendor details and stats on successful fetch", async () => {
  //   (headers as jest.Mock).mockReturnValue(new Map([["cookie", "mock-cookie"]]));
  //   (getAnalyticsByVendor as jest.Mock).mockResolvedValue(mockAnalytics);

  //   render(await VendorBillingDetailsPage({ params: { vendorId: "1" } }));

  //   // Header
  //   expect(screen.getByText("VendorCorp Billing Details")).toBeInTheDocument();
  //   expect(screen.getByText("Advanced financial overview")).toBeInTheDocument();

  //   // Stats
  //   expect(screen.getByText("Commission Rate")).toBeInTheDocument();
  //   expect(screen.getByText("10%")).toBeInTheDocument();
  //   expect(screen.getByText("Total Stores")).toBeInTheDocument();
  //   expect(screen.getByText("1")).toBeInTheDocument();
  //   expect(screen.getByText("Next Billing Date")).toBeInTheDocument();
  //   expect(screen.getByText("04/01/2025")).toBeInTheDocument();

  //   // Store table
  //   expect(screen.getByText("Store Breakdown")).toBeInTheDocument();
  //   expect(screen.getByText("Store 1")).toBeInTheDocument();
  //   expect(screen.getByText("$500")).toBeInTheDocument();
  //   expect(screen.getByText("$50")).toBeInTheDocument();
  //   expect(screen.getByText("5")).toBeInTheDocument();

  //   // Components
  //   expect(screen.getByTestId("vendor-charts")).toBeInTheDocument();
  //   expect(screen.getByTestId("notify-button")).toBeInTheDocument();
  //   expect(screen.getByText("Back to Dashboard")).toBeInTheDocument();
  // });

  it("uses fallback vendor name when vendor_name is empty", async () => {
    (headers as jest.Mock).mockReturnValue(new Map([["cookie", "mock-cookie"]]));
    (getAnalyticsByVendor as jest.Mock).mockResolvedValue({
      ...mockAnalytics,
      vendor_name: "",
    });

    render(await VendorBillingDetailsPage({ params: { vendorId: "1" } }));
    expect(screen.getByText("Vendor 1 Billing Details")).toBeInTheDocument();
  });
});