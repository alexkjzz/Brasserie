'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
const [open, setOpen] = useState(false);
const pathname = usePathname();

// Simuler un rôle (à remplacer par une logique réelle)
const role = 'admin'; // Changez en 'user' pour tester le rôle utilisateur
const role2 = 'user'; // Changez en 'admin' pour tester le rôle admin

return (
    <aside
    onMouseEnter={() => setOpen(true)}
    onMouseLeave={() => setOpen(false)}
    className="fixed left-0 top-1/4 transform -translate-y-1/2 flex flex-col z-50"
    >
    <nav
        className={`transition-all duration-300 ease-in-out overflow-hidden
        ${open ? 'w-48' : 'w-4'}
        bg-[var(--celadon)] h-auto rounded-tr-xl rounded-br-xl shadow-lg`}
    >
        <ul className="flex flex-col space-y-4 pl-4 pr-2 pt-2 pb-4 text-[var(--foreground-light)]">
        <li>
            <Link href="/" className={`${pathname === '/' ? 'font-semibold underline' : ''}`}>
            Accueil
            </Link>
        </li>
        {role2 === 'user' && (
            <>
            <li>
                <Link href="/reservations" className={`${pathname === '/reservations' ? 'font-semibold underline' : ''}`}>
                Réservations
                </Link>
            </li>
            <li>
                <Link href="/profile" className={`${pathname === '/profile' ? 'font-semibold underline' : ''}`}>
                Profil
                </Link>
            </li>
            </>
        )}
        {role === 'admin' && (
            <>
            <li>
                <Link href="/admin/users" className={`${pathname === '/admin/users' ? 'font-semibold underline' : ''}`}>
                Gestion des utilisateurs
                </Link>
            </li>
            <li>
                <Link href="/admin/products" className={`${pathname === '/admin/products' ? 'font-semibold underline' : ''}`}>
                Gestion des produits
                </Link>
            </li>
            </>
        )}
        </ul>
    </nav>
    </aside>
);
}
