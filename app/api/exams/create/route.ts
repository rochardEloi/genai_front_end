// app/api/exams/create/route.ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.subject || !body.profile) {
      return NextResponse.json(
        { error: "Subject et profile sont requis" },
        { status: 400 }
      );
    }

    const incomingCookieHeader = request.headers.get("cookie");

    const response = await fetch(
      "http://92.112.184.87:1111/api/exams/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(incomingCookieHeader ? { Cookie: incomingCookieHeader } : {}),
        },
        body: JSON.stringify({
          subject: body.subject,
          profile: body.profile
        }),
        credentials: 'include',
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API exams/create:', {
        status: response.status,
        error: errorText
      });
      return NextResponse.json(
        { error: `Erreur ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur dans /api/exams/create:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    );
  }
}
