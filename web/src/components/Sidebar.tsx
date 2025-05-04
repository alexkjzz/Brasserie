"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, CalendarDays, Users, Beer, Settings, User, ArrowLeft, LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

const guestItems = [
    { href: "/", label: "Accueil", icon: <Home size={20} /> },
    { href: "/login", label: "Login", icon: <LogIn size={20} /> },
    { href: "/register", label: "S'inscrire", icon: <User size={20} /> },
];

const adminItems = [
    { href: "/dashboard", label: "Accueil", icon: <Home size={20} /> },
    { href: "/reservations", label: "Réserver", icon: <CalendarDays size={20} /> },
    { href: "/users", label: "Clients", icon: <Users size={20} /> },
    { href: "/products", label: "Boissons", icon: <Beer size={20} /> },
];

const settingsItems = [
    { href: "/settings", label: "Settings", icon: <Settings size={20} /> },
    { href: "/profile", label: "Profil", icon: <User size={20} /> },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem("jwtToken");
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    setIsAdmin(payload.roles.includes("ROLE_ADMIN"));
                } catch (error) {
                    console.error("Erreur JWT :", error);
                }
            } else {
                setIsAdmin(false);
            }
        };
    
        window.addEventListener("storage", handleStorageChange); // Écouter les changements du token
        handleStorageChange(); // Vérifier l'état au montage
    
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // Fonction de déconnexion
    const handleLogout = () => {
        localStorage.removeItem("jwtToken"); // Suppression du token
        window.location.href = "/"; // Redirection vers l'accueil
    };

    // Vérifier si l'on est sur une sous-page
    const isSubPage = pathname.split("/").length > 2;

    return (
        <aside className="text-white h-screen w-40 fixed left-0 top-0 flex flex-col py-6 px-3 border-r border-stone-500 bg-stone-900">
            {isSubPage ? (
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-3 px-3 py-2 mb-4 rounded transition-all duration-200 ease-in-out 
                    text-sm font-medium bg-stone-700 text-white hover:bg-stone-600"
                >
                    <ArrowLeft size={20} /> Retour
                </button>
            ) : (
                <h1 className="text-lg font-bold mb-6 text-center">Brasserie</h1>
            )}

            <nav className="flex flex-col gap-2">
                {/* Affichage des options pour les visiteurs (non connectés) */}
                {!isAdmin && guestItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 rounded transition-all duration-200 ease-in-out text-sm font-medium hover:bg-stone-500"
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                ))}

                {/* Affichage conditionnel des options admin */}
                {isAdmin && adminItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 rounded transition-all duration-200 ease-in-out text-sm font-medium hover:bg-stone-500"
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* Séparation visuelle au-dessus du bouton "Se déconnecter" */}
            {isAdmin && (
                
                <div className="mt-auto pt-6 border-t border-stone-500">
                    {settingsItems.map((setting) => (
                        <Link
                            key={setting.href}
                            href={setting.href}
                            className="flex items-center gap-3 px-3 py-2 mt-2 rounded transition-all duration-200 ease-in-out text-sm font-medium hover:bg-stone-500"
                        >
                            {setting.icon}
                            {setting.label}
                        </Link>
                    ))}

                    {/* Bouton de déconnexion */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded mt-4 transition-all duration-200 ease-in-out text-sm font-medium bg-red-600 text-white hover:bg-red-500"
                    >
                        <LogOut size={20} />
                        Log out
                    </button>
                </div>
                
            )}
        </aside>
    );
}
