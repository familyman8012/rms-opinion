import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/components/providers/QueryProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'RMS 피드백',
  description: 'RMS 사용자 만족도 조사 및 개선사항 수집',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
        <QueryProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: '12px',
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
