'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaInfoCircle, FaImage, FaExpand, FaTimes } from 'react-icons/fa';
import api from '@/lib/api';

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Por favor, digite um prompt para gerar a imagem');
      return;
    }

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await api.post(
        '/api/vision/imggeneration',
        {},
        { params: { prompt_image: prompt.trim() }, headers: { accept: 'application/json' } }
      );

      if (!response.data) throw new Error('Resposta vazia do servidor');

      if (
        typeof response.data === 'string' &&
        (response.data.startsWith('http') || response.data.startsWith('data:image'))
      ) {
        setImageUrl(response.data);
      } else {
        throw new Error('Formato de imagem inválido');
      }
    } catch (err) {
      console.error('Erro na geração:', err);
      setError('Erro ao gerar imagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-gray-100 dark:bg-gray-800 py-4 px-6 shadow-md">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <FaArrowLeft className="mr-2" /> <span className='hidden sm:block'>Voltar</span>
          </Link>

          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Gerar Imagem
            </h1>
            <button
              onClick={() => setShowInfo((s) => !s)}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <FaInfoCircle size={18} />
            </button>
          </div>

          <div className="w-16" />
        </div>

        {showInfo && (
          <div className='w-full flex justify-center'>
            <div className="max-w-6xl mt-3 p-4 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100">
              <p className="mb-2">
                Digite uma descrição (prompt) e o modelo de IA irá gerar uma imagem.
              </p>
              <p>
                O serviço de BackEnd usa <strong>Python + FastAPI</strong> para se
                comunicar com a API de geração de imagens.
              </p>
            </div></div>

        )}
      </header>

      {/* Conteúdo */}
      <section className="flex-1 py-6">
        <div className="max-w-3xl mx-auto w-full px-6">
          {!fullscreen && (
            <>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
                Descreva a imagem que deseja gerar
              </p>

              <textarea
                placeholder="Ex: Um gato astronauta no espaço"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full border rounded-xl p-4 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500
                  bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors"
              />

              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                ) : (
                  <>
                    <FaImage /> Gerar Imagem
                  </>
                )}
              </button>

              {error && (
                <p className="mt-4 text-center text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
            </>
          )}

          {imageUrl && !fullscreen && (
            <div className="mt-6">
              <img
                src={imageUrl}
                alt="Imagem gerada"
                className="w-full rounded-xl shadow-md"
              />

              <button
                onClick={() => setFullscreen(true)}
                className="mt-3 flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-xl hover:opacity-90 transition"
              >
                <FaExpand /> Tela cheia
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modal Tela Cheia */}
      {fullscreen && imageUrl && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <img src={imageUrl} alt="Imagem em tela cheia" className="max-w-full max-h-full" />
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 text-white px-4 py-2 rounded-xl"
          >
            <FaTimes /> Fechar
          </button>
        </div>
      )}
    </main>
  );
}
