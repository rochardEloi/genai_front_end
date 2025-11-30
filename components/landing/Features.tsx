import { Zap, Brain, BookMarked, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Diagnostic automatique',
      description: 'Découvre ton niveau réel en 10 questions et identifie tes forces et faiblesses'
    },
    {
      icon: Brain,
      title: 'Exercices adaptatifs',
      description: 'Des exercices générés spécialement pour toi, qui s\'ajustent à ta progression'
    },
    {
      icon: BookMarked,
      title: 'Explications détaillées',
      description: 'Comprendre chaque étape avec des explications interactives et des formules mathématiques claires'
    },
    {
      icon: TrendingUp,
      title: 'Dashboard de progression',
      description: 'Suivi en temps réel de tes progrès par matière avec recommandations personnalisées'
    }
  ];

  return (
    <section id="features" className="py-32 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Tout ce qu'il te faut
          </h2>
          <p className="text-lg text-gray-500">
            Une approche simple et efficace
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="group">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gray-100 group-hover:bg-gray-900 transition-colors">
                    <Icon className="h-5 w-5 text-gray-700 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
