"use client";

import { usePathname } from '@/i18n/routing';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  if (isHomePage) {
    return (
      <>
        <TopBar />
        <main className="pt-16 min-h-screen relative z-0 flex flex-col bg-slate-50">
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <TopBar />
      <Sidebar />
      <main className="pt-16 pl-64 min-h-screen relative z-0 flex flex-col">
        <div className="p-8 flex-1">
          {children}
        </div>
        <Footer />
      </main>
    </>
  );
}
