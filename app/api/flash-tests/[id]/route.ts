// app/api/flash-tests/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = params.id;
    const incomingCookieHeader = request.headers.get("cookie");
    
    const response = await fetch(
      `http://92.112.184.87:1111/api/flash-test/my-flash-test/${testId}`,
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
      console.error('Erreur API flash-test detail:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json({ 
      success: true,
      test: data
    });
  } catch (error) {
    console.error('Erreur dans /api/flash-tests/[id]:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur interne',
        details: 'Impossible de récupérer le test'
      },
      { status: 500 }
    );
  }
}
