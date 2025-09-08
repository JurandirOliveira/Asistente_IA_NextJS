// app/layout.js
import '../styles/globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Assistente de IA',
  description: 'Assistente de IA — conversas, TTS, transcrição, moderação, geração de imagens',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <main className="w-full mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
