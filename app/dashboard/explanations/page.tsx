'use client';

import { useProtectedRoute } from '@/hooks/use-protected-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { BookOpen, PlayCircle, FileText, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface LessonCardProps {
  id: string;
  title: string;
  subject: string;
  description: string;
  duration: string;
  type: 'video' | 'text';
  completed: boolean;
}

function LessonCard({ id, title, subject, description, duration, type, completed }: LessonCardProps) {
  const subjectColors: Record<string, string> = {
    Mathématiques: 'bg-blue-100 text-blue-700 border-blue-200',
    Physique: 'bg-purple-100 text-purple-700 border-purple-200',
    Chimie: 'bg-green-100 text-green-700 border-green-200',
    Français: 'bg-orange-100 text-orange-700 border-orange-200',
  };

  return (
    <Link href={`/dashboard/explanations/${id}`}>
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4 mb-4">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                type === 'video' ? 'bg-red-100' : 'bg-blue-100'
              }`}
            >
              {type === 'video' ? (
                <PlayCircle className="w-6 h-6 text-red-600" />
              ) : (
                <FileText className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={`text-xs ${subjectColors[subject]}`}>
                  {subject}
                </Badge>
                {completed && <Badge className="text-xs bg-green-600">Terminé</Badge>}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {duration}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function ExplanationsPage() {
  const { loading } = useProtectedRoute();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Chargement..." />
      </div>
    );
  }

  const lessons = [
    {
      id: '1',
      title: 'Introduction aux fonctions exponentielles',
      subject: 'Mathématiques',
      description: 'Découvre les propriétés fondamentales des fonctions exponentielles et leurs applications.',
      duration: '12 min',
      type: 'video' as const,
      completed: true,
    },
    {
      id: '2',
      title: 'Les lois de la thermodynamique',
      subject: 'Physique',
      description: 'Comprends les trois lois de la thermodynamique et leurs implications.',
      duration: '15 min',
      type: 'video' as const,
      completed: false,
    },
    {
      id: '3',
      title: 'Réactions d\'oxydoréduction',
      subject: 'Chimie',
      description: 'Maîtrise les concepts de réduction et d\'oxydation dans les réactions chimiques.',
      duration: '10 min',
      type: 'text' as const,
      completed: false,
    },
    {
      id: '4',
      title: 'L\'argumentation dans l\'essai',
      subject: 'Français',
      description: 'Apprends à construire une argumentation solide et convaincante.',
      duration: '8 min',
      type: 'text' as const,
      completed: false,
    },
    {
      id: '5',
      title: 'Intégrales et calcul d\'aires',
      subject: 'Mathématiques',
      description: 'Utilise les intégrales pour calculer des aires et résoudre des problèmes.',
      duration: '18 min',
      type: 'video' as const,
      completed: false,
    },
    {
      id: '6',
      title: 'Ondes et vibrations',
      subject: 'Physique',
      description: 'Explore le monde des ondes mécaniques et électromagnétiques.',
      duration: '14 min',
      type: 'video' as const,
      completed: false,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          Cours et explications
        </h1>
        <p className="text-gray-600">
          Explore nos cours détaillés et renforce tes connaissances
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">48</p>
                <p className="text-sm text-gray-600">Cours disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">32</p>
                <p className="text-sm text-gray-600">Vidéos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">16</p>
                <p className="text-sm text-gray-600">Articles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">8h</p>
                <p className="text-sm text-gray-600">Durée totale</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Cours recommandés pour toi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} {...lesson} />
          ))}
        </div>
      </div>
    </div>
  );
}
