'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
const [open, setOpen] = useState(false)
const pathname = usePathname()

return (
    <aside
    onMouseEnter={() => setOpen(true)}
    onMouseLeave={() => setOpen(false)}
    className="fixed left-0 top-1/4 transform -translate-y-1/2 flex flex-col z-50"
    >
    {/* Navigation avec fond qui s'ouvre */}
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
        <li>
            <Link href="/dashboard" className={`${pathname === '/dashboard' ? 'font-semibold underline' : ''}`}>
            Dashboard
            </Link>
        </li>
        <li>
            <Link href="/reservation" className={`${pathname === '/reservation' ? 'font-semibold underline' : ''}`}>
            Réservation
            </Link>
        </li>
        </ul>
    </nav>
    </aside>
)
}
