"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, AlertCircle, Mail } from "lucide-react";

export function VerifyCodeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!code || code.length < 6) {
      setError("Veuillez entrer le code de vérification (6 caractères)");
      return;
    }

    setLoading(true);

    try {
      // Appel de l'API route Next.js avec les cookies automatiquement inclus
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Les cookies seront automatiquement envoyés
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Code de vérification invalide");
      }

      setSuccess("Compte vérifié avec succès! Redirection...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(
        err.message || "Une erreur est survenue lors de la vérification"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await fetch("/api/resend-code", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'envoi du code");
      }

      setSuccess("Nouveau code envoyé! Vérifiez votre email.");
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi du code");
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100 max-w-md w-full">
      <div className="text-center mb-8">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Vérification</h1>
        <p className="text-gray-600">
          Entrez le code envoyé à {email || "votre adresse email"}
        </p>
      </div>

      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <Label htmlFor="code" className="text-sm font-medium text-gray-900">
            Code de vérification
          </Label>
          <Input
            id="code"
            type="text"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="123456"
            required
            maxLength={6}
            className="mt-2 h-12 text-center text-lg font-semibold rounded-xl border-gray-200 focus:border-gray-900 focus:ring-gray-900"
          />
          <p className="text-xs text-gray-500 mt-2 text-center">
            Entrez les 6 chiffres reçus par email
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-base font-medium"
        >
          {loading ? "Vérification..." : "Vérifier le code"}
          {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={handleResendCode}
          className="text-sm text-gray-600 hover:text-gray-900 underline"
        >
          Renvoyer le code
        </button>
      </div>
    </div>
  );
}
