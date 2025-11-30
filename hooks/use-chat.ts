// hooks/use-chat.ts - Version corrigée pour continuer les conversations
'use client';

import { useState, useCallback } from 'react';
import { Message } from '@/lib/chat-types';

const generateMessageId = () => {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [hasLoadedExistingConversation, setHasLoadedExistingConversation] = useState(false);

  const loadExistingConversation = useCallback(async (conversationId: string) => {
    if (hasLoadedExistingConversation) {
      console.log("🔄 Conversation déjà chargée, skip...");
      return;
    }

    try {
      console.log("🔄 Chargement de la conversation:", conversationId);
      setIsLoading(true);
      
      const response = await fetch(`/api/conversations/load/${conversationId}`);
      if (!response.ok) throw new Error('Failed to load conversation');
      
      const data = await response.json();
      
      // Transformer les messages de l'API en format interne
      const formattedMessages: Message[] = data.messages.map((msg: any) => ({
        id: msg._id,
        content: msg.content,
        role: msg.role as 'user' | 'assistant',
        timestamp: new Date(msg.timestamp),
      }));
      
      console.log("✅ Conversation chargée:", formattedMessages.length, "messages");
      setMessages(formattedMessages);
      setHasLoadedExistingConversation(true);
      
      // IMPORTANT: Stocker l'ID de la conversation existante
      setConversationId(data._id);
      console.log("💾 Conversation ID stocké:", data._id);
      
      return data;
    } catch (error) {
      console.error('❌ Error loading conversation:', error);
      setHasLoadedExistingConversation(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [hasLoadedExistingConversation]);

  const sendMessage = useCallback(async (content: string, selectedBookId?: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: generateMessageId(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    console.log("🔄 Ajout du message utilisateur:", userMessage);
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Créer un message assistant vide pour le streaming
    const assistantMessageId = generateMessageId();
    const assistantMessage: Message = {
      id: assistantMessageId,
      content: '', // Commence vide
      role: 'assistant',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      // IMPORTANT: Toujours envoyer le conversation_id s'il existe
      const requestBody = {
        message: content.trim(),
        timestamp: new Date().toISOString(),
        ...(conversationId && { conversation_id: conversationId }), // Toujours inclure si disponible
        ...(selectedBookId && { selected_book_id: selectedBookId }),
      };

      console.log("🚀 Envoi vers /api/chat avec conversation_id:", conversationId);
      console.log("📚 Request Body:", requestBody);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      const responseData = await response.json();
      
      // Stocker la conversation_id si elle est renvoyée (pour les nouvelles conversations)
      if (responseData.data?.conversation_id && !conversationId) {
        setConversationId(responseData.data.conversation_id);
        console.log("💾 Nouvelle conversation_id stockée:", responseData.data.conversation_id);
      }

      let assistantContent = 'Désolé, je n\'ai pas pu générer de réponse.';
      
      if (responseData.data?.response) {
        assistantContent = responseData.data.response;
      } else if (responseData.data?.message && responseData.data.message !== "Message envoyé avec succès") {
        assistantContent = responseData.data.message;
      }

      // Animation typewriter simulée
      let currentText = '';
      for (let i = 0; i < assistantContent.length; i++) {
        setTimeout(() => {
          currentText += assistantContent[i];
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessageId 
                ? { ...msg, content: currentText }
                : msg
            )
          );
        }, i * 20);
      }

      await new Promise(resolve => setTimeout(resolve, assistantContent.length * 20));

    } catch (error) {
      console.error('💥 Error sending message:', error);
      
      const errorContent = error instanceof Error ? `Erreur: ${error.message}` : 'Désolé, une erreur s\'est produite.';
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: errorContent }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]); // Dépendance importante

  const clearChat = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setHasLoadedExistingConversation(false);
    console.log("🧹 Chat cleared, conversationId reset");
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    loadExistingConversation,
    conversationId,
    hasLoadedExistingConversation,
  };
}