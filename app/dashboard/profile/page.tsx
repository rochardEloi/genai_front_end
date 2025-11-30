"use client";

import { useProtectedRoute } from "@/hooks/use-protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  GraduationCap,
  Shield,
  ArrowLeft,
  LogOut,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface UserProfile {
  _id: string;
  lastname: string;
  firstname: string;
  email: string;
  role: string;
  status: string;
}

export default function ProfilePage() {
  const { loading: authLoading } = useProtectedRoute();
  const { signOut } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/users/me');
        
        if (!response.ok) {
          throw new Error('Impossible de charger le profil');
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error('Erreur chargement profil:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [authLoading]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      student: 'Etudiant',
      teacher: 'Professeur',
      admin: 'Administrateur'
    };
    return roles[role] || role;
  };

  const getStatusColor = (status: string) => {
    return status === 'enable' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getStatusLabel = (status: string) => {
    return status === 'enable' ? 'Actif' : 'Inactif';
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Chargement du profil..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <User className="w-8 h-8 text-blue-600" />
            Mon Profil
          </h1>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/dashboard/home')}>
              Retour a l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <User className="w-8 h-8 text-blue-600" />
              Mon Profil
            </h1>
            <p className="text-gray-600">
              Consulte et gere tes informations personnelles
            </p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>

      {profile && (
        <>
          {/* Avatar et nom */}
          <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {profile.firstname.charAt(0)}{profile.lastname.charAt(0)}
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.firstname} {profile.lastname}
                  </h2>
                  <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                      <GraduationCap className="w-4 h-4" />
                      {getRoleLabel(profile.role)}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(profile.status)}`}>
                      <CheckCircle2 className="w-4 h-4" />
                      {getStatusLabel(profile.status)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations detaillees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Prenom</label>
                  <p className="font-medium text-gray-900">{profile.firstname}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Nom</label>
                  <p className="font-medium text-gray-900">{profile.lastname}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium text-gray-900">{profile.email}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Compte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Role</label>
                  <p className="font-medium text-gray-900">{getRoleLabel(profile.role)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Statut</label>
                  <p className="font-medium text-gray-900">{getStatusLabel(profile.status)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">ID Utilisateur</label>
                  <p className="font-mono text-xs text-gray-500 break-all">{profile._id}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <Card className="border-red-100">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Deconnexion</h3>
                  <p className="text-sm text-gray-500">
                    Te deconnecter de ton compte Horizon
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Se deconnecter
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
