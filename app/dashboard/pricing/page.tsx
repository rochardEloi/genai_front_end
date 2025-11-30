"use client";

import { useProtectedRoute } from "@/hooks/use-protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft,
  Check,
  Sparkles,
  Zap,
  Crown,
  MessageSquare,
  BookOpen,
  Brain,
  Clock,
  Users,
  Star
} from "lucide-react";

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
  color: string;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Gratuit",
    price: "0",
    period: "HTG/mois",
    description: "Parfait pour découvrir Horizon",
    icon: <Zap className="w-6 h-6" />,
    features: [
      "5 conversations par jour",
      "Accès aux matières de base",
      "Quiz limités (3/jour)",
      "Historique 7 jours",
      "Support communautaire"
    ],
    buttonText: "Plan actuel",
    color: "gray"
  },
  {
    name: "Étudiant",
    price: "500",
    period: "HTG/mois",
    description: "Idéal pour les étudiants sérieux",
    icon: <Sparkles className="w-6 h-6" />,
    features: [
      "Conversations illimitées",
      "Toutes les matières",
      "Quiz illimités",
      "Historique complet",
      "Explications détaillées",
      "Mode examen",
      "Support prioritaire"
    ],
    highlighted: true,
    buttonText: "Choisir ce plan",
    color: "blue"
  },
  {
    name: "Premium",
    price: "1000",
    period: "HTG/mois",
    description: "Pour une préparation intensive",
    icon: <Crown className="w-6 h-6" />,
    features: [
      "Tout du plan Étudiant",
      "Tuteur IA personnalisé",
      "Analyses de progression",
      "Exercices personnalisés",
      "Sessions de révision guidées",
      "Accès anticipé aux nouvelles fonctionnalités",
      "Support 24/7"
    ],
    buttonText: "Choisir ce plan",
    color: "purple"
  }
];

const features = [
  {
    icon: <MessageSquare className="w-5 h-5 text-blue-600" />,
    title: "Assistant IA intelligent",
    description: "Pose tes questions et reçois des explications claires et adaptées à ton niveau"
  },
  {
    icon: <BookOpen className="w-5 h-5 text-green-600" />,
    title: "Toutes les matières",
    description: "Mathématiques, Physique, Chimie, Biologie, Histoire et plus encore"
  },
  {
    icon: <Brain className="w-5 h-5 text-purple-600" />,
    title: "Quiz adaptatifs",
    description: "Des tests qui s'adaptent à ton niveau pour une progression optimale"
  },
  {
    icon: <Clock className="w-5 h-5 text-orange-600" />,
    title: "Disponible 24/7",
    description: "Étudie quand tu veux, où tu veux, à ton propre rythme"
  }
];

export default function PricingPage() {
  const { loading: authLoading } = useProtectedRoute();
  const router = useRouter();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Chargement..." />
      </div>
    );
  }

  const getButtonStyle = (plan: PricingPlan) => {
    if (plan.color === "blue") {
      return "bg-blue-600 hover:bg-blue-700 text-white";
    } else if (plan.color === "purple") {
      return "bg-purple-600 hover:bg-purple-700 text-white";
    }
    return "bg-gray-200 text-gray-600 cursor-not-allowed";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="absolute left-6 top-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
          <Star className="w-4 h-4" />
          Tarification simple et transparente
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choisis le plan qui te convient
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Investis dans ta réussite scolaire avec Horizon. 
          Des outils puissants pour t'aider à exceller.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingPlans.map((plan) => (
          <Card 
            key={plan.name}
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
              plan.highlighted 
                ? 'border-2 border-blue-500 shadow-lg scale-105' 
                : 'border border-gray-200 hover:border-gray-300'
            }`}
          >
            {plan.highlighted && (
              <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-center py-1 text-sm font-medium">
                Le plus populaire
              </div>
            )}
            
            <CardHeader className={`text-center ${plan.highlighted ? 'pt-10' : 'pt-6'}`}>
              <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 ${
                plan.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                plan.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {plan.icon}
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-500 ml-1">{plan.period}</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      plan.color === 'blue' ? 'text-blue-600' :
                      plan.color === 'purple' ? 'text-purple-600' :
                      'text-green-600'
                    }`} />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full mt-6 ${getButtonStyle(plan)}`}
                disabled={plan.color === 'gray'}
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Pourquoi choisir Horizon?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ or CTA */}
      <Card className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="py-12 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl font-bold mb-2">
            Rejoins des milliers d'étudiants haïtiens
          </h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Horizon t'accompagne dans ta réussite scolaire avec une IA adaptée au programme haïtien.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-blue-50"
            onClick={() => router.push('/dashboard/chat')}
          >
            Commencer maintenant
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
