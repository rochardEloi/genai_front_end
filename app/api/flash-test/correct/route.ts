// app/api/flash-test/correct/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { flash_test_id, user_answers } = await request.json();

    if (!flash_test_id || !user_answers) {
      return NextResponse.json(
        { error: 'flash_test_id et user_answers sont requis' },
        { status: 400 }
      );
    }

    const incomingCookieHeader = request.headers.get("cookie");
    
    const response = await fetch('http://92.112.184.87:1111/api/flash-test/correct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(incomingCookieHeader ? { Cookie: incomingCookieHeader } : {}),
      },
      body: JSON.stringify({ flash_test_id, user_answers }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur correction flash-test:', response.status, errorText);
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Session expirée. Veuillez vous reconnecter.' },
          { status: 401 }
        );
      }
      
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    
    // Retourner les résultats de la correction
    // Format attendu: { total_user_points, total_points, user_answers: [...] }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur correction flash-test:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la correction du quiz' },
      { status: 500 }
    );
  }
}
