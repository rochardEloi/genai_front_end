// app/dashboard/chat/page.tsx - Version avec historique intégré
"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { useChat } from "@/hooks/use-chat";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Plus,
  Search,
  Clock,
  ArrowRight,
  ArrowLeft,
  Play,
  Sparkles,
  BookOpen,
  TrendingUp,
  RefreshCw,
  Star,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

// Types
interface ApiSubject {
  _id: string;
  name: string;
  type: string;
  status: string;
  datas: {
    entriesAdded: number;
    uniqueId: string;
    loaderType: string;
  };
  created_at: string;
  updated_at: string;
  __v: number;
}

interface ExistingConversation {
  _id: string;
  title: string;
  status: string;
  user_id: string;
  selected_book_id: string;
  created_at: string;
  updated_at: string;
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
    _id: string;
  }>;
  memories: string;
  __v: number;
}

interface ChatHistory {
  _id: string;
  title: string;
  date: string;
  duration: string;
  messageCount: number;
  subject: string;
  preview: string;
  selected_book_id: string;
  created_at?: string;
  updated_at?: string;
}

type SubjectKey = string;

interface SubjectConfig {
  key: SubjectKey;
  label: string;
  emoji: string;
  hint: string;
}

// Mapping des emojis par nom de matière
const SUBJECT_EMOJIS: Record<string, string> = {
  "Mathématiques": "📐",
  "Maths": "📐",
  "Physique": "⚡",
  "Chimie": "🧪",
  "Français": "📖",
  "Histoire": "📜",
  "Géographie": "🌍",
  "Anglais": "🔠",
  "SVT": "🔬",
  "Philosophie": "💭",
};

const generateHint = (subjectName: string): string => {
  const hints: Record<string, string> = {
    "Mathématiques": "Dérivées, fonctions, probabilités…",
    "Maths": "Dérivées, fonctions, probabilités…",
    "Physique": "Mécanique, électricité, optique…",
    "Chimie": "Réactions, molécules, équations…",
    "Français": "Commentaire, grammaire, rédaction…",
    "Histoire": "Dates, événements, analyses…",
    "Géographie": "Cartes, territoires, enjeux…",
    "Anglais": "Grammaire, vocabulaire, conversation…",
    "SVT": "Biologie, géologie, écologie…",
    "Philosophie": "Concepts, auteurs, dissertations…",
  };
  return hints[subjectName] || "Cours et exercices personnalisés…";
};

function ChatPageContent() {
  const { loading: authLoading } = useProtectedRoute();
  const { messages, isLoading, sendMessage, clearChat, loadExistingConversation } = useChat();
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('id');

  // États principaux
  const [selectedSubject, setSelectedSubject] = useState<SubjectKey | null>(null);
  const [chatVersion, setChatVersion] = useState(0);
  const [subjects, setSubjects] = useState<SubjectConfig[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [conversationError, setConversationError] = useState<string | null>(null);

  // États pour l'historique
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // État pour le modal de nouvelle conversation
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  // États pour les modals de quiz
  const [showQuizConfirmModal, setShowQuizConfirmModal] = useState(false);
  const [showQuizCreatingModal, setShowQuizCreatingModal] = useState(false);
  const [quizBookId, setQuizBookId] = useState<string | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);

  // Fetch des matières
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setSubjectsLoading(true);
        setSubjectsError(null);
        
        const response = await fetch('/api/subjects');
        if (!response.ok) throw new Error(`Erreur ${response.status}`);
        
        const data = await response.json();
        if (!data || !Array.isArray(data.subjects)) throw new Error('Format invalide');
        
        const transformedSubjects: SubjectConfig[] = data.subjects
          .filter((subject: ApiSubject) => subject.status === "enable")
          .map((subject: ApiSubject) => ({
            key: subject._id,
            label: subject.name,
            emoji: SUBJECT_EMOJIS[subject.name] || "📚",
            hint: generateHint(subject.name),
          }));
        
        setSubjects(transformedSubjects);
      } catch (error) {
        console.error('Erreur chargement matières:', error);
        setSubjectsError('Impossible de charger les matières.');
        setSubjects([
          { key: "maths", label: "Mathématiques", emoji: "📐", hint: "Dérivées, fonctions…" },
          { key: "physics", label: "Physique", emoji: "⚡", hint: "Mécanique, électricité…" },
          { key: "chemistry", label: "Chimie", emoji: "🧪", hint: "Réactions, molécules…" },
          { key: "french", label: "Français", emoji: "📖", hint: "Commentaire, grammaire…" },
        ]);
      } finally {
        setSubjectsLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch de l'historique
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setHistoryLoading(true);
        const response = await fetch('/api/history');
        if (response.ok) {
          const data = await response.json();
          // Trier par date décroissante (plus récent en premier)
          const sortedData = Array.isArray(data) 
            ? data.sort((a: ChatHistory, b: ChatHistory) => 
                new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime()
              )
            : data;
          setChatHistory(sortedData);
        }
      } catch (error) {
        console.error('Erreur chargement historique:', error);
      } finally {
        setHistoryLoading(false);
      }
    };
    if (!authLoading) fetchHistory();
  }, [authLoading]);

  // Chargement conversation existante
  useEffect(() => {
    const loadConversation = async () => {
      if (conversationId && subjects.length > 0 && !isLoadingConversation) {
        try {
          setIsLoadingConversation(true);
          setConversationError(null);
          
          const conversation: ExistingConversation = await loadExistingConversation(conversationId);
          const subjectConfig = subjects.find(s => s.key === conversation.selected_book_id);
          
          if (subjectConfig) {
            setSelectedSubject(conversation.selected_book_id);
          } else {
            setConversationError('Matière non trouvée');
          }
        } catch (error) {
          console.error('Erreur chargement conversation:', error);
          setConversationError('Impossible de charger la conversation.');
        } finally {
          setIsLoadingConversation(false);
        }
      }
    };

    if (conversationId && !isLoadingConversation && selectedSubject === null) {
      loadConversation();
    }
  }, [conversationId, subjects, subjectsLoading, loadExistingConversation, isLoadingConversation, selectedSubject]);

  const selectedSubjectConfig = useMemo(
    () => subjects.find((s) => s.key === selectedSubject) || null,
    [selectedSubject, subjects]
  );

  // Filtrage de l'historique
  const filteredHistory = useMemo(() => {
    return chatHistory.filter((chat) => {
      const matchesSearch =
        chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.preview.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = selectedFilter === "all" || chat.subject === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [chatHistory, searchTerm, selectedFilter]);

  // Pagination
  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredHistory.slice(start, start + itemsPerPage);
  }, [filteredHistory, currentPage]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  // Handlers
  const handleNewChat = () => {
    setShowNewChatModal(true);
  };

  const handleSelectSubjectForNewChat = (subjectKey: SubjectKey) => {
    clearChat();
    setSelectedSubject(subjectKey);
    setChatVersion(prev => prev + 1);
    setShowNewChatModal(false);
    router.push('/dashboard/chat');
  };

  const handleContinueConversation = (chatId: string) => {
    router.push(`/dashboard/chat?id=${chatId}`);
  };

  const handleTakeQuiz = (selected_book_id: string) => {
    setQuizBookId(selected_book_id);
    setQuizError(null);
    setShowQuizConfirmModal(true);
  };

  const handleConfirmQuiz = async () => {
    if (!quizBookId) return;
    
    setShowQuizConfirmModal(false);
    setShowQuizCreatingModal(true);
    setQuizError(null);

    try {
      const response = await fetch('/api/flash-test/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected_book_id: quizBookId }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Erreur lors de la creation du quiz');
      }

      const data = await response.json();
      
      if (!data.flash_test_id) {
        throw new Error('ID du quiz non recu');
      }

      // Rediriger vers la page quiz avec l'ID
      router.push(`/dashboard/quiz?flash_test_id=${data.flash_test_id}`);
    } catch (err) {
      console.error('Erreur creation quiz:', err);
      setQuizError(err instanceof Error ? err.message : 'Erreur inconnue');
      setShowQuizCreatingModal(false);
    }
  };

  const handleCancelQuiz = () => {
    setShowQuizConfirmModal(false);
    setQuizBookId(null);
  };

  const handleBackToHistory = () => {
    clearChat();
    setSelectedSubject(null);
    setChatVersion(prev => prev + 1);
    router.push('/dashboard/chat');
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedSubjectConfig) return;
    await sendMessage(content, selectedSubjectConfig.key);
  };

  const refreshHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await fetch('/api/history');
      if (response.ok) {
        const data = await response.json();
        // Trier par date décroissante (plus récent en premier)
        const sortedData = Array.isArray(data) 
          ? data.sort((a: ChatHistory, b: ChatHistory) => 
              new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime()
            )
          : data;
        setChatHistory(sortedData);
      }
    } catch (error) {
      console.error('Erreur refresh:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Loading state
  if (authLoading || subjectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner text="Chargement de ton espace d'étude..." />
      </div>
    );
  }

  // Mode Chat actif
  if (selectedSubjectConfig) {
    return (
      <div key={chatVersion} className="flex flex-col h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header */}
        <div className="flex-shrink-0">
          <ChatHeader onNewChat={handleNewChat} />
        </div>

        {/* Barre d'info matière */}
        <div className="flex-shrink-0 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                <span className="mr-1 h-2 w-2 rounded-full bg-emerald-500" />
                Assistant IA Horizon
              </span>
              <span className="text-sm text-slate-500">
                {conversationId ? "Conversation reprise" : "Nouvelle conversation"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm">
                <span>{selectedSubjectConfig.emoji}</span>
                <span className="font-medium">{selectedSubjectConfig.label}</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToHistory}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <MessageList messages={messages} isLoading={isLoading} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 border-t border-slate-200 bg-white/95 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-3 space-y-2">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder={`Pose ta question sur ${selectedSubjectConfig.label}...`}
            />
            <p className="text-xs text-slate-400 text-center">
              Astuce : donne le contexte (chapitre, type d'exercice) pour des réponses précises.
            </p>
          </div>
        </div>

        {/* Modal nouvelle conversation */}
        <Dialog open={showNewChatModal} onOpenChange={setShowNewChatModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Nouvelle conversation
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              <p className="text-sm text-slate-600">Choisis une matière pour commencer :</p>
              <div className="grid grid-cols-2 gap-2">
                {subjects.map((subject) => (
                  <button
                    key={subject.key}
                    onClick={() => handleSelectSubjectForNewChat(subject.key)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                  >
                    <span className="text-2xl">{subject.emoji}</span>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{subject.label}</p>
                      <p className="text-xs text-slate-500">{subject.hint}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Mode Historique (page d'accueil du chat)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenu */}
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-blue-600" />
                Mes conversations
              </h1>
              <p className="text-gray-600">
                Discute avec ton assistant IA et retrouve tes conversations
              </p>
            </div>
           {/*  <Button onClick={handleNewChat} className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle conversation
            </Button> */}
          </div>
        </div>
          
          {/* Stats rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{chatHistory.length}</p>
                    <p className="text-sm text-slate-500">Conversations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {chatHistory.reduce((acc, chat) => acc + parseInt(chat.duration || '0'), 0)} min
                    </p>
                    <p className="text-sm text-slate-500">Temps total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {new Set(chatHistory.map((chat) => chat.subject)).size}
                    </p>
                    <p className="text-sm text-slate-500">Matières couvertes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Carte nouvelle conversation */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Commence une nouvelle discussion</h3>
                    <p className="text-sm text-slate-600">
                      Pose tes questions, demande des explications ou de l'aide pour tes exercices.
                    </p>
                  </div>
                </div>
                <Button onClick={handleNewChat} size="lg" className="gap-2 whitespace-nowrap">
                  <Plus className="w-4 h-4" />
                  Démarrer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recherche et filtres */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <select
              className="px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={selectedFilter}
              onChange={(e) => {
                setSelectedFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Toutes les matières</option>
              {Array.from(new Set(chatHistory.map(c => c.subject))).map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <button
              onClick={refreshHistory}
              disabled={historyLoading}
              className="p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              title="Actualiser"
            >
              <RefreshCw className={`w-5 h-5 text-slate-600 ${historyLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Liste des conversations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Conversations récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner text="Chargement de l'historique..." />
                </div>
              ) : paginatedHistory.length > 0 ? (
                <div className="space-y-3">
                  {paginatedHistory.map((chat) => (
                    <div
                      key={chat._id}
                      className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-slate-900 line-clamp-1">{chat.title}</h3>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded flex-shrink-0 ml-2">
                          {chat.subject}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">{chat.preview}</p>
                      <div className="flex justify-between items-center">
                       {/*  <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>{chat.date}</span>
                          <span>•</span>
                          <span>{chat.duration}</span>
                          <span>•</span>
                          <span>{chat.messageCount} messages</span>
                        </div> */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleContinueConversation(chat._id)}
                            className="gap-1"
                          >
                            Continuer
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTakeQuiz(chat.selected_book_id)}
                            className="gap-1"
                          >
                            Quiz
                            <Play className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Précédent
                      </Button>
                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Suivant
                      </Button>
                    </div>
                  )}

                  <p className="text-center text-xs text-slate-500 pt-2">
                    Page {currentPage} sur {totalPages} • {filteredHistory.length} conversation{filteredHistory.length > 1 ? 's' : ''}
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-slate-600 font-medium">
                    {searchTerm || selectedFilter !== "all"
                      ? "Aucune conversation trouvée"
                      : "Aucune conversation pour le moment"}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {searchTerm || selectedFilter !== "all"
                      ? "Essayez de modifier vos critères de recherche"
                      : "Commence ta première conversation avec l'assistant IA"}
                  </p>
                  {/* {!searchTerm && selectedFilter === "all" && (
                    <Button onClick={handleNewChat} className="mt-4 gap-2">
                      <Plus className="w-4 h-4" />
                      Nouvelle conversation
                    </Button>
                  )} */}
                </div>
              )}
            </CardContent>
          </Card>
      </div>

      {/* Modal nouvelle conversation */}
      <Dialog open={showNewChatModal} onOpenChange={setShowNewChatModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Nouvelle conversation
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-sm text-slate-600">
              Choisis une matière pour commencer ta conversation avec l'assistant IA :
            </p>
            
            {subjectsError && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">{subjectsError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {subjects.map((subject) => (
                <button
                  key={subject.key}
                  onClick={() => handleSelectSubjectForNewChat(subject.key)}
                  className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">{subject.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900">{subject.label}</p>
                    <p className="text-xs text-slate-500 truncate">{subject.hint}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Loading conversation overlay */}
      {isLoadingConversation && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <LoadingSpinner text="Chargement de la conversation..." />
        </div>
      )}

      {/* Error toast */}
      {conversationError && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50">
          <p className="text-sm text-red-800">{conversationError}</p>
          <button
            onClick={() => setConversationError(null)}
            className="mt-2 text-sm text-red-600 underline"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Quiz error toast */}
      {quizError && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Erreur de creation du quiz</p>
              <p className="text-sm text-red-600 mt-1">{quizError}</p>
              <button
                onClick={() => setQuizError(null)}
                className="mt-2 text-sm text-red-600 underline"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmation quiz */}
      <Dialog open={showQuizConfirmModal} onOpenChange={setShowQuizConfirmModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-600" />
              Generer un Quiz
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-slate-600">
              Tu es sur le point de generer un quiz base sur cette conversation. 
              Le quiz testera tes connaissances sur les sujets abordes.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Le quiz sera genere par l'IA et contiendra des questions a choix unique et multiple.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleCancelQuiz}>
                Annuler
              </Button>
              <Button onClick={handleConfirmQuiz} className="gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Confirmer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal creation quiz en cours */}
      <Dialog open={showQuizCreatingModal} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Generation du quiz en cours...
            </h3>
            <p className="text-slate-600 text-sm">
              L'IA analyse la conversation et cree des questions pertinentes.
            </p>
            <p className="text-slate-500 text-xs mt-4">
              Cela peut prendre quelques secondes...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner text="Chargement..." />
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}
