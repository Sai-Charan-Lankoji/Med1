// src/app/page.tsx
import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {LoginForm} from './LoginForm/page';
import { NEXT_URL } from '@/constants';

async function fetchAuthData(token: string) {
  try {
    const response = await fetch(`${NEXT_URL}/api/auth/me`, {
      headers: {
        Cookie: `auth_token=${token}`,
      },
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error checking auth state:', error);
    return null;
  }
}

export default async function LoginPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (token) {
    const authData = await fetchAuthData(token);
    if (authData) {
      redirect('/admin/vendors');
    }
  }

  return <LoginForm />;
}