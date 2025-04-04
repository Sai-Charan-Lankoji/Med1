// src/app/api/demo-request/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Next_server } from '@/constant';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body;
    
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Make a request to your server API
    const response = await fetch(`${Next_server}/api/demo-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, company, message })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send demo request');
    }
    
    const data = await response.json();
    return NextResponse.json({ success: true, data });
    
  } catch (error) {
    console.error('Demo request error:', error);
    return NextResponse.json(
      { success: false, message: 'Error submitting demo request' },
      { status: 500 }
    );
  }
}