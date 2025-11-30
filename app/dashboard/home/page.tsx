'use client';

import { useProtectedRoute } from '@/hooks/use-protected-route';
import { useAuth } from '@/lib/auth-context';
import { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  TrendingUp,
  Trophy,
  Clock,
  Target,
  Zap,
  ArrowRight,
  Award,
  CheckCircle2,
  AlertCircle,
  Flame,
  BarChart3,
  Lightbulb,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleProgress as Progress } from '@/components/ui/simple-progress';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';

// Types pour les flash tests
interface FlashTest {
  _id: string;
  user_id: string;
  book_id: string;
  title: string;
  status: string;
  total_points: number;
  total_user_points: number;
  created_at: string;
  updated_at: string;
}

interface Subject {
  _id: string;
  name: string;
  type: string;
  status: string;
}

interface SubjectStats {
  name: string;
  score: number;
  testsCount: number;
  color: string;
}

interface DailyProgress {
  date: string;
  score: number;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({ title, value, icon, description, trend, trendUp }: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
            <p className="text-xs text-gray-500">{description}</p>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <span
                  className={`text-xs font-medium ${
                    trendUp ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {trend}
                </span>
                <span className="text-xs text-gray-500">vs. semaine dernière</span>
              </div>
            )}
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

function QuickAction({ title, description, icon, href, color }: QuickActionProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer h-full">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white flex-shrink-0`}
            >
              {icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface SubjectProgressProps {
  name: string;
  color: string;
  progress: number;
  lessons: string;
  time: string;
}

function SubjectProgress({ name, color, progress, lessons, time }: SubjectProgressProps) {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{name}</h4>
            <p className="text-xs text-gray-500">{lessons} • {time}</p>
          </div>
        </div>
        <span className="text-sm font-bold text-gray-900">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}

interface AchievementBadgeProps {
  title: string;
  description: string;
  date: string;
  unlocked: boolean;
}

function AchievementBadge({ title, description, date, unlocked }: AchievementBadgeProps) {
  return (
    <div
      className={`p-4 rounded-lg border ${
        unlocked
          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            unlocked ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-300'
          }`}
        >
          <Award className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold mb-1 ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
            {title}
          </h4>
          <p className={`text-xs mb-2 ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
            {description}
          </p>
          {unlocked && <p className="text-xs text-gray-500">Obtenu le {date}</p>}
        </div>
        {unlocked && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />}
      </div>
    </div>
  );
}

// Couleurs pour les matières
const SUBJECT_COLORS: Record<string, string> = {
  "Mathématiques": "#3B82F6",
  "Maths": "#3B82F6",
  "Physique": "#8B5CF6",
  "Chimie": "#10B981",
  "Français": "#F59E0B",
  "Histoire": "#EF4444",
  "Géographie": "#06B6D4",
  "Anglais": "#EC4899",
  "SVT": "#84CC16",
  "Philosophie": "#6366F1",
};

const SUBJECT_BG_COLORS: Record<string, string> = {
  "Mathématiques": "bg-blue-600",
  "Maths": "bg-blue-600",
  "Physique": "bg-purple-600",
  "Chimie": "bg-green-600",
  "Français": "bg-orange-600",
  "Histoire": "bg-red-600",
  "Géographie": "bg-cyan-600",
  "Anglais": "bg-pink-600",
  "SVT": "bg-lime-600",
  "Philosophie": "bg-indigo-600",
};

export default function DashboardHome() {
  const { loading } = useProtectedRoute();
  const { user } = useAuth();
  
  // États pour les données
  const [flashTests, setFlashTests] = useState<FlashTest[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        setError(null);

        // Fetch flash tests et subjects en parallèle
        const [testsResponse, subjectsResponse] = await Promise.all([
          fetch('/api/flash-tests'),
          fetch('/api/subjects')
        ]);

        if (!testsResponse.ok) {
          console.warn('Erreur lors du chargement des tests');
        }

        const testsData = await testsResponse.json();
        const subjectsData = await subjectsResponse.json();

        if (testsData.success && Array.isArray(testsData.tests)) {
          setFlashTests(testsData.tests);
        }

        if (subjectsData.success && Array.isArray(subjectsData.subjects)) {
          setSubjects(subjectsData.subjects);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger les données');
      } finally {
        setIsLoadingData(false);
      }
    };

    if (!loading) {
      fetchData();
    }
  }, [loading]);

  // Calcul des statistiques
  const stats = useMemo(() => {
    if (flashTests.length === 0) {
      return {
        averageScore: 0,
        totalTests: 0,
        consecutiveDays: 0,
        goalPercentage: 0,
        subjectStats: [] as SubjectStats[],
        dailyProgress: [] as DailyProgress[],
        weakSubjects: [] as string[],
        strongSubjects: [] as string[]
      };
    }

    // Moyenne générale (sur 100)
    const totalPoints = flashTests.reduce((acc, test) => acc + test.total_points, 0);
    const totalUserPoints = flashTests.reduce((acc, test) => acc + test.total_user_points, 0);
    const averageScore = totalPoints > 0 ? Math.round((totalUserPoints / totalPoints) * 100) : 0;

    // Nombre de tests complétés
    const totalTests = flashTests.length;

    // Jours consécutifs (calcul basé sur les dates des tests)
    const testDates = flashTests
      .map(test => new Date(test.created_at).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let consecutiveDays = 0;
    const today = new Date();
    for (let i = 0; i < testDates.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      if (testDates.includes(expectedDate.toDateString())) {
        consecutiveDays++;
      } else {
        break;
      }
    }

    // Objectif (basé sur le nombre de tests par semaine, objectif = 5 tests/semaine)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const testsThisWeek = flashTests.filter(
      test => new Date(test.created_at) >= oneWeekAgo
    ).length;
    const goalPercentage = Math.min(Math.round((testsThisWeek / 5) * 100), 100);

    // Stats par matière
    const subjectMap = new Map<string, { totalPoints: number; userPoints: number; count: number }>();
    
    flashTests.forEach(test => {
      const subject = subjects.find(s => s._id === test.book_id);
      const subjectName = subject?.name || 'Autre';
      
      const current = subjectMap.get(subjectName) || { totalPoints: 0, userPoints: 0, count: 0 };
      subjectMap.set(subjectName, {
        totalPoints: current.totalPoints + test.total_points,
        userPoints: current.userPoints + test.total_user_points,
        count: current.count + 1
      });
    });

    const subjectStats: SubjectStats[] = Array.from(subjectMap.entries()).map(([name, data]) => ({
      name,
      score: data.totalPoints > 0 ? Math.round((data.userPoints / data.totalPoints) * 100) : 0,
      testsCount: data.count,
      color: SUBJECT_COLORS[name] || '#6B7280'
    }));

    // Évolution quotidienne (7 derniers jours)
    const dailyProgress: DailyProgress[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      const dayTests = flashTests.filter(
        test => new Date(test.created_at).toDateString() === dateStr
      );
      
      if (dayTests.length > 0) {
        const dayTotal = dayTests.reduce((acc, t) => acc + t.total_points, 0);
        const dayUser = dayTests.reduce((acc, t) => acc + t.total_user_points, 0);
        dailyProgress.push({
          date: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
          score: dayTotal > 0 ? Math.round((dayUser / dayTotal) * 100) : 0
        });
      } else {
        dailyProgress.push({
          date: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
          score: 0
        });
      }
    }

    // Matières faibles (< 60%) et fortes (>= 70%)
    const weakSubjects = subjectStats
      .filter(s => s.score < 60 && s.score > 0)
      .map(s => s.name);
    
    const strongSubjects = subjectStats
      .filter(s => s.score >= 70)
      .map(s => s.name);

    return {
      averageScore,
      totalTests,
      consecutiveDays,
      goalPercentage,
      subjectStats,
      dailyProgress,
      weakSubjects,
      strongSubjects
    };
  }, [flashTests, subjects]);

  // Refresh des données
  const handleRefresh = async () => {
    setIsLoadingData(true);
    try {
      const [testsResponse, subjectsResponse] = await Promise.all([
        fetch('/api/flash-tests'),
        fetch('/api/subjects')
      ]);

      const testsData = await testsResponse.json();
      const subjectsData = await subjectsResponse.json();

      if (testsData.success) setFlashTests(testsData.tests || []);
      if (subjectsData.success) setSubjects(subjectsData.subjects || []);
    } catch (err) {
      console.error('Erreur refresh:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Chargement du tableau de bord..." />
      </div>
    );
  }

  const firstName = user?.first_name || user?.user_metadata?.first_name || 'Étudiant';
  const stream = user?.stream || user?.user_metadata?.stream || 'S';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-600" />
              Bonjour, {firstName}! 👋
            </h1>
            <p className="text-gray-600">
              Prêt à continuer ton apprentissage aujourd'hui?
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isLoadingData}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              title="Actualiser les données"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoadingData ? 'animate-spin' : ''}`} />
            </button>
            <Badge variant="outline" className="text-sm font-medium">
              Terminale {stream}
            </Badge>
          </div>
        </div>
      </div>

      {/* Message si pas de données */}
      {!isLoadingData && flashTests.length === 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Commence ton premier test!</h3>
                <p className="text-sm text-gray-600">
                  Fais un test flash pour voir tes statistiques et suivre ta progression.
                </p>
              </div>
              <Link
                href="/dashboard/quiz"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Faire un test
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Moyenne générale"
          value={`${stats.averageScore}/100`}
          icon={<TrendingUp className="w-6 h-6" />}
          description="Basée sur tous tes tests"
          trend={stats.averageScore >= 60 ? "Bon niveau!" : "À améliorer"}
          trendUp={stats.averageScore >= 60}
        />
        <StatCard
          title="Tests complétés"
          value={stats.totalTests.toString()}
          icon={<Trophy className="w-6 h-6" />}
          description={`${stats.subjectStats.length} matière${stats.subjectStats.length > 1 ? 's' : ''} testée${stats.subjectStats.length > 1 ? 's' : ''}`}
        />
        <StatCard
          title="Jours consécutifs"
          value={stats.consecutiveDays.toString()}
          icon={<Flame className="w-6 h-6" />}
          description="Continue ta série!"
          trend={stats.consecutiveDays >= 7 ? "🔥 En feu!" : ""}
          trendUp={stats.consecutiveDays >= 3}
        />
        <StatCard
          title="Objectif hebdo"
          value={`${stats.goalPercentage}%`}
          icon={<Target className="w-6 h-6" />}
          description="5 tests par semaine"
          trend={stats.goalPercentage >= 100 ? "Objectif atteint!" : ""}
          trendUp={stats.goalPercentage >= 80}
        />
      </div>

      {/* Graphiques et recommandations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Graphique évolution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Évolution de ta moyenne (7 derniers jours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.dailyProgress.some(d => d.score > 0) ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={stats.dailyProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      stroke="#9CA3AF"
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tick={{ fontSize: 12 }}
                      stroke="#9CA3AF"
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'Score']}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#2563EB' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Pas encore de données cette semaine</p>
                    <p className="text-sm">Fais des tests pour voir ton évolution!</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Graphique par matière */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Scores par matière
                </span>
                <Link
                  href="/dashboard/progress"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Voir détails
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.subjectStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.subjectStats} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      type="number" 
                      domain={[0, 100]}
                      tick={{ fontSize: 12 }}
                      stroke="#9CA3AF"
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100}
                      tick={{ fontSize: 12 }}
                      stroke="#9CA3AF"
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `${value}%`, 
                        'Score moyen'
                      ]}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="score" 
                      radius={[0, 4, 4, 0]}
                    >
                      {stats.subjectStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Aucune matière testée</p>
                    <p className="text-sm">Commence par un test flash!</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuickAction
                title="Faire un test flash"
                description="Évalue ton niveau rapidement"
                icon={<Zap className="w-6 h-6" />}
                href="/dashboard/quiz"
                color="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <QuickAction
                title="Chat avec l'IA"
                description="Pose tes questions"
                icon={<BookOpen className="w-6 h-6" />}
                href="/dashboard/chat"
                color="bg-gradient-to-br from-purple-500 to-purple-600"
              />
              <QuickAction
                title="Voir l'historique"
                description="Tes conversations passées"
                icon={<Clock className="w-6 h-6" />}
                href="/dashboard/chat"
                color="bg-gradient-to-br from-green-500 to-green-600"
              />
              <QuickAction
                title="Ma progression"
                description="Analyse tes statistiques"
                icon={<TrendingUp className="w-6 h-6" />}
                href="/dashboard/progress"
                color="bg-gradient-to-br from-orange-500 to-orange-600"
              />
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite: Recommandations et badges */}
        <div className="space-y-6">
          {/* Recommandations personnalisées */}
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Recommandations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.weakSubjects.length > 0 ? (
                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Matières à renforcer</p>
                      <p className="text-xs text-red-600 mt-1">
                        {stats.weakSubjects.join(', ')} - Score inférieur à 60%
                      </p>
                      <Link 
                        href="/dashboard/chat"
                        className="text-xs text-red-700 underline mt-2 inline-block"
                      >
                        Réviser avec l'IA →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : stats.totalTests > 0 ? (
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Excellent travail!</p>
                      <p className="text-xs text-green-600 mt-1">
                        Toutes tes matières sont au-dessus de 60%
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {stats.strongSubjects.length > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-2">
                    <Trophy className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Points forts</p>
                      <p className="text-xs text-blue-600 mt-1">
                        {stats.strongSubjects.join(', ')} - Continue comme ça!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Plan d'action */}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-2">Plan d'action suggéré</p>
                <ul className="space-y-2">
                  {stats.totalTests === 0 && (
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      Fais ton premier test flash
                    </li>
                  )}
                  {stats.consecutiveDays < 3 && (
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      Révise chaque jour pour créer une habitude
                    </li>
                  )}
                  {stats.weakSubjects.length > 0 && (
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      Concentre-toi sur {stats.weakSubjects[0]}
                    </li>
                  )}
                  {stats.goalPercentage < 100 && stats.totalTests > 0 && (
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Fais encore {Math.max(0, 5 - Math.round(stats.goalPercentage / 20))} tests cette semaine
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Progression par matière (liste) */}
          {stats.subjectStats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Détail par matière
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.subjectStats.map((subject) => (
                  <SubjectProgress
                    key={subject.name}
                    name={subject.name}
                    color={SUBJECT_BG_COLORS[subject.name] || 'bg-gray-600'}
                    progress={subject.score}
                    lessons={`${subject.testsCount} test${subject.testsCount > 1 ? 's' : ''}`}
                    time={subject.score >= 70 ? '✓ Bon' : subject.score >= 50 ? '→ Moyen' : '⚠ À revoir'}
                  />
                ))}
              </CardContent>
            </Card>
          )}

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Badges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <AchievementBadge
                title="Premier test"
                description="Complète ton premier test flash"
                date={stats.totalTests > 0 ? "Débloqué!" : ""}
                unlocked={stats.totalTests > 0}
              />
              <AchievementBadge
                title="Série de 3 jours"
                description="3 jours consécutifs de révision"
                date={stats.consecutiveDays >= 3 ? "Débloqué!" : ""}
                unlocked={stats.consecutiveDays >= 3}
              />
              <AchievementBadge
                title="Expert"
                description="Obtiens 80% de moyenne"
                date={stats.averageScore >= 80 ? "Débloqué!" : ""}
                unlocked={stats.averageScore >= 80}
              />
              <AchievementBadge
                title="Objectif hebdo"
                description="5 tests en une semaine"
                date={stats.goalPercentage >= 100 ? "Débloqué!" : ""}
                unlocked={stats.goalPercentage >= 100}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
