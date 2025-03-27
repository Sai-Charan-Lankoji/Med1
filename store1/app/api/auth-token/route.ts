import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // Retrieve the auth token from cookies
    const authToken = cookies().get("auth_token")?.value || null;
    // Return JSON response
    return NextResponse.json({ authToken }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving auth token:", error);
    return NextResponse.json({ error: "Failed to fetch auth token" }, { status: 500 });
  }
}
