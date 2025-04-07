// src/app/page.tsx
import { redirect } from 'next/navigation'

export default function HomePage() {
  const token = null  // Remplacer null par un token réel si nécessaire

  // if (!token) {
  //   redirect('/login')  // Redirection vers la page de connexion si aucun token n'est présent
  // }

  return (
    <div className="p-6 text-center">
      <h2 className="text-3xl font-bold text-celadon">Bienvenue à la Brasserie</h2>
      <p className="mt-4 text-lg text-foreground">Découvrez nos produits et notre histoire.</p>
    </div>
  )
}
