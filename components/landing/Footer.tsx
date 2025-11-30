import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">H</span>
              </div>
              <span className="font-bold text-gray-900 text-lg">Horizon</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              L'éducation ne doit pas attendre la paix. Apprends en toute sécurité, où que tu sois.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">Produit</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#features" className="text-gray-600 hover:text-gray-900 transition">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-gray-600 hover:text-gray-900 transition">
                  Témoignages
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">Ressources</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">Légal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition">
                  Confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2024 Horizon. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-gray-500 hover:text-gray-900 transition">
                Twitter
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-900 transition">
                Facebook
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-900 transition">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
