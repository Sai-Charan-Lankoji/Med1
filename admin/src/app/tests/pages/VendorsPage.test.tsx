// src/app/tests/pages/VendorsPage.test.tsx
import { render, screen } from "@testing-library/react";
import VendorsPage from "@/app/admin/vendors/page";
import * as nextHeaders from "next/headers"; 
import '@testing-library/jest-dom';

// Define types for VendorsWithSearch props
interface VendorsWithSearchProps {
  initialVendors: any[]; // Replace with Vendor[] if you define the Vendor type
  initialError: string | null;
}

// Define type for SuspenseWithFade props
interface SuspenseWithFadeProps {
  children: React.ReactNode;
  fallback: React.ReactNode; // Not used in mock but good to include
}

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    toString: () => "",
  })),
}));

jest.mock("@/app/components/VendorsWithSearch", () => ({
  __esModule: true,
  default: ({ initialVendors, initialError }: VendorsWithSearchProps) => (
    <div data-testid="vendors-with-search">
      {initialError ? (
        <div>Error: {initialError}</div>
      ) : (
        <div>Vendors Count: {initialVendors.length}</div>
      )}
    </div>
  ),
}));

jest.mock("@/app/components/SuspenseWithFade", () => ({
  __esModule: true,
  default: ({ children }: SuspenseWithFadeProps) => <>{children}</>,
}));

jest.mock("@/app/components/Loading", () => ({
  __esModule: true,
  default: () => <div data-testid="loading">Loading...</div>,
}));

jest.mock("@/app/constants", () => ({
  NEXT_URL: "http://localhost:5000",
}));

describe("VendorsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("renders vendors correctly on successful fetch", async () => {
    jest.spyOn(nextHeaders, "cookies").mockReturnValue(Promise.resolve({
      toString: () => "mock-cookie-header",
    }));

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        vendors: [
          {
            id: "1",
            company_name: "Test Vendor",
            contact_name: "John Doe",
            registered_number: "123456",
            status: "active",
            contact_email: "test@example.com",
            contact_phone_number: "1234567890",
            tax_number: "TAX123",
            plan: "Basic",
            plan_id: "plan_001",
            next_billing_date: "2025-01-01",
            business_type: "Retail",
            createdAt: "2025-01-01",
            updatedAt: "2025-01-01",
            deletedAt: null,
            address: [],
          },
        ],
      }),
    });

    render(await VendorsPage());
    expect(screen.getByTestId("vendors-with-search")).toBeInTheDocument();
    expect(screen.getByText("Vendors Count: 1")).toBeInTheDocument();
  });

  it("renders error message on fetch rejection", async () => {
    jest.spyOn(nextHeaders, "cookies").mockReturnValue({
      toString: () => "mock-cookie-header",
    });

    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network Error"));

    render(await VendorsPage());
    expect(screen.getByTestId("vendors-with-search")).toBeInTheDocument();
    expect(screen.getByText("Error: Network Error")).toBeInTheDocument();
  });

  it("renders error message on non-ok response", async () => {
    jest.spyOn(nextHeaders, "cookies").mockReturnValue({
      toString: () => "mock-cookie-header",
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    render(await VendorsPage());
    expect(screen.getByTestId("vendors-with-search")).toBeInTheDocument();
    expect(screen.getByText("Error: Failed to fetch vendors")).toBeInTheDocument();
  });
});