import { Sidebar } from '@/components/shared/Sidebar';
import { MobileNav } from '@/components/shared/MobileNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 w-full">
        <MobileNav />

        <main className="flex-1 overflow-y-auto bg-slate-50 md:pt-0 pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}
