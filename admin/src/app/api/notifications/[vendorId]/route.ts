// src/app/api/notifications/[vendorId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { NEXT_URL } from "@/app/constants";

export async function PUT(req: NextRequest, { params }: { params: { vendorId: string } }) {
  const { vendorId } = params;
  const cookieHeader = req.headers.get("cookie") || "";

  try {
    const backendUrl = `${NEXT_URL}/api/notifications/${vendorId}`;
    const response = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
      body: JSON.stringify({ status: "active" }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || `Failed to notify vendor: ${response.status}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, message: "Notification sent successfully" });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";

  try {
    const backendUrl = `${NEXT_URL}/api/vendors/notify`;
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
      body: JSON.stringify({ vendorId: "all" }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || `Failed to notify all vendors: ${response.status}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, message: "Notification sent to all vendors" });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}