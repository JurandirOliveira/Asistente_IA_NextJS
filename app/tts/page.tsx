/* eslint-disable @typescript-eslint/no-explicit-any */
// app/tts/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaInfoCircle, FaPlay, FaPause, FaDownload } from 'react-icons/fa';
import api from '@/lib/api';

export default function TTSPage() {
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // limpa url antigo e audio quando texto novo ou ao desmontar
  useEffect(() => {
    return () => {
      // stop & cleanup
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // função para reproduzir/pausar
  const togglePlay = async () => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onerror = () => {
        setError('Erro ao reproduzir o áudio.');
        setIsPlaying(false);
      };
    }

    try {
      if (isPlaying) {
        await audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // se o áudio estiver pausado, chama play()
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (e) {
      console.error('Erro ao tocar/pausar áudio', e);
      setError('Erro ao reproduzir o áudio.');
      setIsPlaying(false);
    }
  };

  const handleConvert = async () => {
    setError(null);
    setIsPlaying(false);

    const trimmed = text.trim();
    if (!trimmed) {
      setError('Por favor, digite um texto para converter');
      return;
    }
    if (trimmed.length > 200) {
      setError('O texto deve ter no máximo 200 caracteres');
      return;
    }

    setLoading(true);

    // cleanup anterior
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch {}
      audioRef.current = null;
    }
    if (audioUrl) {
      try {
        URL.revokeObjectURL(audioUrl);
      } catch {}
      setAudioUrl(null);
    }

    try {
      // Faz a chamada ao seu backend (usando lib/api)
      // Recebe um blob (audio) do backend
      const response = await api.post('/api/audio/tts', null, {
        params: { text: trimmed },
        responseType: 'blob',
      });

      const blob = response.data as Blob;

      // opcional: checar tipo
      if (!blob || !(blob instanceof Blob)) {
        throw new Error('Resposta inválida do servidor (blob esperado).');
      }

      // cria URL e salva no estado
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      // não autoplay; usuário pressiona play
    } catch (err: any) {
      console.error('Erro ao converter texto em voz', err);
      // tentar recuperar mensagem amigável
      let message = 'Erro ao converter texto em voz.';
      if (err?.response?.status === 422) {
        message = 'Texto inválido para conversão.';
      } else if (err?.response?.status === 500) {
        message = 'Serviço de voz indisponível.';
      } else if (err?.message && typeof err.message === 'string') {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
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
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center">Texto para Voz</h1>
            <button
              onClick={() => setShowInfo((s) => !s)}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              aria-label="Informações sobre TTS"
            >
              <FaInfoCircle size={18} />
            </button>
          </div>

          <div className="w-16" />
        </div>

        {showInfo && (
          <div className="mt-3 p-4 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100">
            <p className="mb-2">
              Digite o texto e converta para um arquivo de áudio. O processamento é feito
              pelo BackEnd (Python / FastAPI) que consome o serviço de síntese de voz.
            </p>
            <p>
              Limite de 200 caracteres. O arquivo de áudio é retornado pelo servidor e pode
              ser reproduzido ou baixado localmente.
            </p>
          </div>
        )}
      </header>

      {/* Conteúdo */}
      <section className="flex-1 py-6">
        <div className="max-w-3xl mx-auto w-full px-6">
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
            Digite o texto que deseja converter em voz
          </p>

          <textarea
            placeholder="Digite seu texto aqui..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={200}
            rows={6}
            className="w-full border rounded-xl p-4 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500
              bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors"
          />

          <div className="flex items-center justify-between mt-3 gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {text.length} / 200
            </span>

            <button
              onClick={handleConvert}
              disabled={loading || !text.trim()}
              className="ml-auto inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? (
                // spinner
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              ) : null}
              <span>{loading ? 'Convertendo...' : 'Converter'}</span>
            </button>
          </div>

          {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

          {/* Áudio Controls */}
          {audioUrl && (
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-3 py-2 rounded-xl hover:opacity-90 transition"
              >
                {isPlaying ? <FaPause /> : <FaPlay />} {isPlaying ? 'Pausar' : 'Ouvir'}
              </button>

              <a
                href={audioUrl}
                download="tts-audio.mp3"
                className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3 py-2 rounded-xl hover:opacity-90 transition"
              >
                <FaDownload /> Baixar
              </a>

              <span className="text-sm text-gray-600 dark:text-gray-400">Áudio pronto</span>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
