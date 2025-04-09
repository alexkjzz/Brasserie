'use client'

import './styles/globals.css'
import { usePathname } from 'next/navigation'
import Navbar from '../components/Navbar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideNavbar = pathname === '/login' || pathname === '/register'

  return (
    <html lang="fr">
      <head>
        <title>Brasserie</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans bg-celadon-200 text-celadon-900 flex min-h-screen">
        {!hideNavbar && <Navbar />}
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  )
}