'use client';

import { useProtectedRoute } from '@/hooks/use-protected-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SimpleProgress as Progress } from '@/components/ui/simple-progress';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import {
  TrendingUp,
  BookOpen,
  Trophy,
  Target,
  Calendar,
  Award,
  Clock,
  TrendingDown
} from 'lucide-react';

interface SubjectProgressCardProps {
  name: string;
  color: string;
  progress: number;
  completed: number;
  total: number;
  time: string;
  averageScore: number;
  trend: number;
}

function SubjectProgressCard({
  name,
  color,
  progress,
  completed,
  total,
  time,
  averageScore,
  trend,
}: SubjectProgressCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{name}</h3>
              <p className="text-sm text-gray-500">
                {completed}/{total} leçons
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{progress}%</p>
            <div className="flex items-center gap-1 text-xs">
              {trend > 0 ? (
                <>
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">+{trend}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-3 h-3 text-red-600" />
                  <span className="text-red-600">{trend}%</span>
                </>
              )}
            </div>
          </div>
        </div>

        <Progress value={progress} className="h-2 mb-4" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Temps passé</p>
            <p className="font-semibold text-gray-900">{time}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Score moyen</p>
            <p className="font-semibold text-gray-900">{averageScore}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProgressPage() {
  const { loading } = useProtectedRoute();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Chargement..." />
      </div>
    );
  }

  const subjects = [
    {
      name: 'Mathématiques',
      color: 'bg-blue-600',
      progress: 75,
      completed: 15,
      total: 20,
      time: '8h 30min',
      averageScore: 82,
      trend: 5,
    },
    {
      name: 'Physique',
      color: 'bg-purple-600',
      progress: 60,
      completed: 12,
      total: 20,
      time: '6h 15min',
      averageScore: 78,
      trend: 3,
    },
    {
      name: 'Chimie',
      color: 'bg-green-600',
      progress: 45,
      completed: 9,
      total: 20,
      time: '4h 20min',
      averageScore: 75,
      trend: -2,
    },
    {
      name: 'Français',
      color: 'bg-orange-600',
      progress: 55,
      completed: 11,
      total: 20,
      time: '5h 10min',
      averageScore: 85,
      trend: 8,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          Ma progression
        </h1>
        <p className="text-gray-600">Suis ton évolution et atteins tes objectifs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">68%</p>
                <p className="text-sm text-gray-600">Objectif global</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">47</p>
                <p className="text-sm text-gray-600">Leçons complétées</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">24h</p>
                <p className="text-sm text-gray-600">Temps total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Jours d'affilée</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Progression par matière
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjects.map((subject) => (
                <SubjectProgressCard key={subject.name} {...subject} />
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-blue-600" />
                Statistiques de la semaine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Leçons terminées</span>
                  <span className="text-2xl font-bold text-blue-600">8</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Exercices réussis</span>
                  <span className="text-2xl font-bold text-green-600">15</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Heures d'étude</span>
                  <span className="text-2xl font-bold text-purple-600">12h</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Score moyen</span>
                  <span className="text-2xl font-bold text-orange-600">82%</span>
                </div>
                <Progress value={82} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Badges débloqués
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((badge) => (
                  <div
                    key={badge}
                    className="flex flex-col items-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-2">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs font-medium text-gray-900 text-center">
                      Badge {badge}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
