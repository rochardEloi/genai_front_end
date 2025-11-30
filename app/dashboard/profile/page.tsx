"use client";

import { useProtectedRoute } from "@/hooks/use-protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  CheckCircle2,
  Pencil,
  Save,
  X,
  Lock,
  Eye,
  EyeOff
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
  
  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editFirstname, setEditFirstname] = useState("");
  const [editLastname, setEditLastname] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Password change states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

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

  const startEditing = () => {
    if (profile) {
      setEditFirstname(profile.firstname);
      setEditLastname(profile.lastname);
      setIsEditing(true);
      setSaveMessage(null);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setSaveMessage(null);
  };

  const saveProfile = async () => {
    if (!editFirstname.trim() || !editLastname.trim()) {
      setSaveMessage({ type: 'error', text: 'Les champs ne peuvent pas etre vides' });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: editFirstname.trim(),
          lastname: editLastname.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise a jour');
      }

      const updatedUser = await response.json();
      setProfile(prev => prev ? { ...prev, firstname: editFirstname.trim(), lastname: editLastname.trim() } : null);
      setIsEditing(false);
      setSaveMessage({ type: 'success', text: 'Profil mis a jour avec succes!' });
      
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setSaveMessage({ type: 'error', text: 'Erreur lors de la mise a jour du profil' });
    } finally {
      setIsSaving(false);
    }
  };

  const savePassword = async () => {
    setPasswordError(null);

    if (newPassword.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise a jour');
      }

      setIsChangingPassword(false);
      setNewPassword("");
      setConfirmPassword("");
      setSaveMessage({ type: 'success', text: 'Mot de passe mis a jour avec succes!' });
      
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setPasswordError('Erreur lors de la mise a jour du mot de passe');
    } finally {
      setIsSaving(false);
    }
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

          {/* Message de succes/erreur */}
          {saveMessage && (
            <div className={`p-4 rounded-lg ${saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {saveMessage.text}
            </div>
          )}

          {/* Informations detaillees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Informations personnelles
                  </CardTitle>
                  {!isEditing && (
                    <Button variant="ghost" size="sm" onClick={startEditing}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="text-sm text-gray-500">Prenom</label>
                      <Input
                        value={editFirstname}
                        onChange={(e) => setEditFirstname(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Nom</label>
                      <Input
                        value={editLastname}
                        onChange={(e) => setEditLastname(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <p className="font-medium text-gray-900">{profile.email}</p>
                      <p className="text-xs text-gray-400">L'email ne peut pas etre modifie</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button onClick={saveProfile} disabled={isSaving} className="gap-2">
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                      </Button>
                      <Button variant="outline" onClick={cancelEditing} disabled={isSaving}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
              </CardContent>
            </Card>
          </div>

          {/* Changer le mot de passe */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  Mot de passe
                </CardTitle>
                {!isChangingPassword && (
                  <Button variant="outline" size="sm" onClick={() => setIsChangingPassword(true)}>
                    Modifier
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isChangingPassword ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Nouveau mot de passe</label>
                    <div className="relative mt-1">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 6 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Confirmer le mot de passe</label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Retapez le mot de passe"
                      className="mt-1"
                    />
                  </div>
                  {passwordError && (
                    <p className="text-sm text-red-600">{passwordError}</p>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={savePassword} disabled={isSaving} className="gap-2">
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsChangingPassword(false);
                        setNewPassword("");
                        setConfirmPassword("");
                        setPasswordError(null);
                      }} 
                      disabled={isSaving}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Cliquez sur "Modifier" pour changer votre mot de passe
                </p>
              )}
            </CardContent>
          </Card>

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
