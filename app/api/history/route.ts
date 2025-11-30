import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const incomingCookieHeader = request.headers.get("cookie");
    const response = await fetch(
      'http://92.112.184.87:1111/api/conversations/my-conversations',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(incomingCookieHeader ? { Cookie: incomingCookieHeader } : {}),
        },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API externe:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur dans /api/conversations:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Erreur serveur interne',
        details: 'Impossible de récupérer les conversations'
      },
      { status: 500 }
    );
  }
}