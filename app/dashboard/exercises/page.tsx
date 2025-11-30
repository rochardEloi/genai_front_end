'use client';

import { useProtectedRoute } from '@/hooks/use-protected-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Dumbbell, BookOpen, Clock, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ExerciseCardProps {
  id: string;
  title: string;
  subject: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  duration: string;
  completed: boolean;
  score?: number;
}

function ExerciseCard({ id, title, subject, difficulty, duration, completed, score }: ExerciseCardProps) {
  const difficultyColors = {
    Facile: 'bg-green-100 text-green-700 border-green-200',
    Moyen: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Difficile: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {subject}
              </Badge>
              <Badge variant="outline" className={`text-xs ${difficultyColors[difficulty]}`}>
                {difficulty}
              </Badge>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {duration}
              </span>
              {completed && score !== undefined && (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  {score}%
                </span>
              )}
            </div>
          </div>
          {completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
          ) : (
            <Star className="w-6 h-6 text-gray-300 flex-shrink-0" />
          )}
        </div>
        <Button className="w-full" variant={completed ? 'outline' : 'default'}>
          {completed ? 'Refaire' : 'Commencer'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ExercisesPage() {
  const { loading } = useProtectedRoute();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Chargement..." />
      </div>
    );
  }

  const exercises = [
    {
      id: '1',
      title: 'Équations du second degré',
      subject: 'Mathématiques',
      difficulty: 'Moyen' as const,
      duration: '15 min',
      completed: true,
      score: 85,
    },
    {
      id: '2',
      title: 'Lois de Newton',
      subject: 'Physique',
      difficulty: 'Difficile' as const,
      duration: '20 min',
      completed: true,
      score: 78,
    },
    {
      id: '3',
      title: 'Réactions acido-basiques',
      subject: 'Chimie',
      difficulty: 'Moyen' as const,
      duration: '15 min',
      completed: false,
    },
    {
      id: '4',
      title: 'Analyse de texte',
      subject: 'Français',
      difficulty: 'Facile' as const,
      duration: '10 min',
      completed: false,
    },
    {
      id: '5',
      title: 'Dérivées et primitives',
      subject: 'Mathématiques',
      difficulty: 'Difficile' as const,
      duration: '25 min',
      completed: false,
    },
    {
      id: '6',
      title: 'Électromagnétisme',
      subject: 'Physique',
      difficulty: 'Difficile' as const,
      duration: '20 min',
      completed: false,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Dumbbell className="w-8 h-8 text-blue-600" />
          Exercices
        </h1>
        <p className="text-gray-600">
          Pratique tes connaissances avec des exercices adaptés à ton niveau
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-sm text-gray-600">Exercices disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Exercices complétés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">82%</p>
                <p className="text-sm text-gray-600">Score moyen</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Exercices recommandés</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} {...exercise} />
          ))}
        </div>
      </div>
    </div>
  );
}
