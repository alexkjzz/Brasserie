'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background-light)] text-[var(--foreground-light)]">
      <h1 className="text-4xl font-bold mb-6">Bienvenue sur le site de réservation de Brasserie</h1>
      <p className="text-lg text-center mb-6">
        Découvrez nos produits et réservez facilement en ligne.
      </p>
      <Link href="/products">
        <button className="py-3 px-6 bg-[var(--button-bg)] text-[var(--button-text)] rounded-md hover:bg-[var(--moss-green)] hover:text-white transition">
          Voir notre vitrine de produits
        </button>
      </Link>
    </div>
  );
}
