'use client'

import './styles/globals.css'
import { usePathname } from 'next/navigation'
import Navbar from '../components/Navbar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <html lang="fr">
      <head>
        <title>Brasserie</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans bg-celadon-200 text-celadon-900 flex min-h-screen">
        {/* Navbar fixe à gauche */}
        <Navbar />
        
        {/* Contenu principal qui change */}
        <main className="flex-grow ml-48 py-8">{children}</main>
      </body>
    </html>
  )
}
