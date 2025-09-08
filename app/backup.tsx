'use client';

import FeatureCard from '@/components/FeatureCard';
import { FaComments, FaBroom, FaMicrophone, FaVolumeUp, FaPaintBrush, FaUser } from 'react-icons/fa';

const features = [
  { id: 1, title: 'Chat com IA', description: 'Converse com a inteligência artificial', icon: <FaComments />, href: '/chat' },
  { id: 2, title: 'Moderação de Texto', description: 'Analise textos e detecte conteúdo sensível', icon: <FaBroom />, href: '/moderation' },
  { id: 3, title: 'Transcrever Áudio', description: 'Transforme áudio em texto automaticamente', icon: <FaMicrophone />, href: '/transcription' },
  { id: 4, title: 'Texto para Voz (TTS)', description: 'Converta texto em fala natural', icon: <FaVolumeUp />, href: '/tts' },
  { id: 5, title: 'Geração de Imagem', description: 'Crie imagens a partir de descrições', icon: <FaPaintBrush />, href: '/image' },
  { id: 6, title: 'Sobre mim', description: 'Conheça um pouco sobre meu trabalho', icon: <FaUser />, href: '/sobre' }
];

export default function HomePage() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      
      {/* Header */}
      <header className="text-center mt-12">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
          Assistente de IA
        </h1>
        <p className="italic text-gray-600 mt-2">Desenvolvido por Jurandir Oliveira</p>
        <p className="text-lg font-semibold mt-6 text-gray-700">Escolha uma funcionalidade:</p>
      </header>

      {/* Features */}
      <main className="flex-1 container mx-auto px-6 lg:px-12 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <FeatureCard
              key={f.id}
              title={f.title}
              description={f.description}
              icon={f.icon}
              href={f.href}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 mb-6 text-center text-sm text-gray-400">
        © 2025 Jurandir Oliveira • Feito com ❤️ e Next.js
      </footer>
    </section>
  );
}