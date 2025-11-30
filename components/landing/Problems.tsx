import { AlertCircle, AlertTriangle, BookX } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function Problems() {
  const problems = [
    {
      icon: AlertCircle,
      title: 'Classes annulées',
      description: 'Les fermetures d\'écoles te laissent en arrière sur le programme'
    },
    {
      icon: AlertTriangle,
      title: 'Transport dangereux',
      description: 'La situation rend le trajet vers l\'école impossible ou trop risqué'
    },
    {
      icon: BookX,
      title: 'Programme incomplet',
      description: 'Tu rates des semaines entières de cours importants pour le bac'
    }
  ];

  return (
    <section className="py-32 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            La réalité en Haïti
          </h2>
          <p className="text-lg text-gray-500">
            Ces obstacles ne doivent pas freiner ton éducation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-red-50 rounded-2xl mb-5">
                  <Icon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {problem.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {problem.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
