import { NextResponse } from "next/server";

type HealthResponse = {
  status: "ok" | "error";
  timestamp: string;
};

export async function GET() {
  const healthCheck: HealthResponse = {
    status: "ok",
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(healthCheck);
}

// Optional: Add HEAD method support
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}

// Optional: Enable CORS if needed
export const runtime = "edge"; // 'nodejs' is default
export const dynamic = "force-dynamic";
