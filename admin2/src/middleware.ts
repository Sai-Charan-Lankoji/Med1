import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const vendorToken = req.cookies.get("vendor_token");
  const url = req.nextUrl.clone();

  
  if (!vendorToken && url.pathname !== "/login") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (vendorToken && url.pathname === "/login") {
    url.pathname = "/vendor/products";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/vendor/:path", "/login"],
};
