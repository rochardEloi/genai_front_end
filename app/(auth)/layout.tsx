import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="mb-12">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Horizon</span>
          </div>
        </Link>

        <div className="w-full max-w-md">
          {children}
        </div>

        <p className="mt-8 text-sm text-gray-500 text-center">
          En continuant, tu acceptes nos{' '}
          <Link href="#" className="underline hover:text-gray-900">
            conditions d'utilisation
          </Link>
        </p>
      </div>
    </div>
  );
}
