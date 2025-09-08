/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaInfoCircle, FaLanguage } from 'react-icons/fa';
import api from '@/lib/api';

export default function TranslationPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) {
      setError('Por favor, digite um texto para traduzir');
      return;
    }

    setLoading(true);
    setError(null);
    setTranslation(null);

    try {
      const response = await api.post(
        `/api/text/translate?text=${encodeURIComponent(text)}`, 
        { headers: { accept: 'application/json' } }
    );

      if (!response.data) throw new Error('Resposta da API vazia');

      if (typeof response.data === 'string') {
        setTranslation(response.data);
      } else if (response.data.translation) {
        setTranslation(response.data.translation);
      } else {
        throw new Error('Formato de resposta inválido');
      }
    } catch (err: any) {
      console.error('Erro na tradução:', err);
      let errorMessage = 'Erro ao traduzir. Tente novamente.';

      if (err.response?.status === 500) {
        errorMessage = 'Erro no servidor: ' + (err.response.data?.message || 'Tente novamente mais tarde');
      } else if (err.message.includes('timeout')) {
        errorMessage = 'Tempo de espera esgotado. Verifique sua conexão.';
      }

      setError(errorMessage);
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
              Tradução
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
              Digite um texto em Português e receba a tradução em Inglês.
            </p>
            <p>
              O serviço de BackEnd utiliza <strong>Python + FastAPI</strong> e faz
              uso do modelo da <strong>OpenAI</strong> para tradução automática.
            </p>
          </div></div>
        )}
      </header>

      {/* Conteúdo */}
      <section className="flex-1 py-6">
        <div className="max-w-3xl mx-auto w-full px-6">
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
            Insira um texto em Português para traduzir para Inglês
          </p>

          {/* Caixa de entrada */}
          <textarea
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-4 min-h-[120px] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Digite o texto aqui..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
          />

          {/* Botão */}
          <button
            onClick={handleTranslate}
            disabled={loading || !text.trim()}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            ) : (
              <>
                <FaLanguage /> Traduzir
              </>
            )}
          </button>

          {/* Erro */}
          {error && (
            <p className="mt-4 text-center text-red-600 dark:text-red-400">{error}</p>
          )}

          {/* Resultado */}
          {translation && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Tradução:
              </h2>
              <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-xl max-h-64 overflow-y-auto whitespace-pre-wrap">
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {translation}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
