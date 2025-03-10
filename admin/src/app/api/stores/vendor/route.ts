// app/api/stores/vendor/route.ts
import { NextRequest, NextResponse } from "next/server";
import { NEXT_URL } from "@/app/constants";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const vendorId = searchParams.get("vendor_id");

  console.log("API Route - Received vendorId:", vendorId); // Debug log

  if (!vendorId) {
    return NextResponse.json({ error: "vendor_id is required" }, { status: 400 });
  }

  try {
    const response = await fetch(`${NEXT_URL}/api/stores/vendor?vendor_id=${vendorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || "Failed to fetch stores" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching vendor stores:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}