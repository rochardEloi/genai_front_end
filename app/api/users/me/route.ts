// app/api/users/me/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const incomingCookieHeader = request.headers.get("cookie");
    
    const response = await fetch(
      'http://92.112.184.87:1111/api/users/me',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(incomingCookieHeader ? { Cookie: incomingCookieHeader } : {}),
        },
        credentials: 'include',
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API users/me:', {
        status: response.status,
        error: errorText
      });
      throw new Error(`Erreur ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur dans /api/users/me:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    );
  }
}
