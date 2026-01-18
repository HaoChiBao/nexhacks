"use client";

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Hide navbar on landing page ("/")
  const isLandingPage = pathname === "/";
  
  return (
    <>
      {!isLandingPage && <Navbar />}
      <main className={!isLandingPage ? "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-64px)]" : ""}>
        {children}
      </main>
    </>
  );
}
