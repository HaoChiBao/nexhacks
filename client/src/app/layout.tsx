import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/shell/Navbar';
import { InvestDrawer } from '@/components/invest/InvestDrawer';
import { AuthProvider } from '@/components/providers/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PrintMoney - Explore Funds',
  description: 'Invest in high-trust prediction market strategies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background-dark text-white min-h-screen relative overflow-x-hidden selection:bg-primary selection:text-white`}>
         {/* Background Effects */}
         <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-emerald-900/10 rounded-full blur-[100px]"></div>
        </div>

        <AuthProvider>
          <Navbar />
          <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-64px)]">
            {children}
          </main>
          
          {/* Global Drawers */}
          <InvestDrawer />
        </AuthProvider>
      </body>
    </html>
  );
}
