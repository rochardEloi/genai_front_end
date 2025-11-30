"use client";

import { useProtectedRoute } from "@/hooks/use-protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Trophy, 
  BookOpen,
  Target,
  AlertCircle,
  Lightbulb
} from "lucide-react";

interface Question {
  question: string;
  question_type: "ONE_CHOICE" | "MULTIPLE_CHOICE";
  options: string[];
  points: number;
  _id?: string;
}

interface QuizData {
  _id: string;
  title: string;
  flash_test: Question[];
  total_points: number;
  total_user_points: number;
  user_answers: Array<{ answer: number[]; points: number }>;
}

interface CorrectionResult {
  total_user_points: number;
  total_points: number;
  user_answers: Array<{ question: string; answer: number[]; points: number }>;
}

type QuizState = "loading" | "already_done" | "answering" | "submitting" | "results" | "error";

export default function QuizPage() {
  const { loading: authLoading } = useProtectedRoute();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const flashTestId = searchParams.get("flash_test_id");
  
  const [quizState, setQuizState] = useState<QuizState>("loading");
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[][]>([]);
  const [correctionResult, setCorrectionResult] = useState<CorrectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (authLoading) return;

    const loadQuiz = async () => {
      if (!flashTestId) {
        setError("ID du quiz manquant");
        setQuizState("error");
        return;
      }

      try {
        setQuizState("loading");
        console.log("Chargement quiz:", flashTestId);
        
        const res = await fetch(`/api/flash-test/${flashTestId}`);
        if (!res.ok) throw new Error("Impossible de charger le quiz");
        
        const data = await res.json();
        console.log("Quiz charge:", data);
        
        if (!data || !data.flash_test) {
          throw new Error("Quiz invalide ou non trouve");
        }
        
        setQuizData(data);
        
        // Verifier si le quiz a deja ete fait
        if (data.user_answers && data.user_answers.length > 0) {
          setQuizState("already_done");
        } else {
          // Quiz pas encore fait, preparer les reponses
          setUserAnswers(data.flash_test.map(() => []));
          setQuizState("answering");
        }
        
      } catch (err) {
        console.error("Erreur chargement quiz:", err);
        setError(err instanceof Error ? err.message : "Erreur");
        setQuizState("error");
      }
    };

    loadQuiz();
  }, [authLoading, flashTestId]);

  const submitQuiz = async () => {
    if (!quizData) return;
    
    try {
      setQuizState("submitting");
      
      const res = await fetch("/api/flash-test/correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flash_test_id: quizData._id,
          user_answers: userAnswers.map((a) => ({ answer: a }))
        }),
      });
      
      if (!res.ok) throw new Error("Erreur correction");
      
      const result = await res.json();
      setCorrectionResult({
        total_user_points: result.total_user_points,
        total_points: result.total_points,
        user_answers: quizData.flash_test.map((q, i) => ({
          question: q.question,
          answer: userAnswers[i],
          points: result.user_answers?.[i]?.points || 0
        }))
      });
      setQuizState("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
      setQuizState("error");
    }
  };

  const handleAnswerChange = (qIdx: number, optIdx: number) => {
    const q = quizData?.flash_test[qIdx];
    if (!q) return;
    
    setUserAnswers((prev) => {
      const next = [...prev];
      if (q.question_type === "MULTIPLE_CHOICE") {
        if (next[qIdx].includes(optIdx)) {
          next[qIdx] = next[qIdx].filter((i) => i !== optIdx);
        } else {
          next[qIdx] = [...next[qIdx], optIdx];
        }
      } else {
        next[qIdx] = [optIdx];
      }
      return next;
    });
  };

  const goNext = () => {
    if (quizData && currentQuestionIndex < quizData.flash_test.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    }
  };
  
  const goPrev = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((i) => i - 1);
  };
  
  const goToChat = () => router.push("/dashboard/chat");
  const goToList = () => router.push("/dashboard/listquiz");

  const answered = userAnswers.filter((a) => a.length > 0).length;
  const total = quizData?.flash_test.length || 0;
  const complete = answered === total && total > 0;
  
  const pct = correctionResult
    ? Math.round((correctionResult.total_user_points / correctionResult.total_points) * 100)
    : 0;

  const scoreColor = (p: number) => {
    if (p >= 80) return "text-green-600";
    if (p >= 60) return "text-blue-600";
    if (p >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  // Loading
  if (authLoading || quizState === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Chargement du quiz..." />
      </div>
    );
  }

  // Error
  if (quizState === "error") {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Star className="w-8 h-8 text-blue-600" />
            Quiz Flash
          </h1>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <p className="text-red-600 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={goToList}>Mes quiz</Button>
              <Button onClick={goToChat}>Retour au chat</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz deja fait
  if (quizState === "already_done" && quizData) {
    const existingPct = Math.round((quizData.total_user_points / quizData.total_points) * 100);
    
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            Quiz deja complete
          </h1>
        </div>
        
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="pt-8 pb-8 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Tu as deja repondu a ce quiz!
            </h2>
            <div className={`text-4xl font-bold mb-2 ${scoreColor(existingPct)}`}>
              {quizData.total_user_points}/{quizData.total_points} points
            </div>
            <p className="text-gray-600 mb-6">
              Score: {existingPct}%
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Les quiz ne peuvent etre faits qu'une seule fois. 
              Tu peux consulter tes resultats dans la liste des quiz.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={goToList}>
                <Star className="w-4 h-4 mr-2" />
                Voir mes quiz
              </Button>
              <Button onClick={goToChat}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results
  if (quizState === "results" && correctionResult && quizData) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Resultats
          </h1>
        </div>

        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="pt-8 pb-8 text-center">
            <div className={`text-5xl font-bold mb-2 ${scoreColor(pct)}`}>
              {correctionResult.total_user_points.toFixed(1)}/{correctionResult.total_points}
            </div>
            <div className="text-xl text-gray-600">{pct}%</div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4 text-center">
              <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <p className="text-xl font-bold">{correctionResult.user_answers.filter((a) => a.points > 0).length}</p>
              <p className="text-xs text-gray-500">Correctes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <XCircle className="w-6 h-6 text-red-600 mx-auto mb-1" />
              <p className="text-xl font-bold">{correctionResult.user_answers.filter((a) => a.points === 0).length}</p>
              <p className="text-xs text-gray-500">Incorrectes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Target className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-xl font-bold">{total}</p>
              <p className="text-xs text-gray-500">Questions</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Corrections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {correctionResult.user_answers.map((r, idx) => {
              const q = quizData.flash_test[idx];
              const ok = r.points > 0;
              return (
                <div key={idx} className={`p-3 rounded-lg border ${ok ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                  <div className="flex items-start gap-2">
                    {ok ? <CheckCircle2 className="w-4 h-4 text-green-600 mt-1" /> : <XCircle className="w-4 h-4 text-red-600 mt-1" />}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{idx + 1}. {r.question}</p>
                      <div className="mt-1 space-y-1">
                        {q.options.map((opt, oi) => {
                          const sel = r.answer.includes(oi);
                          if (!sel) return null;
                          return (
                            <div key={oi} className={`text-xs p-1 rounded ${ok ? "bg-green-100" : "bg-red-100"}`}>
                              {ok ? "✓" : "✗"} {opt}
                            </div>
                          );
                        })}
                      </div>
                      <p className={`text-xs mt-1 ${ok ? "text-green-700" : "text-red-700"}`}>
                        {r.points.toFixed(2)} / {q.points} pts
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {pct < 80 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Conseil</p>
                  <p className="text-sm text-blue-700">
                    Continue a pratiquer avec l'assistant IA pour ameliorer tes connaissances!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={goToList}>Mes quiz</Button>
          <Button onClick={goToChat}>Retour au chat</Button>
        </div>
      </div>
    );
  }

  // Answering
  if ((quizState === "answering" || quizState === "submitting") && quizData) {
    const q = quizData.flash_test[currentQuestionIndex];
    const multi = q.question_type === "MULTIPLE_CHOICE";

    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Star className="w-8 h-8 text-blue-600" />
              Quiz Flash
            </h1>
            <p className="text-gray-600">Teste tes connaissances</p>
          </div>
          <Button variant="outline" onClick={goToChat}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Quitter
          </Button>
        </div>

        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex justify-between mb-2 text-sm">
              <span>Question {currentQuestionIndex + 1}/{total}</span>
              <span>{answered}/{total} repondues</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / total) * 100}%` }} />
            </div>
            <div className="flex gap-1 flex-wrap">
              {quizData.flash_test.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQuestionIndex(i)}
                  className={`w-8 h-8 rounded-full text-xs font-medium ${
                    i === currentQuestionIndex
                      ? "bg-blue-600 text-white"
                      : userAnswers[i]?.length > 0
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-100">
          <CardContent className="pt-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold flex-1">{q.question}</h3>
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full ml-4">
                {q.points} pt{q.points > 1 ? "s" : ""}
              </span>
            </div>

            <div className={`mb-4 p-2 rounded text-sm ${multi ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}>
              {multi ? "Choix multiples - Selectionne TOUTES les bonnes reponses" : "Choix unique - Selectionne UNE reponse"}
            </div>

            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const sel = userAnswers[currentQuestionIndex]?.includes(oi);
                return (
                  <button
                    key={oi}
                    onClick={() => handleAnswerChange(currentQuestionIndex, oi)}
                    className={`w-full text-left p-3 rounded-lg border-2 ${
                      sel
                        ? multi
                          ? "border-purple-500 bg-purple-50"
                          : "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 flex items-center justify-center border-2 ${multi ? "rounded" : "rounded-full"} ${
                        sel ? (multi ? "border-purple-500 bg-purple-500" : "border-blue-500 bg-blue-500") : "border-gray-300"
                      }`}>
                        {sel && (multi ? <CheckCircle2 className="w-3 h-3 text-white" /> : <div className="w-2 h-2 rounded-full bg-white" />)}
                      </div>
                      <span className={sel ? "font-medium" : ""}>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={goPrev} disabled={currentQuestionIndex === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Precedent
          </Button>
          {currentQuestionIndex < total - 1 ? (
            <Button onClick={goNext}>
              Suivant <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </Button>
          ) : (
            <Button onClick={submitQuiz} disabled={!complete || quizState === "submitting"} className="bg-green-600 hover:bg-green-700">
              {quizState === "submitting" ? <LoadingSpinner size="sm" /> : <><CheckCircle2 className="w-4 h-4 mr-2" /> Terminer</>}
            </Button>
          )}
        </div>

        {!complete && currentQuestionIndex === total - 1 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-3 pb-3">
              <p className="text-sm text-yellow-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Reponds a toutes les questions ({total - answered} restante{total - answered > 1 ? "s" : ""})
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner text="Chargement..." />
    </div>
  );
}
