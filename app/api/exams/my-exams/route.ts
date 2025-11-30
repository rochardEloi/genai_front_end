// app/api/exams/my-exams/route.ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const incomingCookieHeader = request.headers.get("cookie");

    if (!incomingCookieHeader) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const response = await fetch(
      "http://92.112.184.87:1111/api/exams/my-exams",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: incomingCookieHeader,
        },
        credentials: 'include',
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API exams/my-exams:', {
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
    console.error('Erreur dans /api/exams/my-exams:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    );
  }
}
