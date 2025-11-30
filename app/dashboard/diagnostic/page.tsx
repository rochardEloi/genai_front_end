'use client';

import { useProtectedRoute } from '@/hooks/use-protected-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import {
  ClipboardCheck,
  Brain,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function DiagnosticPage() {
  const { loading } = useProtectedRoute();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Chargement..." />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <ClipboardCheck className="w-8 h-8 text-blue-600" />
          Diagnostic
        </h1>
        <p className="text-gray-600">
          Évalue ton niveau actuel et identifie tes points forts et axes d'amélioration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">15</p>
                <p className="text-sm text-gray-600">Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">20 min</p>
                <p className="text-sm text-gray-600">Durée estimée</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">4</p>
                <p className="text-sm text-gray-600">Matières</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <CardTitle>Nouveau diagnostic complet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Ce test évaluera tes connaissances dans toutes les matières principales et te
            fournira un rapport détaillé avec des recommandations personnalisées.
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Évaluation sur les 4 matières principales</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Rapport détaillé avec tes points forts</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Recommandations personnalisées</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Plan d'apprentissage sur mesure</span>
            </div>
          </div>

          <Button className="w-full md:w-auto" size="lg">
            Commencer le diagnostic
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Diagnostics précédents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <ClipboardCheck className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Aucun diagnostic complété pour le moment</p>
            <p className="text-sm mt-1">
              Lance ton premier diagnostic pour voir tes résultats ici
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
