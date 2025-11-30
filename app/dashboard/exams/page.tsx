"use client";

import { useProtectedRoute } from "@/hooks/use-protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText,
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Sparkles,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Printer
} from "lucide-react";
import ReactMarkdown from 'react-markdown';

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

export default function ExamGeneratorPage() {
  const { loading: authLoading } = useProtectedRoute();
  const router = useRouter();
  
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedExam, setGeneratedExam] = useState<{ exam: string; title: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleReset = () => {
    setGeneratedExam(null);
    setSelectedProfile('');
    setSelectedSubject('');
    setError(null);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Chargement..." />
      </div>
    );
  }

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
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>

      {!generatedExam ? (
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
      ) : (
        <>
          {/* Examen généré */}
          <Card className="overflow-hidden">
            {/* En-tête avec actions */}
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 print:bg-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900">{generatedExam.title}</CardTitle>
                    <p className="text-sm text-gray-500">Examen généré avec succès</p>
                  </div>
                </div>
                <div className="flex gap-2 print:hidden">
                  <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                    <Printer className="w-4 h-4" />
                    Imprimer
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Nouveau
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Contenu de l'examen */}
            <CardContent className="pt-8 pb-8 px-6 md:px-10 lg:px-16">
              <div className="exam-content max-w-3xl mx-auto">
                <ReactMarkdown
                  components={{
                    // En-têtes du ministère (centré, style officiel)
                    h1: ({ children }) => (
                      <h1 className="text-lg md:text-xl font-bold text-center mb-2 text-gray-900 uppercase tracking-wide">
                        {children}
                      </h1>
                    ),
                    // Sections principales (PREMIÈRE PARTIE, etc.)
                    h2: ({ children }) => (
                      <h2 className="text-base md:text-lg font-bold mt-8 mb-4 text-gray-900 border-b-2 border-blue-500 pb-2 inline-block">
                        {children}
                      </h2>
                    ),
                    // Sous-sections (I., II., etc.)
                    h3: ({ children }) => (
                      <h3 className="text-base font-semibold mt-6 mb-3 text-gray-800">
                        {children}
                      </h3>
                    ),
                    // Paragraphes
                    p: ({ children }) => (
                      <p className="mb-4 text-gray-700 leading-relaxed text-justify">
                        {children}
                      </p>
                    ),
                    // Texte en gras
                    strong: ({ children }) => (
                      <strong className="font-bold text-gray-900">{children}</strong>
                    ),
                    // Listes à puces
                    ul: ({ children }) => (
                      <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                        {children}
                      </ul>
                    ),
                    // Listes numérotées
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-700">
                        {children}
                      </ol>
                    ),
                    // Éléments de liste
                    li: ({ children }) => (
                      <li className="text-gray-700 leading-relaxed pl-1">
                        {children}
                      </li>
                    ),
                    // Séparateurs
                    hr: () => (
                      <hr className="my-8 border-t-2 border-gray-200" />
                    ),
                    // Code inline (pour les formules)
                    code: ({ children }) => (
                      <code className="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono text-blue-700">
                        {children}
                      </code>
                    ),
                    // Blocs de code
                    pre: ({ children }) => (
                      <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto my-4 text-sm">
                        {children}
                      </pre>
                    ),
                    // Blockquotes (pour les consignes)
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-amber-400 bg-amber-50 pl-4 py-3 my-4 italic text-gray-700">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {generatedExam.exam}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Actions en bas */}
          <div className="flex justify-center gap-4 print:hidden">
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Générer un autre examen
            </Button>
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Imprimer l'examen
            </Button>
          </div>

          {/* Conseils */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 print:hidden">
            <p className="text-sm text-blue-800">
              <strong>💡 Conseil:</strong> Imprime cet examen et résous-le dans les conditions réelles (3 heures, sans téléphone). 
              Cela t'aidera à mieux te préparer pour le jour J.
            </p>
          </div>
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
