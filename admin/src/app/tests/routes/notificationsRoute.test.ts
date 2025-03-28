// src/app/tests/routes/notificationsRoute.test.ts
import { PUT } from "@/app/api/notifications/[vendorId]/route"; // Direct named import
import { NextRequest } from "next/server";

// Mock NextRequest and NextResponse
jest.mock("next/server", () => ({
  NextRequest: class MockNextRequest {
    _body: string;

    constructor(url: string, options: RequestInit) {
      this.method = options.method || "GET";
      this.headers = new Headers(options.headers);
      this._body = typeof options.body === "string" ? options.body : "{}";
    }
    method: string;
    headers: Headers;
    async json() {
      return JSON.parse(this._body);
    }
  },
  NextResponse: {
    json: jest.fn((body, options) => ({
      status: options?.status || 200,
      json: async () => body,
    })),
  },
}));

describe("Notifications API Routes - PUT /api/notifications/[vendorId]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    console.error = jest.fn();
  });

  it("successfully notifies a specific vendor", async () => {
    const mockBody = { status: "active" };
    const mockResponse = { message: "Notification sent" };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      text: async () => JSON.stringify(mockResponse),
    });

    const req = new NextRequest("http://localhost", {
      method: "PUT",
      headers: { cookie: "mock-cookie" },
      body: JSON.stringify(mockBody),
    });

    const response = await PUT(req, { params: { vendorId: "1" } });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({
      success: true,
      message: "Notification sent",
      data: mockResponse,
    });
  });

  it("handles backend error with JSON response", async () => {
    const mockBody = { status: "active" };
    const mockError = { error: "Invalid vendor" };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      headers: new Headers({ "content-type": "application/json" }),
      text: async () => JSON.stringify(mockError),
    });

    const req = new NextRequest("http://localhost", {
      method: "PUT",
      headers: { cookie: "mock-cookie" },
      body: JSON.stringify(mockBody),
    });

    const response = await PUT(req, { params: { vendorId: "1" } });
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      success: false,
      message: "Invalid vendor",
    });
  });

  it("handles backend error with non-JSON response", async () => {
    const mockBody = { status: "active" };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      headers: new Headers({ "content-type": "text/plain" }),
      text: async () => "Server error",
    });

    const req = new NextRequest("http://localhost", {
      method: "PUT",
      headers: { cookie: "mock-cookie" },
      body: JSON.stringify(mockBody),
    });

    const response = await PUT(req, { params: { vendorId: "1" } });
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({
      success: false,
      message: "Failed to notify vendor: 500",
    });
  });

  it("handles fetch exception", async () => {
    const mockBody = { status: "active" };
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const req = new NextRequest("http://localhost", {
      method: "PUT",
      headers: { cookie: "mock-cookie" },
      body: JSON.stringify(mockBody),
    });

    const response = await PUT(req, { params: { vendorId: "1" } });
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({
      success: false,
      message: "Network error",
    });
  });

  it("handles empty response body", async () => {
    const mockBody = { status: "active" };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      text: async () => "",
    });

    const req = new NextRequest("http://localhost", {
      method: "PUT",
      headers: { cookie: "mock-cookie" },
      body: JSON.stringify(mockBody),
    });

    const response = await PUT(req, { params: { vendorId: "1" } });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({
      success: true,
      message: "Notification sent successfully",
      data: null,
    });
  });
});