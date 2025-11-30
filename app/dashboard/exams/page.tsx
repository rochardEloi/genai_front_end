"use client";

import { useProtectedRoute } from "@/hooks/use-protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText,
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Printer,
  Plus,
  List,
  Eye,
  Clock,
  ChevronRight
} from "lucide-react";
import ReactMarkdown from 'react-markdown';

// Interface pour les examens
interface Exam {
  _id: string;
  title: string;
  user_id: string;
  profile: string;
  subject: string;
  exam?: string;
  __v?: number;
}

// Profils disponibles
const PROFILES = [
  { value: 'LLA', label: 'LLA (Littéraire)', color: 'bg-amber-500' },
  { value: 'SES', label: 'SES (Économie)', color: 'bg-green-500' },
  { value: 'SMP', label: 'SMP (Maths-Physique)', color: 'bg-blue-500' },
  { value: 'SVT', label: 'SVT (Scientifique)', color: 'bg-purple-500' },
];

// Matières disponibles avec mapping
const SUBJECTS = [
  { value: 'Maths', label: 'Mathématiques', emoji: '📐' },
  { value: 'Physiques', label: 'Physique', emoji: '⚡' },
  { value: 'Chimie', label: 'Chimie', emoji: '🧪' },
  { value: 'Informatique', label: 'Informatique', emoji: '💻' },
  { value: 'Philosophie', label: 'Philosophie', emoji: '🤔' },
  { value: 'Hist & Geo', label: 'Histoire et Géographie', emoji: '🌍' },
  { value: 'Economie', label: 'Économie', emoji: '📊' },
  { value: 'Anglais', label: 'Anglais', emoji: '🇬🇧' },
  { value: 'Espagnol', label: 'Espagnol', emoji: '🇪🇸' },
  { value: 'Kreyol', label: 'Créole', emoji: '🇭🇹' },
  { value: 'SVT', label: 'SVT', emoji: '🌱' },
  { value: 'Geologie', label: 'Géologie', emoji: '🪨' },
  { value: 'Musiques & Art', label: 'Musique et Arts', emoji: '🎨' },
];

// Couleurs des profils
const PROFILE_COLORS: Record<string, string> = {
  'LLA': 'bg-amber-500',
  'SES': 'bg-green-500',
  'SMP': 'bg-blue-500',
  'SVT': 'bg-purple-500',
};

// Emojis des matières
const SUBJECT_EMOJIS: Record<string, string> = {
  'maths': '📐',
  'physique': '⚡',
  'physiques': '⚡',
  'chimie': '🧪',
  'informatique': '💻',
  'philosophie': '🤔',
  'hist & geo': '🌍',
  'economie': '📊',
  'anglais': '🇬🇧',
  'espagnol': '🇪🇸',
  'kreyol': '🇭🇹',
  'svt': '🌱',
  'geologie': '🪨',
  'musiques & art': '🎨',
};

// Composant pour afficher un examen
function ExamDisplay({ exam, onBack, onPrint }: { exam: { title: string; exam: string }; onBack: () => void; onPrint: () => void }) {
  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 print:bg-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900">{exam.title}</CardTitle>
                <p className="text-sm text-gray-500">Examen</p>
              </div>
            </div>
            <div className="flex gap-2 print:hidden">
              <Button variant="outline" size="sm" onClick={onPrint} className="gap-2">
                <Printer className="w-4 h-4" />
                Imprimer
              </Button>
              <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-8 pb-8 px-6 md:px-10 lg:px-16">
          <div className="exam-content max-w-3xl mx-auto">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-lg md:text-xl font-bold text-center mb-2 text-gray-900 uppercase tracking-wide">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base md:text-lg font-bold mt-8 mb-4 text-gray-900 border-b-2 border-blue-500 pb-2 inline-block">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-semibold mt-6 mb-3 text-gray-800">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 text-gray-700 leading-relaxed text-justify">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-gray-900">{children}</strong>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-700">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-700 leading-relaxed pl-1">
                    {children}
                  </li>
                ),
                hr: () => (
                  <hr className="my-8 border-t-2 border-gray-200" />
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono text-blue-700">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto my-4 text-sm">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-amber-400 bg-amber-50 pl-4 py-3 my-4 italic text-gray-700">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {exam.exam}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4 print:hidden">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </Button>
        <Button onClick={onPrint} className="gap-2">
          <Printer className="w-4 h-4" />
          Imprimer l'examen
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 print:hidden">
        <p className="text-sm text-blue-800">
          <strong>💡 Conseil:</strong> Imprime cet examen et résous-le dans les conditions réelles (3 heures, sans téléphone). 
          Cela t'aidera à mieux te préparer pour le jour J.
        </p>
      </div>
    </>
  );
}

export default function ExamGeneratorPage() {
  const { loading: authLoading } = useProtectedRoute();
  const router = useRouter();
  
  // États pour la vue
  const [activeTab, setActiveTab] = useState<'generate' | 'list'>('list');
  
  // États pour la génération
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedExam, setGeneratedExam] = useState<{ exam: string; title: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // États pour la liste des examens
  const [myExams, setMyExams] = useState<Exam[]>([]);
  const [isLoadingExams, setIsLoadingExams] = useState(true);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  // Charger les examens au montage
  useEffect(() => {
    fetchMyExams();
  }, []);

  const fetchMyExams = async () => {
    try {
      setIsLoadingExams(true);
      const response = await fetch('/api/exams/my-exams');
      if (response.ok) {
        const data = await response.json();
        // Trier par date décroissante (plus récents en premier)
        const sortedData = data.sort((a: Exam, b: Exam) => {
          // Utiliser l'_id MongoDB qui contient un timestamp
          return b._id.localeCompare(a._id);
        });
        setMyExams(sortedData);
      }
    } catch (err) {
      console.error('Erreur chargement examens:', err);
    } finally {
      setIsLoadingExams(false);
    }
  };

  const handleGenerateExam = async () => {
    if (!selectedProfile || !selectedSubject) {
      setError("Veuillez sélectionner un profil et une matière");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedExam(null);

    try {
      const response = await fetch('/api/exams/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject.toLowerCase(),
          profile: selectedProfile
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération de l\'examen');
      }

      const data = await response.json();
      setGeneratedExam(data);
      fetchMyExams();
    } catch (err) {
      console.error('Erreur génération examen:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBackToList = () => {
    setSelectedExam(null);
    setGeneratedExam(null);
    setSelectedProfile('');
    setSelectedSubject('');
    setError(null);
  };

  const handleViewExam = (exam: Exam) => {
    if (exam.exam) {
      setSelectedExam(exam);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Chargement..." />
      </div>
    );
  }

  // Examen à afficher (généré ou sélectionné)
  const examToDisplay = generatedExam || (selectedExam?.exam ? { exam: selectedExam.exam, title: selectedExam.title } : null);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              Générateur d'Examen
            </h1>
            <p className="text-gray-600">
              Génère des examens officiels pour t'entraîner au Baccalauréat
            </p>
          </div>
          {examToDisplay ? (
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la liste
            </Button>
          ) : (
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          )}
        </div>
      </div>

      {examToDisplay ? (
        <ExamDisplay 
          exam={examToDisplay} 
          onBack={handleBackToList} 
          onPrint={handlePrint} 
        />
      ) : (
        <>
          {/* Onglets */}
          <div className="flex gap-2 border-b border-gray-200 pb-0">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'list'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
              Mes Examens ({myExams.filter(e => e.exam).length})
            </button>
            <button
              onClick={() => setActiveTab('generate')}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'generate'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              Générer un examen
            </button>
          </div>

          {activeTab === 'list' ? (
            /* Liste des examens */
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <List className="w-5 h-5 text-blue-600" />
                    Mes examens générés
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={fetchMyExams} disabled={isLoadingExams}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingExams ? 'animate-spin' : ''}`} />
                    Actualiser
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingExams ? (
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner text="Chargement des examens..." />
                  </div>
                ) : myExams.filter(e => e.exam).length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Aucun examen généré</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Génère ton premier examen pour commencer à t'entraîner
                    </p>
                    <Button className="mt-4 gap-2" onClick={() => setActiveTab('generate')}>
                      <Plus className="w-4 h-4" />
                      Générer un examen
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myExams.filter(exam => exam.exam).map((exam) => (
                      <div
                        key={exam._id}
                        className="border rounded-lg p-4 transition-all hover:bg-gray-50 cursor-pointer hover:border-blue-300"
                        onClick={() => handleViewExam(exam)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {SUBJECT_EMOJIS[exam.subject.toLowerCase()] || '📝'}
                            </span>
                            <div>
                              <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full text-white ${PROFILE_COLORS[exam.profile] || 'bg-gray-500'}`}>
                                  {exam.profile}
                                </span>
                                <span className="text-xs text-gray-500 capitalize">
                                  {exam.subject}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="gap-2">
                              <Eye className="w-4 h-4" />
                              Voir
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            /* Onglet génération */
            <>
              {/* Sélection du profil */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    1. Choisis ton profil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {PROFILES.map((profile) => (
                      <button
                        key={profile.value}
                        onClick={() => setSelectedProfile(profile.value)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedProfile === profile.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full ${profile.color} mb-2`} />
                        <p className="font-semibold text-gray-900">{profile.value}</p>
                        <p className="text-xs text-gray-500">{profile.label.split('(')[1]?.replace(')', '')}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sélection de la matière */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    2. Choisis une matière
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {SUBJECTS.map((subject) => (
                      <button
                        key={subject.value}
                        onClick={() => setSelectedSubject(subject.value)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedSubject === subject.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{subject.emoji}</span>
                        <p className="font-medium text-gray-900 text-sm">{subject.label}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Erreur */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Bouton de génération */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Prêt à générer ton examen?</h3>
                        <p className="text-sm text-gray-600">
                          {selectedProfile && selectedSubject 
                            ? `Examen de ${SUBJECTS.find(s => s.value === selectedSubject)?.label} pour le profil ${selectedProfile}`
                            : 'Sélectionne un profil et une matière pour commencer'
                          }
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      onClick={handleGenerateExam}
                      disabled={!selectedProfile || !selectedSubject || isGenerating}
                      className="gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Génération en cours...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Générer l'examen
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Info */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>💡 Conseil:</strong> Les examens générés sont basés sur les épreuves officielles du Baccalauréat haïtien. 
                  Utilise-les pour t'entraîner dans les conditions réelles d'examen.
                </p>
              </div>
            </>
          )}
        </>
      )}

      {/* Modal de génération */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Génération de l'examen en cours...
              </h3>
              <p className="text-gray-600 text-sm">
                L'IA prépare un examen basé sur les épreuves officielles.
              </p>
              <p className="text-gray-500 text-xs mt-4">
                Cela peut prendre jusqu'à 30 secondes...
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
