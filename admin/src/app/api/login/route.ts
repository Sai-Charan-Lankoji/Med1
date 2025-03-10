// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { NEXT_URL } from "@/app/constants";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const loginResponse = await fetch(`${NEXT_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Pass cookies to backend
      body: JSON.stringify({ email, password }),
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      return NextResponse.json({ error: errorData.error || "Failed to authenticate" }, { status: 401 });
    }

    // Forward cookies to client
    const setCookie = loginResponse.headers.get("set-cookie");
    const response = NextResponse.json({ success: true }, { status: 200 });
    if (setCookie) {
      response.headers.set("Set-Cookie", setCookie);
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}