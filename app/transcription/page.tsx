/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaInfoCircle, FaUpload, FaFileAudio } from 'react-icons/fa';
import api from '@/lib/api';

export default function AudioTranscriptionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setTranscription(null);
    }
  };

  const handleTranscribe = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo de áudio');
      return;
    }

    setLoading(true);
    setError(null);
    setTranscription(null);

    try {
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('O arquivo é muito grande (máximo 10MB)');
      }

      const formData = new FormData();
      formData.append('file_upload', file);

      const response = await api.post('/api/audio/whisper', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });

      if (!response.data) throw new Error('Resposta da API vazia');

      if (typeof response.data === 'string') {
        setTranscription(response.data);
      } else if (response.data.text) {
        setTranscription(response.data.text.text);
      } else {
        throw new Error('Formato de resposta inválido da API');
      }
    } catch (err: any) {
      console.error('Erro na transcrição:', err);
      let errorMessage = 'Erro ao processar o áudio. Tente novamente.';

      if (err.message.includes('muito grande')) {
        errorMessage = err.message;
      } else if (err.response?.status === 500) {
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
              Transcrição de Áudio
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
              Selecione um arquivo de áudio e envie para transcrição.
            </p>
            <p>
              O serviço de BackEnd usa <strong>Python + FastAPI</strong> com o modelo{' '}
              <strong>Whisper</strong> para converter áudio em texto.
            </p>
          </div></div>
        )}
      </header>

      {/* Conteúdo */}
      <section className="flex-1 py-6">
        <div className="max-w-3xl mx-auto w-full px-6">
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
            Faça upload de um arquivo de áudio para transcrever
          </p>

          {/* File Picker */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition">
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <FaFileAudio className="text-gray-500 dark:text-gray-300 mb-2" size={32} />
            {file ? (
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                {file.name}
              </span>
            ) : (
              <span className="text-gray-500 dark:text-gray-300">
                Clique para selecionar um arquivo de áudio
              </span>
            )}
          </label>

          {/* Botão Transcrever */}
          <button
            onClick={handleTranscribe}
            disabled={!file || loading}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <>
                <FaUpload /> Transcrever Áudio
              </>
            )}
          </button>

          {/* Erro */}
          {error && (
            <p className="mt-4 text-center text-red-600 dark:text-red-400">{error}</p>
          )}

          {/* Resultado */}
          {transcription && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Transcrição:
              </h2>
              <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-xl max-h-64 overflow-y-auto whitespace-pre-wrap">
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {transcription}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
