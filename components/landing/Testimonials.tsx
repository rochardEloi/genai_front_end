import { Star } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function Testimonials() {
  const testimonials = [
    {
      name: 'Marie Joseph',
      level: 'Terminale S',
      city: 'Port-au-Prince',
      quote: 'Grâce à Horizon IA, j\'ai pu continuer à étudier même quand mon école était fermée. Les exercices sont vraiment adaptés à mon niveau!',
      rating: 5
    },
    {
      name: 'Jean Baptiste',
      level: 'Terminale D',
      city: 'Cap-Haïtien',
      quote: 'Les explications sont claires et je comprends vraiment les concepts. J\'apprends à mon rythme sans stress. Merci!',
      rating: 5
    },
    {
      name: 'Claudia Pierre',
      level: 'Terminale L',
      city: 'Gonaïves',
      quote: 'Enfin une solution adaptée à nos réalités. Je me sens plus confiante pour le bac. Je recommande vivement!',
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-32 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Ils réussissent avec Horizon
          </h2>
          <p className="text-lg text-gray-500">
            Des élèves qui avancent malgré tout
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-3xl">
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gray-900 text-gray-900" />
                ))}
              </div>

              <p className="text-gray-700 mb-8 leading-relaxed">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.level}, {testimonial.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
