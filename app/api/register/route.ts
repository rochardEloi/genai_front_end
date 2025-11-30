import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(
      "http://92.112.184.87:1111/api/users/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: 'no-store',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Erreur lors de l'inscription" },
        { status: response.status }
      );
    }

    // Créer la réponse Next.js
    const nextResponse = NextResponse.json(
      {
        message: "Compte créé avec succès",
        user: data,
        cookies: response.headers.getSetCookie(),
      },
      { status: 200 }
    );

    // Gérer les cookies de la réponse externe
    const cookies = response.headers.getSetCookie();
    if (cookies && cookies.length > 0) {
      cookies.forEach((cookie) => {
        nextResponse.headers.append("set-cookie", cookie);
      });
    }


    return nextResponse;
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Erreur de connexion au serveur" },
      { status: 500 }
    );
  }
}
