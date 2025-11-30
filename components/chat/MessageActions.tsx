// components/chat/MessageActions.tsx
'use client';

import { useState } from 'react';
import { Copy, Download, Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageActionsProps {
  content: string;
  className?: string;
}

export function MessageActions({ content, className = '' }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const handleDownloadPDF = () => {
    // Créer un PDF simple avec jsPDF
    const { jsPDF } = require('jspdf');
    const doc = new jsPDF();
    
    // Configuration du PDF
    doc.setFont('helvetica');
    doc.setFontSize(12);
    
    // Split le contenu en lignes pour éviter le débordement
    const lines = doc.splitTextToSize(content, 180);
    
    // Ajouter un titre
    doc.setFontSize(16);
    doc.text('Conversation avec Assistant IA', 20, 20);
    doc.setFontSize(10);
    doc.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')}`, 20, 30);
    
    // Ajouter le contenu
    doc.setFontSize(12);
    doc.text(lines, 20, 50);
    
    // Télécharger le PDF
    doc.save('conversation-assistant-ia.pdf');
  };

  return (
    <div className={`flex gap-1 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
        title="Copier la réponse"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4 text-gray-600" />
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDownloadPDF}
        className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
        title="Télécharger en PDF"
      >
        <Download className="h-4 w-4 text-gray-600" />
      </Button>
    </div>
  );
}