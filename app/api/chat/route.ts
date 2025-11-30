// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
 try {
    const body = await request.json();
    console.log("=== DEBUT LOG API ROUTE ===");
    console.log("📦 Body reçu:", JSON.stringify(body, null, 2));

    // Validation basique du body
    if (!body || typeof body !== "object" || !body.message) {
      console.log("❌ Validation failed: message manquant");
      return NextResponse.json(
        { message: "Données invalides - message requis" },
        { status: 400 }
      );
    }

    // Récupérer le header Cookie de la requête entrante
    const incomingCookieHeader = request.headers.get("cookie");
    console.log("🍪 Cookies entrant:", incomingCookieHeader);

    console.log("🚀 Envoi vers API externe...");
    console.log("📤 Message envoyé:", body.message);
    console.log("📤 Selected Book ID:", body.selected_book_id);
    console.log("📤 Conversation ID:", body.conversation_id || "Nouvelle conversation");

    const apiRequestBody: any = {
      message: body.message,
    };

    // Inclure selected_book_id s'il existe
    if (body.selected_book_id) {
      apiRequestBody.selected_book_id = body.selected_book_id;
    }

    // Inclure conversation_id seulement s'il existe
    if (body.conversation_id) {
      apiRequestBody.conversation_id = body.conversation_id;
    }

    const response = await fetch(
      "http://92.112.184.87:1111/api/conversations/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(incomingCookieHeader ? { Cookie: incomingCookieHeader } : {}),
        },
        body: JSON.stringify(apiRequestBody),
      }
    );

    console.log("📥 Statut réponse externe:", response.status);
    console.log("📥 Headers réponse externe:", Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log("📥 Réponse brute externe:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log("📦 Données parsées:", JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.log("❌ Erreur parsing JSON:", parseError);
      data = { raw_response: responseText };
    }

    if (!response.ok) {
      console.log("❌ Erreur API externe:", data);
      return NextResponse.json(
        {
          message: data.message || "Erreur lors de l'envoi du message",
          details: data.details || null,
          status: response.status,
        },
        { status: response.status }
      );
    }

    console.log("✅ Succès API externe");

    // Créer la réponse Next.js
    const nextResponse = NextResponse.json(
      {
        message: "Message envoyé avec succès",
        data: data,
      },
      { status: 200 }
    );

    // Gérer les cookies de la réponse externe
    const cookies = response.headers.get("set-cookie");
    if (cookies) {
      console.log("🍪 Cookies à set:", cookies);
      cookies.split(",").forEach((cookie) => {
        nextResponse.headers.append("set-cookie", cookie.trim());
      });
    }

    console.log("=== FIN LOG API ROUTE ===");
    return nextResponse;
  } catch (error: unknown) {
    console.error("💥 Chat API error:", error);
    return NextResponse.json(
      { 
        message: "Erreur de connexion au serveur",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}