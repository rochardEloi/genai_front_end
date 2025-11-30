import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_LOGIN_URL =
  "http://92.112.184.87:1111/api/users/login";

export async function POST(request: NextRequest) {
  try {
    // 1️⃣ Récupération des données envoyées depuis le client
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe sont requis" },
        { status: 400 }
      );
    }

    // 2️⃣ Récupérer les cookies envoyés par le navigateur à TON domaine (si besoin)
    const incomingCookieHeader = request.headers.get("cookie") || "";

    // 3️⃣ Appel du serveur externe
    const externalResponse = await fetch(EXTERNAL_LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(incomingCookieHeader ? { Cookie: incomingCookieHeader } : {}),
      },
      body: JSON.stringify({ email, password }),
      // pas de credentials ici : c'est un appel serveur → serveur
    });

    const rawText = await externalResponse.text();
    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { raw: rawText };
    }

    // Debug (facultatif pendant le dev)
    console.log("[login] external status:", externalResponse.status);
    console.log("[login] external body:", data);

    // 4️⃣ Si l'API externe renvoie une erreur
    if (!externalResponse.ok) {
      return NextResponse.json(
        {
          message:
            data?.message ||
            data?.error ||
            "Une erreur est survenue lors de la connexion",
        },
        { status: externalResponse.status }
      );
    }

   

    // 5️⃣ Construire la réponse pour le frontend
    const nextResponse = NextResponse.json(
      {
        message: data?.message || "Connexion réussie",
        token: data?.token, // si jamais tu veux encore l’utiliser côté client
        user: data?.user,
        success: data?.success ?? true,
      },
      { status: 200 }
    );

    // 6️⃣ Forward des cookies de l’API externe vers le navigateur
    const setCookieHeader = externalResponse.headers.get("set-cookie");
    if (setCookieHeader) {
      // Si ton backend renvoie plusieurs cookies, on pourra affiner:
      nextResponse.headers.set("set-cookie", setCookieHeader);
      console.log("[login] set-cookie from external:", setCookieHeader);
    }

    return nextResponse;
  } catch (error: unknown) {
    console.error("Login route error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur interne du serveur";
    return NextResponse.json(
      { message: `Erreur de connexion au serveur: ${errorMessage}` },
      { status: 500 }
    );
  }
}
