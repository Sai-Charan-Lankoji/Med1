// src/app/tests/pages/VendorDetailsPage.test.tsx

import { render, screen, waitFor } from "@testing-library/react";
import VendorDetailsPage from "@/app/admin/vendors/[vendorId]/page";
import * as nextHeaders from "next/headers";
import "@testing-library/jest-dom";

jest.mock('next/navigation', () => ({
    useRouter: () => ({
      push: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
    }),
  }));

 
  

// Mock next/headers module
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

// Sample mock data
const mockStores = [
  {
    id: "store1",
    name: "Store One",
    default_currency_code: "USD",
    swap_link_template: "",
    payment_link_template: "",
    invite_link_template: "",
    store_type: "online",
    publishableapikey: "api-key-1",
    store_url: "https://store1.com",
    vendor_id: "vendor123",
    default_sales_channel_id: "channel1",
    default_location_id: null,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-02",
  },
];

global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockStores),
    })
  ) as jest.Mock;

describe("VendorDetailsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders vendor stores correctly on success", async () => {
    // Mock cookies
    (nextHeaders.cookies as jest.Mock).mockReturnValue({
      toString: () => "cookie=value;",
    });

    // Mock fetch success
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockStores),
      })
    ) as jest.Mock;

    const params = { vendorId: "vendor123" };

    // Render the page
    const ui = await VendorDetailsPage({ params });
    render(ui);

    // Assertion
    await waitFor(() => {
      expect(screen.getByText("Store One")).toBeInTheDocument();
    });
  });

  it("renders error message on API failure", async () => {
    (nextHeaders.cookies as jest.Mock).mockReturnValue({
      toString: () => "cookie=value;",
    });

    // Mock fetch failure
    global.fetch = jest.fn(() => {
      throw new Error("API is down");
    }) as jest.Mock;

    const params = { vendorId: "vendor123" };
    const ui = await VendorDetailsPage({ params });
    render(ui);

    // Assertion
    await waitFor(() => {
      expect(screen.getByText(/API is down/i)).toBeInTheDocument();
    });
  });

  it("renders error message on non-ok response", async () => {
    (nextHeaders.cookies as jest.Mock).mockReturnValue({
      toString: () => "cookie=value;",
    });

    // Mock non-ok response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Invalid vendor" }),
      })
    ) as jest.Mock;

    const params = { vendorId: "invalid-vendor" };
    const ui = await VendorDetailsPage({ params });
    render(ui);

    // Assertion
    await waitFor(() => {
      expect(screen.getByText(/Invalid vendor/i)).toBeInTheDocument();
    });
  });
});
