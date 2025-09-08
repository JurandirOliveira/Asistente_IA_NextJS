// app/moderation/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import { MdErrorOutline, MdCheckCircleOutline } from 'react-icons/md';
import api from '@/lib/api';

const CATEGORIAS_PT: Record<string, string> = {
  "harassment": "Assédio",
  "harassment/threatening": "Assédio Ameaçador",
  "hate": "Ódio",
  "hate/threatening": "Ódio Ameaçador",
  "illicit": "Ilegal",
  "illicit/violent": "Ilegal e Violento",
  "self-harm": "Autoagressão",
  "self-harm/instructions": "Autoagressão (Instruções)",
  "self-harm/intent": "Autoagressão (Intenção)",
  "sexual": "Conteúdo Sexual",
  "sexual/minors": "Sexual com Menores",
  "violence": "Violência",
  "violence/graphic": "Violência Gráfica"
};

export default function ModerationPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<Record<string, boolean> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleModerate = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.post(
        `/api/text/moderations?textmoderation=${encodeURIComponent(text)}`,
        null,
        { headers: { accept: 'application/json' } }
      );

      const categories = response.data.results[0].categories;
      setResult(categories);
    } catch (err) {
      console.error(err);
      setError('⚠️ Ocorreu um erro ao processar o texto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // NÃO use overflow interno aqui — deixe o documento rolar
    <main className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header fixo no topo (opcional) */}
      <header className="sticky top-0 z-20 bg-gray-100 dark:bg-gray-800 py-4 px-6 shadow-md">
        <div className="flex items-center justify-between">
          {/* Botão Voltar */}
          <Link
            href="/"
            className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <FaArrowLeft className="mr-2" /> <span className='hidden sm:block'>Voltar</span>
          </Link>

          {/* Título com ícone de info (gap=2) */}
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center">
              Moderação de Texto
            </h1>
            <button
              onClick={() => setShowInfo((prev) => !prev)}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              aria-label="Informações"
            >
              <FaInfoCircle size={18} />
            </button>
          </div>

          {/* Espaço para equilibrar layout */}
          <div className="w-16" />
        </div>

        {/* Caixa de informações */}
        {showInfo && (
          <div className='w-full flex justify-center'>
          <div className="max-w-6xl mt-3 p-4 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100">
            <p className="mb-2">
              Esta página analisa um texto e retorna se ele contém conteúdos
              sensíveis, como <strong>ódio</strong>, <strong>assédio</strong> ou{' '}
              <strong>violência</strong>.
            </p>
            <p>
              O serviço de BackEnd usa <strong>Python + FastAPI</strong> para se
              comunicar com a API da OpenAI e retornar os resultados de moderação.
            </p>
          </div></div>
        )}
      </header>

      <section className="flex-1 py-6">
        {/* Conteúdo  */}
        <div className="max-w-3xl mx-auto w-full px-6">
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
            Cole ou digite um texto para análise de conteúdo sensível.
          </p>

          <textarea
            placeholder="Digite o texto aqui..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border rounded-xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 
            bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors"
          />

          <button
            onClick={handleModerate}
            disabled={loading}
            className="mt-4 w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Analisando...' : 'Analisar Texto'}
          </button>

          {error && (
            <p className="mt-4 text-center text-red-600 dark:text-red-400">{error}</p>
          )}

          {/* Resultados */}
          {result && (
            <div className="mt-6 space-y-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Resultado:
              </h2>
              {Object.entries(result).map(([key, flagged]) => (
                <div
                  key={key}
                  className={`flex items-center p-3 rounded-lg ${
                    flagged
                      ? 'bg-red-100 dark:bg-red-900/40'
                      : 'bg-green-100 dark:bg-green-900/40'
                  }`}
                >
                  {flagged ? (
                    <MdErrorOutline className="text-red-600 dark:text-red-400 mr-2" size={20} />
                  ) : (
                    <MdCheckCircleOutline className="text-green-600 dark:text-green-400 mr-2" size={20} />
                  )}
                  <span className="text-gray-800 dark:text-gray-100">
                    {CATEGORIAS_PT[key] || key}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
