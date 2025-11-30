import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function Benefits() {
  const benefits = [
    {
      title: 'Apprends à ton rythme',
      description: 'Pas de pression. Progresse quand tu veux, où tu veux. Chaque moment compte.'
    },
    {
      title: 'Fonctionne hors ligne',
      description: 'Pas de connexion internet? Aucun problème. Télécharge et apprends même sans réseau.'
    },
    {
      title: '100% gratuit',
      description: 'Aucun frais caché. Accès complet à toutes les fonctionnalités sans payer un gourde.'
    },
    {
      title: 'Explicité automatique',
      description: 'L\'IA explique chaque réponse. Tu comprends vraiment, tu ne fais pas que mémoriser.'
    },
    {
      title: 'Ton objectif: le bac',
      description: 'Basé sur le programme officiel de Terminale. Tu révises exactement ce qui compte.'
    },
    {
      title: 'Support constant',
      description: 'Des recommandations IA pour progresser plus vite. Pas seul(e) dans ta préparation.'
    }
  ];

  return (
    <section id="benefits" className="py-32 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Pourquoi Horizon?
          </h2>
          <p className="text-lg text-gray-500">
            Pensé pour toi
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
