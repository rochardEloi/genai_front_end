// components/chat/MessageBubble.tsx - Version avec extraction des titres
'use client';

import { Bot, User } from 'lucide-react';
import { Message } from '@/lib/chat-types';
import { cn } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import hljs from 'highlight.js';
import { MessageActions } from './MessageActions';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  isNewMessage?: boolean;
}

// Phrases d'attente aléatoires organisées par catégories
const LOADING_PHRASES = {
  research: [
    "🔍 Horizon effectue des recherches approfondies...",
    "📚 Consultation des sources documentaires...",
    "🌐 Analyse des données en temps réel...",
    "🔎 Investigation des informations pertinentes...",
    "📖 Exploration des connaissances disponibles..."
  ],
  analysis: [
    "🧠 Horizon analyse la problématique...",
    "💭 Traitement des éléments complexes...",
    "⚡ Évaluation des différentes approches...",
    "🎯 Examen des solutions optimales...",
    "🔬 Analyse critique des données..."
  ],
  processing: [
    "⚙️ Traitement des informations...",
    "🔄 Organisation des données collectées...",
    "📊 Structuration des éléments clés...",
    "🎛️ Optimisation du contenu...",
    "🛠️ Préparation des éléments techniques..."
  ],
  synthesis: [
    "✨ Synthèse des informations...",
    "🎨 Assemblage des pièces du puzzle...",
    "📝 Rédaction de la réponse...",
    "💎 Polissage des formulations...",
    "🏗️ Construction de la structure..."
  ],
  finalization: [
    "🎯 Finalisation de la réponse...",
    "✅ Vérification de la précision...",
    "🔍 Relecture attentive...",
    "📋 Contrôle qualité en cours...",
    "🚀 Préparation de l'envoi..."
  ]
};

// Fonction pour obtenir une phrase aléatoire d'une catégorie
const getRandomPhrase = (category: keyof typeof LOADING_PHRASES) => {
  const phrases = LOADING_PHRASES[category];
  return phrases[Math.floor(Math.random() * phrases.length)];
};

export function MessageBubble({ message, isStreaming = false, isNewMessage = false }: MessageBubbleProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [loadingPhrase, setLoadingPhrase] = useState('');
  const [dotCount, setDotCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [phraseCategory, setPhraseCategory] = useState<keyof typeof LOADING_PHRASES>('research');
  
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const phraseIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messageContentRef = useRef(message.content);
  const isUser = message.role === 'user';

  // Mettre à jour la référence du contenu
  useEffect(() => {
    messageContentRef.current = message.content;
  }, [message.content]);

  /**
   * GESTION DES PHRASES DE CHARGEMENT ALTERNÉES
   */
  useEffect(() => {
    if (isStreaming && !isUser) {
      // Catégories dans l'ordre logique de traitement
      const categories: (keyof typeof LOADING_PHRASES)[] = ['research', 'analysis', 'processing', 'synthesis', 'finalization'];
      
      // Phrase initiale
      const initialCategory = categories[0];
      setPhraseCategory(initialCategory);
      setLoadingPhrase(getRandomPhrase(initialCategory));

      // Animation des points
      const dotInterval = setInterval(() => {
        setDotCount(prev => (prev + 1) % 4);
      }, 500);

      // Alternance des phrases toutes les 4 secondes
      let categoryIndex = 0;
      phraseIntervalRef.current = setInterval(() => {
        categoryIndex = (categoryIndex + 1) % categories.length;
        const nextCategory = categories[categoryIndex];
        setPhraseCategory(nextCategory);
        setLoadingPhrase(getRandomPhrase(nextCategory));
      }, 4000);

      return () => {
        clearInterval(dotInterval);
        if (phraseIntervalRef.current) {
          clearInterval(phraseIntervalRef.current);
        }
      };
    } else {
      setLoadingPhrase('');
      setDotCount(0);
      if (phraseIntervalRef.current) {
        clearInterval(phraseIntervalRef.current);
      }
    }
  }, [isStreaming, isUser]);

  /**
   * GESTION DU TITRE DE LA PAGE
   */
  useEffect(() => {
    if (!isUser && !isStreaming && message.content) {
      const titleMatch = message.content.match(/^#\s+(.+)$/m);
      if (titleMatch && titleMatch[1]) {
        const newTitle = `${titleMatch[1]} - Assistant AI`;
        document.title = newTitle;
      }
    }
  }, [message.content, isUser, isStreaming]);

  /**
   * RESET COMPLET QUAND LE MESSAGE CHANGE
   */
  useEffect(() => {
    if (isNewMessage) {
      setDisplayedContent('');
      setCurrentIndex(0);
      setIsAnimating(true);
    }
  }, [message.id, isNewMessage]);

  /**
   * GESTION PRINCIPALE DE L'ANIMATION
   */
  useEffect(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }

    if (isUser) {
      setDisplayedContent(message.content);
      setIsAnimating(false);
      return;
    }

    if (isStreaming) {
      setIsAnimating(true);
      
      if (currentIndex < message.content.length) {
        animationRef.current = setTimeout(() => {
          const nextIndex = currentIndex + 1;
          setDisplayedContent(message.content.slice(0, nextIndex));
          setCurrentIndex(nextIndex);
        }, 16);
      } else {
        setIsAnimating(false);
      }
    } else {
      if (displayedContent !== message.content) {
        setDisplayedContent(message.content);
        setCurrentIndex(message.content.length);
        setIsAnimating(false);
      }
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isStreaming, currentIndex, message.content, displayedContent, isUser]);

  /**
   * CORRECTION POUR LES RÉPONSES LONGUES
   */
  useEffect(() => {
    if (isStreaming && !isAnimating && currentIndex < message.content.length) {
      setIsAnimating(true);
      const nextIndex = currentIndex + 1;
      setDisplayedContent(message.content.slice(0, nextIndex));
      setCurrentIndex(nextIndex);
    }

    if (isStreaming && message.content !== messageContentRef.current) {
      setDisplayedContent('');
      setCurrentIndex(0);
      setIsAnimating(true);
    }
  }, [isStreaming, isAnimating, currentIndex, message.content]);

  /**
   * EXTRACTION DES BALISES <title>
   */
  function extractTitleTags(text: string): string {
    return text.replace(
      /<title>(.*?)<\/title>/gi,
      (match, titleContent) => {
        return titleContent.trim();
      }
    );
  }

  /**
   * FORMATAGE AVANCÉ DES MESSAGES - CORRECTION TEXTE BRUT
   */
  function processMessageContent(text: string): string {
    let processed = text;

    // EXTRACTION DES BALISES TITLE EN PREMIER
    processed = extractTitleTags(processed);

    // Conversion des images
    processed = processed.replace(
      /\[IMAGE:\s*(https?:\/\/[^\]]+)\]/g,
      '![Image]($1)'
    );

    // Gestion des titres de page
    processed = processed.replace(
      /^#\s+(.+)$/gm,
      (match, title) => {
        return `# ${title}\n\n*Document conversation - ${new Date().toLocaleDateString('fr-FR')}*`;
      }
    );

    // Détection du texte brut sans formatage
    if (isPlainText(processed)) {
      processed = formatPlainText(processed);
    }

    // Formatage des tableaux simples
    processed = formatSimpleTables(processed);

    // Formatage des données tabulaires
    processed = formatTabularData(processed);

    return processed;
  }

  /**
   * Détection du texte brut
   */
  function isPlainText(text: string): boolean {
    // Si le texte ne contient pas de markdown basique
    const markdownPatterns = [
      /^#+\s+/m,        // Titres
      /\*\*.+\*\*/,     // Gras
      /\*.+\*/,         // Italique
      /\[.+\]\(.+\)/,   // Liens
      /^-\s+/m,         // Listes
      /^\d+\.\s+/m,     // Listes numérotées
      /^```/,           // Blocs de code
      /^>/m,            // Citations
      /\|.+\|/          // Tableaux
    ];

    return !markdownPatterns.some(pattern => pattern.test(text));
  }

  /**
   * Formatage du texte brut en markdown lisible
   */
  function formatPlainText(text: string): string {
    const lines = text.split('\n');
    const formattedLines = lines.map(line => {
      // Ignorer les lignes vides
      if (line.trim() === '') return line;
      
      // Détection des URLs pour les formater en liens
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      if (urlRegex.test(line)) {
        return line.replace(urlRegex, '[$1]($1)');
      }
      
      // Ajouter un peu d'espacement pour les paragraphes longs
      return line;
    });

    return formattedLines.join('\n');
  }

  /**
   * Formatage des tableaux simples avec pipes
   */
  function formatSimpleTables(text: string): string {
    const tableRegex = /(\|.*\|.*\n?)+/g;
    
    return text.replace(tableRegex, (match) => {
      const lines = match.trim().split('\n');
      
      const hasHeaderSeparator = lines.length > 1 && 
        lines[1].includes('|') && 
        (lines[1].includes('---') || lines[1].includes(':--'));
      
      if (hasHeaderSeparator) {
        return match;
      }
      
      const formattedLines = lines.map(line => {
        const cells = line.split('|').filter(cell => cell.trim() !== '');
        return `| ${cells.join(' | ')} |`;
      });
      
      if (formattedLines.length > 0) {
        const headerSeparator = '|' + formattedLines[0].split('|').slice(1, -1)
          .map(() => ' --- ')
          .join('|') + '|';
        
        formattedLines.splice(1, 0, headerSeparator);
      }
      
      return '\n' + formattedLines.join('\n') + '\n';
    });
  }

  /**
   * Formatage des données tabulaires sans délimiteurs
   */
  function formatTabularData(text: string): string {
    const lines = text.split('\n');
    let inTableBlock = false;
    let tableBlock: string[] = [];
    const result: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      const hasMultipleColumns = line.trim().split(/\s{2,}/).length >= 2;
      const isEmptyLine = line.trim() === '';
      
      if (hasMultipleColumns && !isEmptyLine) {
        if (!inTableBlock) {
          inTableBlock = true;
          tableBlock = [];
        }
        tableBlock.push(line);
      } else {
        if (inTableBlock && tableBlock.length > 0) {
          const formattedTable = formatTableBlock(tableBlock);
          result.push(formattedTable);
          tableBlock = [];
          inTableBlock = false;
        }
        result.push(line);
      }
    }

    if (inTableBlock && tableBlock.length > 0) {
      const formattedTable = formatTableBlock(tableBlock);
      result.push(formattedTable);
    }

    return result.join('\n');
  }

  /**
   * Formate un bloc de données en tableau Markdown
   */
  function formatTableBlock(block: string[]): string {
    if (block.length === 0) return '';

    const rows = block.map(line => {
      return line.trim().split(/\s{2,}/).map(cell => cell.trim());
    });

    const maxCols = Math.max(...rows.map(row => row.length));
    
    const header = `| ${rows[0].concat(Array(maxCols - rows[0].length).fill('')).join(' | ')} |`;
    const separator = `|${Array(maxCols).fill(' --- ').join('|')}|`;
    
    const body = rows.slice(1).map(row => {
      const filledRow = row.concat(Array(maxCols - row.length).fill(''));
      return `| ${filledRow.join(' | ')} |`;
    }).join('\n');

    return `\n${header}\n${separator}\n${body}\n`;
  }

  const processedMessage = processMessageContent(
    isStreaming && isAnimating ? displayedContent : message.content
  );

  /**
   * RENDERERS MARKDOWN AMÉLIORÉS POUR LE TEXTE BRUT
   */
  const renderers = {
    code({ inline, className, children, ...props }: any) {
      const language = className?.replace("language-", "") ?? "plaintext";
      const codeContent = children && children.length > 0 ? children[0] : '';
      
      let highlighted;
      try {
        highlighted = hljs.highlight(codeContent, { language }).value;
      } catch (error) {
        highlighted = hljs.highlightAuto(codeContent).value;
      }

      return inline ? (
        <code className="bg-gray-100 px-2 py-1 rounded-md text-sm border border-gray-200 font-mono text-gray-800 animate-fade-in">
          {children}
        </code>
      ) : (
        <div className="my-4 rounded-xl overflow-hidden shadow-lg border border-gray-200 animate-fade-in">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-2 flex justify-between items-center">
            <span className="text-white text-sm font-medium">{language}</span>
            <button 
              className="text-gray-300 hover:text-white text-xs transition-colors"
              onClick={() => navigator.clipboard.writeText(codeContent)}
            >
              Copier
            </button>
          </div>
          <pre className="bg-gray-900 p-4 overflow-x-auto">
            <code
              className={cn("hljs text-sm leading-relaxed", className)}
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </pre>
        </div>
      );
    },
    
    img({ src, alt }: any) {
      return (
        <div className="my-4 rounded-lg overflow-hidden border border-gray-200 shadow-lg animate-fade-in">
          <img
            src={src}
            alt={alt || 'Image'}
            className="w-full h-auto max-w-2xl mx-auto"
            loading="lazy"
          />
          {alt && alt !== 'Image' && (
            <div className="bg-gray-50 px-3 py-2 text-sm text-gray-600 text-center border-t">
              {alt}
            </div>
          )}
        </div>
      );
    },

    table({ children }: any) {
      return (
        <div className="overflow-x-auto my-6 border border-gray-200 rounded-xl shadow-sm bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            {children}
          </table>
        </div>
      );
    },

    th({ children }: any) {
      return (
        <th className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 text-left font-semibold text-gray-900 border-b border-gray-200">
          {children}
        </th>
      );
    },

    td({ children }: any) {
      return (
        <td className="px-4 py-3 border-b border-gray-100 text-gray-700 hover:bg-gray-50 transition-colors">
          {children}
        </td>
      );
    },

    // STYLE AMÉLIORÉ PLEIN TEXTE - CORRIGÉ
    p({ children }: any) {
      const content = Array.isArray(children) ? children.join('') : String(children);
      
      // Détection améliorée des URLs
      if (content.includes('http') && !content.includes('![')) {
        const urlRegex = /(https?:\/\/[^\s<]+[^\s<.)])/g;
        const parts = content.split(urlRegex);
        
        if (parts.length > 1) {
          return (
            <p className="my-3 leading-relaxed text-gray-800 text-[15px]">
              {parts.map((part, index) => 
                urlRegex.test(part) ? (
                  <a 
                    key={index}
                    href={part} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors break-words"
                  >
                    {part}
                  </a>
                ) : (
                  <span key={index} className="whitespace-pre-wrap">{part}</span>
                )
              )}
            </p>
          );
        }
      }
      
      return (
        <p className="my-3 leading-relaxed text-gray-800 text-[15px] whitespace-pre-wrap">
          {children}
        </p>
      );
    },

    // Style pour le texte brut dans les spans
    span({ children }: any) {
      return (
        <span className="text-gray-800 whitespace-pre-wrap">
          {children}
        </span>
      );
    },

    // Titres avec styles professionnels
    h1({ children }: any) {
      return (
        <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-4 pb-2 border-b border-gray-200">
          {children}
        </h1>
      );
    },

    h2({ children }: any) {
      return (
        <h2 className="text-xl font-semibold text-gray-800 mt-5 mb-3">
          {children}
        </h2>
      );
    },

    h3({ children }: any) {
      return (
        <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
          {children}
        </h3>
      );
    },

    // Listes améliorées
    ul({ children }: any) {
      return <ul className="my-4 space-y-2 list-disc list-inside text-gray-800">{children}</ul>;
    },

    ol({ children }: any) {
      return <ol className="my-4 space-y-2 list-decimal list-inside text-gray-800">{children}</ol>;
    },

    li({ children }: any) {
      return <li className="pl-2 leading-relaxed text-gray-800">{children}</li>;
    },

    // Citations stylisées
    blockquote({ children }: any) {
      return (
        <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600 bg-blue-50 py-2 rounded-r-lg">
          {children}
        </blockquote>
      );
    }
  };

  /**
   * COMPOSANT D'INDICATEUR DE CHARGEMENT AMÉLIORÉ
   */
  const LoadingIndicator = () => (
    <div className="flex items-center gap-3 text-gray-600 animate-pulse">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="text-sm font-medium transition-opacity duration-500 ease-in-out">
        {loadingPhrase}
        <span className="inline-block w-4 text-left">
          {'.'.repeat(dotCount)}
        </span>
      </span>
    </div>
  );

  return (
    <div
      className={cn(
        "flex gap-4 mb-8 animate-in fade-in duration-300 group",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
      onMouseEnter={() => !isUser && setShowActions(true)}
      onMouseLeave={() => !isUser && setShowActions(false)}
    >
      {/* AVATAR PROFESSIONNEL */}
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-lg",
          isUser
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
            : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
        )}
      >
        {isUser ? 
          <User className="w-5 h-5" /> : 
          <Bot className="w-5 h-5" />
        }
      </div>

      {/* BULLE DE MESSAGE */}
      <div
        className={cn(
          "flex flex-col max-w-[85%] md:max-w-[75%] relative",
          isUser ? "items-end" : "items-start"
        )}
      >
        {/* ACTIONS PROFESSIONNELLES */}
        {!isUser && showActions && !isStreaming && (
          <div className="absolute -top-10 right-0 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-10 backdrop-blur-sm">
            <MessageActions content={message.content} />
          </div>
        )}

        <div
          className={cn(
            "rounded-2xl px-5 py-4 shadow-lg transition-all duration-300 backdrop-blur-sm min-w-[200px]",
            isUser
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm"
              : "bg-gradient-to-br from-white to-gray-50 border border-gray-200/80 text-gray-900 rounded-bl-sm",
            isStreaming && !isUser && "pulse-animation"
          )}
        >
          {/* INDICATEUR DE CHARGEMENT */}
          {isStreaming && !isUser && displayedContent.length === 0 && (
            <LoadingIndicator />
          )}

          {/* RENDU MARKDOWN PROFESSIONNEL */}
          {(displayedContent.length > 0 || isUser) && (
            <div className={cn(
              "prose prose-sm max-w-none",
              isUser ? "prose-invert" : "prose-gray",
              "prose-headings:font-semibold",
              "prose-a:font-medium",
              "prose-strong:font-bold",
              "prose-code:font-mono",
              "prose-p:text-gray-800 prose-p:whitespace-pre-wrap" // Correction texte brut
            )}>
              <ReactMarkdown
                components={renderers}
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {processedMessage}
              </ReactMarkdown>

              {/* CURSEUR DE STREAMING AMÉLIORÉ */}
              {isStreaming && isAnimating && !isUser && displayedContent.length > 0 && (
                <span className="ml-1 w-2 h-5 bg-gradient-to-b from-blue-500 to-purple-500 inline-block animate-pulse rounded-sm"></span>
              )}
            </div>
          )}
        </div>

        {/* TIMESTAMP STYLISÉ */}
        {!isStreaming && (
          <span className="text-xs text-gray-500 mt-2 px-2 font-medium">
            {message.timestamp.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })} • {message.timestamp.toLocaleDateString('fr-FR')}
          </span>
        )}
      </div>
    </div>
  );
}