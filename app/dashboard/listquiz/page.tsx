"use client";

import { useProtectedRoute } from "@/hooks/use-protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Star,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Trophy,
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Play,
  Eye,
  X,
  Lightbulb
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Types
interface Question {
  question: string;
  question_type: "ONE_CHOICE" | "MULTIPLE_CHOICE";
  options: string[];
  points: number;
}

interface UserAnswer {
  question: string;
  answer: number[];
  points: number;
}

interface FlashTest {
  _id: string;
  user_id: string;
  book_id: string;
  title: string;
  status: "ACTIVE" | "INACTIVE" | "COMPLETED";
  total_points: number;
  total_user_points: number;
  created_at: string;
  updated_at: string;
  questions?: Question[];
  user_answers?: UserAnswer[];
}

interface FlashTestDetails {
  _id: string;
  title: string;
  total_points: number;
  total_user_points: number;
  questions: Question[];
  user_answers: UserAnswer[];
}

// Modal des résultats
function ResultsModal({
  isOpen,
  onClose,
  testDetails,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  testDetails: FlashTestDetails | null;
  isLoading: boolean;
}) {
  if (!isOpen) return null;

  const scorePercentage = testDetails
    ? Math.round((testDetails.total_user_points / testDetails.total_points) * 100)
    : 0;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 80) return "Excellent travail! 🎉";
    if (percentage >= 60) return "Bon travail! 👍";
    if (percentage >= 40) return "Tu peux faire mieux 📚";
    return "Continue à réviser! 💪";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Résultats du Quiz
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner text="Chargement des résultats..." />
          </div>
        ) : testDetails ? (
          <div className="space-y-6">
            {/* Score principal */}
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className={`text-5xl font-bold mb-2 ${getScoreColor(scorePercentage)}`}>
                {testDetails.total_user_points.toFixed(1)}/{testDetails.total_points}
              </div>
              <div className="text-xl text-gray-600 mb-2">
                {scorePercentage}% de réussite
              </div>
              <p className="text-lg">{getScoreMessage(scorePercentage)}</p>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-green-700">
                  {testDetails.user_answers.filter(a => a.points > 0).length}
                </p>
                <p className="text-xs text-green-600">Correctes</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <XCircle className="w-5 h-5 text-red-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-red-700">
                  {testDetails.user_answers.filter(a => a.points === 0).length}
                </p>
                <p className="text-xs text-red-600">Incorrectes</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <Target className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-blue-700">
                  {testDetails.questions.length}
                </p>
                <p className="text-xs text-blue-600">Questions</p>
              </div>
            </div>

            {/* Détail des réponses */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Détail des corrections
              </h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {testDetails.user_answers.map((result, idx) => {
                  const question = testDetails.questions[idx];
                  if (!question) return null;
                  
                  const isCorrect = result.points > 0;
                  const isPartial = result.points > 0 && result.points < question.points;

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${
                        isCorrect
                          ? isPartial
                            ? "border-yellow-200 bg-yellow-50"
                            : "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`mt-0.5 flex-shrink-0 ${
                          isCorrect
                            ? isPartial ? "text-yellow-600" : "text-green-600"
                            : "text-red-600"
                        }`}>
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm mb-2">
                            {idx + 1}. {result.question}
                          </p>

                          {/* Options sélectionnées */}
                          <div className="space-y-1 mb-2">
                            {question.options.map((option, optIdx) => {
                              const wasSelected = result.answer.includes(optIdx);
                              if (!wasSelected) return null;
                              
                              return (
                                <div
                                  key={optIdx}
                                  className={`text-xs p-1.5 rounded ${
                                    isCorrect
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {isCorrect ? "✓" : "✗"} {option}
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className={`font-medium ${
                              isCorrect
                                ? isPartial ? "text-yellow-700" : "text-green-700"
                                : "text-red-700"
                            }`}>
                              {result.points.toFixed(2)} / {question.points} pts
                            </span>
                            {isPartial && (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-300 text-xs">
                                Partiel
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommandations */}
            {scorePercentage < 80 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Conseil</h4>
                    <p className="text-sm text-blue-700">
                      {scorePercentage < 40
                        ? "Revois les concepts de base avec l'assistant IA avant de continuer."
                        : scorePercentage < 60
                        ? "Concentre-toi sur les questions ratées et pose des questions à l'assistant."
                        : "Tu es sur la bonne voie! Continue à pratiquer pour atteindre l'excellence."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bouton fermer */}
            <div className="flex justify-end pt-2">
              <Button onClick={onClose}>
                Fermer
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Impossible de charger les résultats</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Composant carte de quiz
function QuizCard({
  quiz,
  onViewResults,
  onStartQuiz,
}: {
  quiz: FlashTest;
  onViewResults: (quiz: FlashTest) => void;
  onStartQuiz: (quiz: FlashTest) => void;
}) {
  const isCompleted = quiz.total_user_points > 0;
  const scorePercentage = quiz.total_points > 0
    ? Math.round((quiz.total_user_points / quiz.total_points) * 100)
    : 0;

  const getScoreColor = () => {
    if (!isCompleted) return "text-gray-400";
    if (scorePercentage >= 80) return "text-green-600";
    if (scorePercentage >= 60) return "text-blue-600";
    if (scorePercentage >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = () => {
    if (!isCompleted) return "bg-gray-100";
    if (scorePercentage >= 80) return "bg-green-100";
    if (scorePercentage >= 60) return "bg-blue-100";
    if (scorePercentage >= 40) return "bg-yellow-100";
    return "bg-red-100";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardContent className="pt-6">
        {/* Header avec statut */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge
                variant="outline"
                className={`text-xs ${
                  isCompleted
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }`}
              >
                {isCompleted ? "Complété" : "En attente"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {quiz.total_points} pts
              </Badge>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {quiz.title || "Quiz Flash"}
            </h3>
          </div>

          {/* Score circulaire */}
          <div className={`w-14 h-14 rounded-full ${getScoreBg()} flex items-center justify-center flex-shrink-0`}>
            {isCompleted ? (
              <span className={`text-lg font-bold ${getScoreColor()}`}>
                {scorePercentage}%
              </span>
            ) : (
              <Play className="w-6 h-6 text-gray-400" />
            )}
          </div>
        </div>

        {/* Infos */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatDate(quiz.created_at)}
          </span>
          {isCompleted && (
            <span className={`flex items-center gap-1 ${getScoreColor()}`}>
              <Trophy className="w-4 h-4" />
              {quiz.total_user_points.toFixed(1)}/{quiz.total_points}
            </span>
          )}
        </div>

        {/* Barre de progression si complété */}
        {isCompleted && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  scorePercentage >= 80
                    ? "bg-green-500"
                    : scorePercentage >= 60
                    ? "bg-blue-500"
                    : scorePercentage >= 40
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${scorePercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Bouton action */}
        {isCompleted ? (
          <Button
            className="w-full"
            variant="outline"
            onClick={() => onViewResults(quiz)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir les résultats
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={() => onStartQuiz(quiz)}
          >
            <Play className="w-4 h-4 mr-2" />
            Commencer le quiz
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Composant pagination
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="flex gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className="w-10"
            >
              {pageNum}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default function ListQuizPage() {
  const { loading: authLoading } = useProtectedRoute();
  const router = useRouter();

  const [tests, setTests] = useState<FlashTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestDetails, setSelectedTestDetails] = useState<FlashTestDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Charger les flash tests
  const fetchTests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/flash-tests");

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des quiz");
      }

      const data = await response.json();
      console.log("Reponse API flash-tests:", data);

      if (data.success && Array.isArray(data.tests)) {
        console.log("Tests trouves:", data.tests.length);
        const sortedTests = data.tests.sort(
          (a: FlashTest, b: FlashTest) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setTests(sortedTests);
      } else {
        console.log("Pas de tests ou format invalide");
        setTests([]);
      }
    } catch (err) {
      console.error("Erreur chargement tests:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchTests();
    }
  }, [authLoading]);

  // Voir les résultats dans le modal
  const handleViewResults = async (quiz: FlashTest) => {
    setIsModalOpen(true);
    setIsLoadingDetails(true);
    setSelectedTestDetails(null);

    try {
      const response = await fetch(`/api/flash-test/${quiz._id}`);
      
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des détails");
      }

      const data = await response.json();

      if (data && data.flash_test) {
        setSelectedTestDetails({
          _id: data._id,
          title: data.title,
          total_points: data.total_points,
          total_user_points: data.total_user_points,
          questions: data.flash_test || [],
          user_answers: data.user_answers || [],
        });
      }
    } catch (err) {
      console.error("Erreur chargement détails:", err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Commencer un quiz non complété
  const handleStartQuiz = (quiz: FlashTest) => {
    // Charger le quiz existant avec son ID
    router.push(`/dashboard/quiz?flash_test_id=${quiz._id}`);
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTestDetails(null);
  };

  // Calculs statistiques
  const completedTests = tests.filter((t) => t.total_user_points > 0);
  const pendingTests = tests.filter((t) => t.total_user_points === 0);
  const averageScore =
    completedTests.length > 0
      ? Math.round(
          completedTests.reduce((sum, t) => {
            return sum + (t.total_user_points / t.total_points) * 100;
          }, 0) / completedTests.length
        )
      : 0;

  // Pagination
  const totalPages = Math.ceil(tests.length / itemsPerPage);
  const paginatedTests = tests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Loading
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Chargement des quiz..." />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header uniforme */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Star className="w-8 h-8 text-blue-600" />
              Mes Quiz Flash
            </h1>
            <p className="text-gray-600">
              Retrouve tous tes quiz et suis ta progression
            </p>
          </div>
          <Button variant="outline" onClick={fetchTests} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
              <Button variant="outline" size="sm" onClick={fetchTests} className="ml-auto">
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
                <p className="text-sm text-gray-500">Total quiz</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{completedTests.length}</p>
                <p className="text-sm text-gray-500">Complétés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingTests.length}</p>
                <p className="text-sm text-gray-500">En attente</p>
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
                <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
                <p className="text-sm text-gray-500">Score moyen</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des quiz */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Tous les quiz</CardTitle>
            {tests.length > 0 && (
              <span className="text-sm text-gray-500">
                {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, tests.length)} sur {tests.length}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {tests.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun quiz pour le moment
              </h3>
              <p className="text-gray-500 mb-4">
                Commence une conversation avec l'assistant IA puis génère un quiz!
              </p>
              <Button onClick={() => router.push("/dashboard/chat")}>
                <ArrowRight className="w-4 h-4 mr-2" />
                Aller au chat
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedTests.map((quiz) => (
                  <QuizCard
                    key={quiz._id}
                    quiz={quiz}
                    onViewResults={handleViewResults}
                    onStartQuiz={handleStartQuiz}
                  />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Call to action si pas de quiz en attente */}
      {pendingTests.length === 0 && completedTests.length > 0 && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Tous tes quiz sont complétés!
                </h3>
                <p className="text-sm text-gray-600">
                  Continue à discuter avec l'assistant pour générer de nouveaux quiz.
                </p>
              </div>
              <Button onClick={() => router.push("/dashboard/chat")}>
                Nouveau quiz
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal des résultats */}
      <ResultsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        testDetails={selectedTestDetails}
        isLoading={isLoadingDetails}
      />
    </div>
  );
}
