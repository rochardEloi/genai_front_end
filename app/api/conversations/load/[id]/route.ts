// app/api/conversations/load/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const incomingCookieHeader = request.headers.get("cookie");
    // Appel à votre API externe
    const response = await fetch(`http://92.112.184.87:1111/api/conversations/load/${conversationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(incomingCookieHeader ? { Cookie: incomingCookieHeader } : {}),
      },
        credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const conversationData = await response.json();
    
    return NextResponse.json(conversationData);
  } catch (error) {
    console.error('Error loading conversation:', error);
    return NextResponse.json(
      { error: 'Failed to load conversation' },
      { status: 500 }
    );
  }
}