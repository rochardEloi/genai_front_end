import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { message: "Le code de vérification est requis" },
        { status: 400 }
      );
    }

    // 1️⃣ Récupérer les cookies envoyés par le navigateur à TON app
    const incomingCookieHeader = request.headers.get("cookie"); // peut être null

    // 2️⃣ Appeler ton serveur externe en forwardant les cookies
    const response = await fetch(
      "https://genaiserver-kn9m.onrender.com/api/users/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // On forward le header Cookie seulement s'il existe
          ...(incomingCookieHeader ? { Cookie: incomingCookieHeader } : {}),
        },
        // ici pas besoin de `credentials: "include"` car c'est un appel SERVEUR→SERVEUR
        body: JSON.stringify({ code }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Erreur lors de la vérification" },
        { status: response.status }
      );
    }

    // 3️⃣ Réponse pour le frontend Next.js
    const nextResponse = NextResponse.json(
      {
        message: "Code vérifié avec succès",
        user: data.user,
      },
      { status: 200 }
    );

    // 4️⃣ Transférer les cookies du serveur externe au navigateur
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      // ⚠️ Si ton serveur externe renvoie plusieurs cookies, il faudra gérer ça plus finement.
      nextResponse.headers.set("set-cookie", setCookieHeader);
    }

    console.log("Cookie reçu du backend externe:", setCookieHeader);

    return nextResponse;
  } catch (error: unknown) {
    console.error("Verification error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: `Erreur de connexion au serveur: ${errorMessage}` },
      { status: 500 }
    );
  }
}
