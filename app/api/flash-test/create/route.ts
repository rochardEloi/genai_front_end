// app/api/flash-test/create/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { selected_book_id } = await request.json();

    if (!selected_book_id) {
      return NextResponse.json(
        { error: 'selected_book_id est requis' },
        { status: 400 }
      );
    }

    const incomingCookieHeader = request.headers.get("cookie");
    
    const response = await fetch('http://92.112.184.87:1111/api/flash-test/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(incomingCookieHeader ? { Cookie: incomingCookieHeader } : {}),
      },
      body: JSON.stringify({ selected_book_id }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur création flash-test:', response.status, errorText);
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur création flash-test:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du quiz' },
      { status: 500 }
    );
  }
}
