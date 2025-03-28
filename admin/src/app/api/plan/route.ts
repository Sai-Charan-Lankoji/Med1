// app/api/plan/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = 'http://localhost:5000';

export interface PlanData {
  name: string;
  price: string;
  description?: string;
  features?: string[];
  discount?: number;
  isActive?: boolean;
  no_stores?: string;
  commission_rate?: number;
}

export interface Plan extends PlanData {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export async function GET() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const response = await fetch(`${BACKEND_URL}/api/plan`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to fetch plans' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, plans: data });
  } catch (error) {
    console.error('Error in GET /api/plan:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const body = await req.json();

  try {
    const response = await fetch(`${BACKEND_URL}/api/plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to create plan' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, plan: data });
  } catch (error) {
    console.error('Error in POST /api/plan:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const body = await req.json();

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Plan ID is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/plan/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to update plan' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, plan: data });
  } catch (error) {
    console.error('Error in PUT /api/plan:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Plan ID is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/plan/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      credentials: 'include',
    });

    // Handle different success status codes (200, 204, etc.)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to delete plan' },
        { status: response.status }
      );
    }

    // Check if there's a response body; if not, return success without parsing
    const contentType = response.headers.get('content-type');
    let data = null;
    if (contentType?.includes('application/json') && response.body) {
      data = await response.json().catch(() => null);
    }

    return NextResponse.json({ 
      success: true, 
      data: data || { message: 'Plan deleted successfully' }
    });
  } catch (error) {
    console.error('Error in DELETE /api/plan:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}