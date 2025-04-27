"use client";

import { usePathname } from "next/navigation";

const Header = () => {
const pathname = usePathname();

// Définition des titres directement dans le composant
const pageTitles: Record<string, string> = {
    "/": "Accueil",
    "/dashboard": "Accueil",
    "/settings": "Paramètres",
    "/profile": "Profil",
    "/login": "Login",
    "/reservations": "Gestion des réservation",
    "/users": "Gestion des utilisateurs",
    "/products": "Gestions des produits",
};

const title = pageTitles[pathname] || "Brasserie";

return (
    <header className="fixed top-0 left-40 w-[calc(100%-40px)] h-19 border-b border-stone-500 bg-stone-800 flex items-center px-7">
    <h2 className="text-xl font-medium">{title}</h2>
    </header>
);
};

export default Header;
