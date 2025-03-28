import { POST } from "@/app/api/login/route";
import { NextRequest } from "next/server";

// Mock NextRequest and NextResponse
jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((body, options) => ({
      status: options?.status || 200,
      headers: new Map(),
      json: async () => body,
    })),
  },
}));

describe("Login API Route (/api/login)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    process.env.NEXT_URL = "http://localhost:5000"; // Mock NEXT_URL
  });

  it("logs in successfully and forwards cookies", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: new Map([["set-cookie", "session=abc123"]]),
      json: async () => ({ success: true }),
    });

    const req = {
      json: async () => ({ email: "test@example.com", password: "password123" }),
    } as unknown as NextRequest;

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ success: true });
    expect(response.headers.get("Set-Cookie")).toBe("session=abc123");
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/auth/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "test@example.com", password: "password123" }),
        credentials: "include",
      })
    );
  });

  it("returns 401 on authentication failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Invalid credentials" }),
    });

    const req = {
      json: async () => ({ email: "test@example.com", password: "wrong" }),
    } as unknown as NextRequest;

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ error: "Invalid credentials" });
  });

  it("returns 500 on network error", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const req = {
      json: async () => ({ email: "test@example.com", password: "password123" }),
    } as unknown as NextRequest;

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ error: "Internal server error" });
  });
});