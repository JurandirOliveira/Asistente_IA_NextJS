// app/page.tsx
'use client';

import FeatureCard from '@/components/FeatureCard';
import Image from 'next/image';
import { FaComments, FaBroom, FaMicrophone, FaVolumeUp, FaPaintBrush, FaLanguage } from 'react-icons/fa';

const features = [
  { id: 1, title: 'Chat com IA', description: 'Converse com a inteligência artificial', icon: <FaComments />, href: '/chat', color: 'bg-blue-600' },
  { id: 2, title: 'Moderação de texto', description: 'Analise textos e detecte conteúdo sensível', icon: <FaBroom />, href: '/moderation', color: 'bg-pink-500' },
  { id: 3, title: 'Tradução de texto', description: 'Traduza textos de Português para Inglês', icon: <FaLanguage />, href: '/traducao', color: 'bg-gray-500' },
  { id: 4, title: 'Transcrever áudio', description: 'Transforme áudio em texto automaticamente', icon: <FaMicrophone />, href: '/transcription', color: 'bg-purple-600' },
  { id: 5, title: 'Texto para voz (TTS)', description: 'Converta texto em fala natural', icon: <FaVolumeUp />, href: '/tts', color: 'bg-green-500' },
  { id: 6, title: 'Geração de imagem', description: 'Crie imagens a partir de descrições', icon: <FaPaintBrush />, href: '/image', color: 'bg-orange-500' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Hero */}
      <section className="text-center py-10">
        <div className="flex-column lg:flex w-full items-center justify-center gap-5">
<div className="w-full justify-center flex sm:w-auto">
  {/* Imagem para modo claro */}
  <Image
    src="/cerebro.png"
    alt="Imagem Cérebro Digital"
    width={160}
    height={160}
    className="dark:hidden"
  />
  {/* Imagem para modo escuro */}
  <Image
    src="/cerebro2.png"
    alt="Imagem Cérebro Digital Dark"
    width={160}
    height={160}
    className="hidden dark:block"
  />
</div>
          <div>
            <h1 className="text-4xl sm:text-5xl  font-bold">Assistente de IA</h1>
            <p className=" text-sm sm:text-lg mt-2 opacity-90">Desenvolvido por Jurandir Oliveira</p>
            {/* <p className="text-lg font-semibold mt-4">Escolha uma funcionalidade</p> */}
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 max-w-8xl mx-auto w-full sm:w-auto"
      >
        {features.map((f) => (
          <FeatureCard key={f.id} title={f.title} description={f.description} icon={f.icon} href={f.href} />
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-16 mb-6 text-center text-sm text-gray-800 dark:text-gray-400">
        © 2025 Jurandir Oliveira • Feito com ❤️ e Next.js
      </footer>
    </main>
  );
}
