import { NextRequest, NextResponse } from "next/server";
import { NEXT_URL } from "@/app/constants";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    const backendUrl = `${NEXT_URL}/api/auth/logout`;

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send token in header
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json({ message: `Logout failed: ${errorData}` }, { status: response.status });
    }

    // Clear the token cookie if set by backend (optional, since we’re using localStorage)
    const setCookie = response.headers.get("set-cookie");
    const nextResponse = NextResponse.json({ success: true, message: "Logged out successfully" });
    if (setCookie) {
      nextResponse.headers.set("Set-Cookie", setCookie);
    }

    // Clear client-side token cookie (if any)
    nextResponse.headers.append("Set-Cookie", "token=; Path=/; Max-Age=0");
    return nextResponse;
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}