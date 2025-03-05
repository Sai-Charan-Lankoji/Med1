// src/app/admin/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
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

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/'); // Redirect to home/login if no token
  }

  const authData = await fetchAuthData(token);
  if (!authData) {
    redirect('/'); // Redirect if token is invalid or user not found
  }

  // If authenticated, render the admin UI with children (e.g., /admin/vendors)
  return <>{children}</>;
}