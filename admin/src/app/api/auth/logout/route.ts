// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import {NEXT_URL} from "@/app/constants"

export async function POST(req: NextRequest) {
  try {
    const backendUrl = `${NEXT_URL}/api/auth/logout`;
    const cookieHeader = req.headers.get("cookie") || "";

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json({ message: `Logout failed: ${errorData}` }, { status: response.status });
    }

    // Forward the response headers (e.g., cleared cookies) to the client
    const setCookie = response.headers.get("set-cookie");
    const nextResponse = NextResponse.json({ success: true, message: "Logged out successfully" });
    if (setCookie) {
      nextResponse.headers.set("Set-Cookie", setCookie);
    }
    return nextResponse;
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}