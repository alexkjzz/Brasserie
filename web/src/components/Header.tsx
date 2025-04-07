export default function Header() {
    return (
        <header className="bg-[var(--celadon)] text-[var(--foreground-light)] shadow-lg p-4 rounded-lg">
            <h1 className="text-3xl font-semibold text-center text-white">Brasserie</h1>
            <nav className="flex justify-center mt-4 space-x-8">
                <a href="/" className="text-lg hover:text-[var(--cambridge-blue)] transition">Accueil</a>
                <a href="/login" className="text-lg hover:text-[var(--cambridge-blue)] transition">Se connecter</a>
            </nav>
        </header>
    )
}
