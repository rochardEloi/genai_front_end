// app/api/subjects/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const incomingCookieHeader = request.headers.get("cookie");
    const response = await fetch(
      'http://92.112.184.87:1111/api/subjects/get-subjects',
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
    
    // Retourner le format attendu par le frontend
    return NextResponse.json({ 
      success: true,
      subjects: data // Assurez-vous que c'est bien un tableau
    });
  } catch (error) {
    console.error('Erreur dans /api/subjects:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur interne',
        details: 'Impossible de récupérer les matières'
      },
      { status: 500 }
    );
  }
}