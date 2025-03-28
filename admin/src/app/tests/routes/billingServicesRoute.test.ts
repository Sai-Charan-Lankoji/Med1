import { getAllVendors, getOverallAnalytics } from "@/app/api/billingServices/route";

describe("Billing Services API Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  describe("getAllVendors", () => {
    it("fetches vendors successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          vendors: [
            {
              id: "1",
              company_name: "VendorCorp",
              contact_name: "John Doe",
              contact_email: "john@vendorcorp.com",
              plan: "Basic",
              business_type: "Retail",
            },
          ],
        }),
      });

      const vendors = await getAllVendors("mock-cookie");
      expect(vendors).toEqual([
        {
          id: "1",
          company_name: "VendorCorp",
          contact_name: "John Doe",
          contact_email: "john@vendorcorp.com",
          plan: "Basic",
          business_type: "Retail",
        },
      ]);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/vendors",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({ Cookie: "mock-cookie" }),
        })
      );
    });

    it("throws error on fetch failure", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: "Not Found",
        json: async () => ({ message: "Not found" }),
      });

      await expect(getAllVendors("mock-cookie")).rejects.toThrow("Not found");
    });
  });

  describe("getOverallAnalytics", () => {
    it("fetches analytics successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          analytics: {
            status: "success",
            statusCode: 200,
            message: "OK",
            data: {
              total_vendors: 1,
              total_orders: 10,
              commission_total_orders: 5,
              total_vendor_revenue: "1000",
              total_admin_commission: "100",
              non_commissionable_revenue: "200",
              final_vendor_revenue: "800",
              monthly_revenue: [{ month: "2025-01", revenue: "500" }],
            },
          },
        }),
      });

      const analytics = await getOverallAnalytics("mock-cookie");
      expect(analytics).toEqual({
        total_vendors: 1,
        total_orders: 10,
        commission_total_orders: 5,
        total_vendor_revenue: "1000",
        total_admin_commission: "100",
        non_commissionable_revenue: "200",
        final_vendor_revenue: "800",
        monthly_revenue: [{ month: "2025-01", revenue: "500" }],
      });
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/vendors/analytics",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({ Cookie: "mock-cookie" }),
        })
      );
    });

    it("throws error on fetch failure", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: "Server Error",
        json: async () => ({ message: "Server down" }),
      });

      await expect(getOverallAnalytics("mock-cookie")).rejects.toThrow("Server down");
    });
  });
});