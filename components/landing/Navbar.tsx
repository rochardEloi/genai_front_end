'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">H</span>
          </div>
          <span className="text-gray-900">Horizon</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition">
            Fonctionnalités
          </Link>
          <Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition">
            Tarifs
          </Link>
          <Link href="#testimonials" className="text-sm text-gray-600 hover:text-gray-900 transition">
            Témoignages
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden md:block">
            <Button variant="ghost" className="text-gray-700 text-sm">
              Connexion
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full h-10 px-6 text-sm">
              Commencer
            </Button>
          </Link>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 p-4 space-y-3">
          <Link href="#features" className="block text-gray-600 hover:text-gray-900">
            Fonctionnalités
          </Link>
          <Link href="#pricing" className="block text-gray-600 hover:text-gray-900">
            Tarifs
          </Link>
          <Link href="#benefits" className="block text-gray-600 hover:text-gray-900">
            Avantages
          </Link>
          <Link href="#testimonials" className="block text-gray-600 hover:text-gray-900">
            Témoignages
          </Link>
          <Link href="/login" className="block">
            <Button variant="ghost" className="w-full justify-start text-gray-700">
              Connexion
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
