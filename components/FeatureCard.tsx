// components/FeatureCard.tsx
'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { FaArrowRight } from 'react-icons/fa';

type FeatureCardProps = {
  title: string;
  description?: string;
  icon: ReactNode;
  href: string;
};

export default function FeatureCard({ title, description, icon, href }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="
        block rounded-2xl shadow-lg transform transition hover:scale-105
        bg-blue-600 text-white
        dark:bg-gray-800 dark:text-gray-100
      "
    >
      {/* Layout MOBILE */}
      <div className="flex items-center justify-between p-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{icon}</div>
          <span className="font-semibold text-lg">{title}</span>
        </div>
        <FaArrowRight className="opacity-90" />
      </div>

      {/* Layout DESKTOP */}
      <div className="hidden lg:flex items-center gap-6 p-6">
        {/* Área da imagem/ícone */}
        <div
          className="
            rounded-xl p-4 text-4xl flex items-center justify-center w-20 h-20
            bg-white text-blue-600
            dark:bg-gray-700 dark:text-blue-400
          "
        >
          {icon}
        </div>

        {/* Texto */}
        <div className="flex-1 text-left">
          <h3 className="text-2xl font-bold">{title}</h3>
          {description && (
            <p className="text-blue-100 dark:text-gray-300">{description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
