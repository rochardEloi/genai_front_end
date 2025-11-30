'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ClipboardCheck,
  Dumbbell,
  BookOpen,
  TrendingUp,
  MessageCircle,
  LogOut,
  GraduationCap,
  FileQuestionIcon,
  User
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    label: 'Progression',
    href: '/dashboard/home',
    icon: TrendingUp,
  },
  {
    label: 'Assistant IA',
    href: '/dashboard/chat',
    icon: MessageCircle,
  },
 /*  {
    label: 'Diagnostic',
    href: '/dashboard/diagnostic',
    icon: ClipboardCheck,
  }, */
  /* {
    label: 'Exercices',
    href: '/dashboard/exercises',
    icon: Dumbbell,
  }, */
  {
    label: 'List Quiz',
    href: '/dashboard/listquiz',
    icon: FileQuestionIcon,
  },
  {
    label: 'Mon Profil',
    href: '/dashboard/profile',
    icon: User,
  },
 /*  {
    label: 'Explications',
    href: '/dashboard/explanations',
    icon: BookOpen,
  }, */
  /* {
    label: 'Progression',
    href: '/dashboard/progress',
    icon: TrendingUp,
  }, */
];

export function Sidebar() {
  const pathname = usePathname();
  const { user,  signOut  } = useAuth();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-gray-900 text-white h-screen sticky top-0">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold">Horizon</h1>
          <p className="text-xs text-gray-400">Plateforme d'apprentissage</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-gray-800 text-white shadow-sm'
                  : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 px-3 py-4">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs text-gray-400 mb-1">Connecté en tant que</p>
          <p className="text-sm font-medium truncate">
            {user?.email || 'Utilisateur'}
          </p>
          {user?.user_metadata?.first_name && (
            <p className="text-xs text-gray-400 truncate">
              {user.user_metadata.first_name} {user.user_metadata.last_name}
            </p>
          )}
        </div>

        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-200"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
