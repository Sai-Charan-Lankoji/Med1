// src/app/layout.tsx
import { cookies } from 'next/headers';
import { NEXT_URL } from '@/constants';
import ClientLayout from './ClientLayout'; // New Client Component

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
    console.error('Error fetching auth data:', error);
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
  const authData = token ? await fetchAuthData(token) : null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientLayout authData={authData}>{children}</ClientLayout>
      </body>
    </html>
  );
}