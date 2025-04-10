'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
const pathname = usePathname();

return (
    <nav className="fixed top-0 left-0 w-full bg-[var(--celadon)] text-[var(--foreground-light)] shadow-md z-50">
    <ul className="flex flex-row items-center space-x-8 px-6 py-4">
        <li>
        <Link
            href="/"
            className={`${
            pathname === '/'
                ? 'bg-[var(--moss-green)] text-white'
                : ''
            } font-semibold px-2 py-1 rounded-md transition-all`}
        >
            Accueil
        </Link>
        </li>
        <li>
        <Link
            href="/reservations"
            className={`${
            pathname === '/reservations'
                ? 'bg-[var(--moss-green)] text-white'
                : ''
            } font-semibold px-2 py-1 rounded-md transition-all`}
        >
            Gestion des réservations
        </Link>
        </li>
        <li>
        <Link
            href="/users"
            className={`${
            pathname === '/users'
                ? 'bg-[var(--moss-green)] text-white'
                : ''
            } font-semibold px-2 py-1 rounded-md transition-all`}
        >
            Gestion des utilisateurs
        </Link>
        </li>
        <li>
        <Link
            href="/products"
            className={`${
            pathname === '/products'
                ? 'bg-[var(--moss-green)] text-white'
                : ''
            } font-semibold px-2 py-1 rounded-md transition-all`}
        >
            Gestion des produits
        </Link>
        </li>
    </ul>
    </nav>
);
}
