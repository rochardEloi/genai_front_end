// app/api/flash-tests/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const incomingCookieHeader = request.headers.get("cookie");
    const response = await fetch(
      'http://92.112.184.87:1111/api/flash-test/my-flash-tests',
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
      console.error('Erreur API flash-tests:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API flash-tests response:', JSON.stringify(data).substring(0, 500));
    
    // Le backend peut retourner un array directement ou un objet avec flash_tests
    let tests = [];
    if (Array.isArray(data)) {
      tests = data;
    } else if (data.flash_tests && Array.isArray(data.flash_tests)) {
      tests = data.flash_tests;
    } else if (data.tests && Array.isArray(data.tests)) {
      tests = data.tests;
    }
    
    return NextResponse.json({ 
      success: true,
      tests: tests
    });
  } catch (error) {
    console.error('Erreur dans /api/flash-tests:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur interne',
        details: 'Impossible de récupérer les tests'
      },
      { status: 500 }
    );
  }
}
