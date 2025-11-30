'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#features', label: 'Fonctionnalités' },
    { href: '#pricing', label: 'Tarifs' },
    { href: '#benefits', label: 'Avantages' },
  ];

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
                  <span className="text-white text-sm font-bold">H</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white" />
              </div>
              <span className={`font-bold text-xl transition-colors ${scrolled ? 'text-gray-900' : 'text-gray-900'}`}>
                Horizon
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              <div className={`flex items-center gap-1 px-2 py-1.5 rounded-full ${scrolled ? 'bg-gray-100/80' : 'bg-white/80 backdrop-blur-sm'}`}>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all hover:bg-white hover:shadow-sm ${
                      scrolled ? 'text-gray-600 hover:text-gray-900' : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  className={`font-medium ${scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'}`}
                >
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full h-11 px-6 font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Commencer gratuitement
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-5">
                <span className={`absolute left-0 block w-5 h-0.5 bg-gray-700 transform transition-all duration-300 ${isOpen ? 'top-2 rotate-45' : 'top-1'}`} />
                <span className={`absolute left-0 top-2 block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`absolute left-0 block w-5 h-0.5 bg-gray-700 transform transition-all duration-300 ${isOpen ? 'top-2 -rotate-45' : 'top-3'}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 md:hidden transform transition-transform duration-300 ease-out shadow-2xl ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsOpen(false)}>
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-bold">H</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Horizon</span>
            </Link>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex-1 overflow-y-auto py-6 px-4">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between p-4 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="font-medium">{link.label}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>

            {/* Mobile Divider */}
            <div className="my-6 border-t border-gray-100" />

            {/* Mobile Feature Highlight */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Prêt pour le Bac?</p>
                  <p className="text-sm text-gray-600">Commence ton entraînement</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Footer CTA */}
          <div className="p-4 border-t border-gray-100 space-y-3 bg-gray-50">
            <Link href="/login" className="block" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full h-12 font-medium rounded-xl border-gray-200">
                Connexion
              </Button>
            </Link>
            <Link href="/register" className="block" onClick={() => setIsOpen(false)}>
              <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25">
                <Sparkles className="w-4 h-4 mr-2" />
                Commencer gratuitement
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
