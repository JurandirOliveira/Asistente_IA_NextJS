'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaPaperPlane, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import api from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll sempre para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/api/text/chat', null, {
        params: { message: userMessage.content },
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Erro ao conectar com o servidor.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors ">
      {/* Header */}
      <header className="bg-gray-100 dark:bg-gray-800 py-4 px-6 shadow-md ">
        <div className="flex items-center justify-between">
          {/* Botão Voltar */}
          <Link
            href="/"
            className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <FaArrowLeft className="mr-2" /> <span className='hidden sm:block'>Voltar</span>
          </Link>

          {/* Título */}
          <div className='flex gap-5'>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Chat com IA
          </h1>
          {/* Botão Info */}
          <button
            onClick={() => setShowInfo((prev) => !prev)}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <FaInfoCircle size={20} />
          </button>
          </div>
            <span></span>
          
          
        </div>
        {/* Caixa de informações */}
        {showInfo && (
          <div className='w-full flex justify-center'>
          <div className="max-w-6xl mt-3 p-4 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100">
            <p className="mb-2">
 
              Esta página fornece um serviço de chat com frontEnd desenvovido em NextJS e 
BackEnd com Python + FastAPI.<br/> O BackEnd consome o Modelo GPT4-mini da OpenAI.
            </p>
          </div></div>
        )}
      </header>

      {/* Mensagens */}
      <section className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p className="text-2xl font-bold">Olá!</p>
            <p className="text-lg">Em que posso te ajudar hoje?</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-3xl px-4 py-3 rounded-lg shadow-sm whitespace-pre-wrap transition-colors ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white self-end ml-auto'
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 self-start mr-auto'
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="max-w-3xl px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-500 italic">
            Digitando...
          </div>
        )}

        <div ref={messagesEndRef} />
      </section>

      {/* Input */}
      <footer className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 
          bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          <FaPaperPlane />
        </button>
      </footer>
    </main>
  );
}
