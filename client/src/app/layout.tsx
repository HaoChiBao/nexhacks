import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppLayout } from '@/components/shell/AppLayout';
import { InvestDrawer } from '@/components/invest/InvestDrawer';
import { AuthProvider } from '@/components/providers/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Prismlines',
  description: 'AI-Powered Prediction Markets',
  icons: '/f.png',
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
          <AppLayout>
            {children}
          </AppLayout>
          
          {/* Global Drawers */}
          <InvestDrawer />
        </AuthProvider>
      </body>
    </html>
  );
}
