import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const authToken = cookies().get("auth_token")?.value || null;
  return NextResponse.json({ authToken });
}
