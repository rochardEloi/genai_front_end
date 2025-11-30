"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, AlertCircle } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    stream: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (!formData.stream) {
      setError("Veuillez sélectionner une filière");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // le navigateur acceptera les cookies
        body: JSON.stringify({
          firstname: formData.firstName,
          lastname: formData.lastName,
          email: formData.email,
          password: formData.password,
          stream: formData.stream,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Une erreur est survenue lors de l'inscription"
        );
      }

      // 👉 À ce stade, si ton API a renvoyé un Set-Cookie valide,
      // le navigateur a déjà stocké le cookie automatiquement.
      // On ne peut PAS lire le header `Set-Cookie` côté client.
      // Optionnel : logger les cookies visibles (non HttpOnly) :
      console.log("Cookies visibles dans le navigateur :", document.cookie);
      console.log("Code :", data);
      setError("Compte créé avec succès! Redirection...");

      // Redirection après un petit délai (facultatif)
      setTimeout(() => {
        router.push("/verify"); // ou "/dashboard/home" selon ton flow
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Commence maintenant
        </h1>
        <p className="text-gray-600">Crée ton compte gratuitement</p>
      </div>

      {error && (
        <Alert
          className={`mb-6 ${
            error.includes("succès")
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <AlertCircle
            className={`h-4 w-4 ${
              error.includes("succès") ? "text-green-600" : "text-red-600"
            }`}
          />
          <AlertDescription
            className={
              error.includes("succès") ? "text-green-600" : "text-red-600"
            }
          >
            {error}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="firstName"
              className="text-sm font-medium text-gray-900"
            >
              Prénom
            </Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="Jean"
              required
              className="mt-2 h-12 rounded-xl border-gray-200 focus:border-gray-900 focus:ring-gray-900"
            />
          </div>
          <div>
            <Label
              htmlFor="lastName"
              className="text-sm font-medium text-gray-900"
            >
              Nom
            </Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="Baptiste"
              required
              className="mt-2 h-12 rounded-xl border-gray-200 focus:border-gray-900 focus:ring-gray-900"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-900">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="ton.email@exemple.com"
            required
            className="mt-2 h-12 rounded-xl border-gray-200 focus:border-gray-900 focus:ring-gray-900"
          />
        </div>

        <div>
          <Label htmlFor="stream" className="text-sm font-medium text-gray-900">
            Filière
          </Label>
          <Select
            value={formData.stream}
            onValueChange={(value) => handleChange("stream", value)}
          >
            <SelectTrigger className="mt-2 h-12 rounded-xl border-gray-200 focus:border-gray-900 focus:ring-gray-900">
              <SelectValue placeholder="Sélectionne ta filière" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="S">SVT (Scientifique)</SelectItem>
              <SelectItem value="D">SES (Droit et Économie)</SelectItem>
              <SelectItem value="L">LLA (Littéraire)</SelectItem>
              <SelectItem value="M">
                SMP (Mathématiques et physiques)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-900"
          >
            Mot de passe
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="••••••••"
            required
            className="mt-2 h-12 rounded-xl border-gray-200 focus:border-gray-900 focus:ring-gray-900"
          />
        </div>

        <div>
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-gray-900"
          >
            Confirmer le mot de passe
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            placeholder="••••••••"
            required
            className="mt-2 h-12 rounded-xl border-gray-200 focus:border-gray-900 focus:ring-gray-900"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-base font-medium"
        >
          {loading ? "Création..." : "Créer mon compte"}
          {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Déjà un compte?{" "}
          <Link
            href="/login"
            className="text-gray-900 font-semibold hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
