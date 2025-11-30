"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context"; // 👈 important

export function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuth() as any; // adapte selon ton type/context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // pour les cookies
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log("login data:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Une erreur est survenue lors de la connexion"
        );
      }

      // Si la connexion réussit
      if (data.token || data.success) {
        // Option: stocker le token (si tu veux encore l'utiliser côté client)
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }

        // ⚠️ IMPORTANT : mettre à jour le contexte auth
        if (data.user && typeof setUser === "function") {
          setUser(data.user);
        }

        // Redirection après connexion réussie
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get("redirect");
        const targetUrl =
          redirect && redirect.startsWith("/dashboard")
            ? redirect
            : "/dashboard/home";

        router.push(targetUrl);
      } else {
        throw new Error("Réponse inattendue du serveur");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bon retour</h1>
        <p className="text-gray-600">Connecte-toi pour continuer</p>
      </div>

      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-900">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ton.email@exemple.com"
            required
            className="mt-2 h-12 rounded-xl border-gray-200 focus:border-gray-900 focus:ring-gray-900"
          />
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="mt-2 h-12 rounded-xl border-gray-200 focus:border-gray-900 focus:ring-gray-900"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="text-gray-600">Se souvenir</span>
          </label>
          <Link
            href="/reset-password"
            className="text-gray-900 hover:underline"
          >
            Mot de passe oublié?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-base font-medium"
        >
          {loading ? "Connexion..." : "Se connecter"}
          {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Pas encore de compte?{" "}
          <Link
            href="/register"
            className="text-gray-900 font-semibold hover:underline"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
