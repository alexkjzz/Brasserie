'use client'

import './styles/globals.css'
import { usePathname } from 'next/navigation'
import Header from '../components/Header'


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const showHeader = pathname !== '/login' // Ne pas afficher l'en-tête sur la page de connexion

  return (
    <html lang="fr">
      <head>
        <title>Brasserie</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`font-sans ${pathname === '/login' ? 'bg-celadon-100' : 'bg-celadon-200'} text-celadon-900 flex flex-col min-h-screen`}>
        {showHeader && <Header />}
        <main className="flex-grow py-8">{children}</main>
      </body>
    </html>
  )
}
