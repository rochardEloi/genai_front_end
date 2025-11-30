'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, Zap, Sparkles, Crown } from 'lucide-react';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
  color: 'gray' | 'blue' | 'purple';
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
      "Historique 7 jours"
    ],
    buttonText: "Commencer gratuitement",
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
      "Accès anticipé",
      "Support 24/7"
    ],
    buttonText: "Choisir ce plan",
    color: "purple"
  }
];

export function Pricing() {
  const getButtonStyle = (color: string, highlighted?: boolean) => {
    if (color === "blue") {
      return "bg-gray-900 hover:bg-gray-800 text-white";
    } else if (color === "purple") {
      return "bg-purple-600 hover:bg-purple-700 text-white";
    }
    return "bg-white border-2 border-gray-200 text-gray-900 hover:bg-gray-50";
  };

  const getIconBg = (color: string) => {
    if (color === "blue") return "bg-blue-100 text-blue-600";
    if (color === "purple") return "bg-purple-100 text-purple-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-full mb-4">
            TARIFICATION
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Des prix adaptés à chaque étudiant
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Investis dans ta réussite scolaire. Choisis le plan qui correspond à tes besoins.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? 'ring-2 ring-gray-900 shadow-xl scale-105'
                  : 'border border-gray-200 hover:shadow-lg'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gray-900 text-white text-xs font-medium rounded-full">
                  Le plus populaire
                </div>
              )}

              {/* Icon & Name */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${getIconBg(plan.color)}`}>
                {plan.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-500 ml-1">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
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

              {/* Button */}
              <Link href="/register">
                <Button className={`w-full rounded-full h-12 ${getButtonStyle(plan.color, plan.highlighted)}`}>
                  {plan.buttonText}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-gray-500 mt-12">
          Tous les plans incluent un accès à notre application mobile. Annulation possible à tout moment.
        </p>
      </div>
    </section>
  );
}
