"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, CalendarDays, Users, Beer, Settings, User, ArrowLeft } from "lucide-react";

const navItems = [
    { href: "/", label: "Accueil", icon: <Home size={20} /> },
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

    // Vérifie si l'on est sur une sous-page (ex: /reservation/1, /users/app)
    const isSubPage = pathname.split("/").length > 2;

    return (
        <aside className="text-white h-screen w-40 fixed left-0 top-0 flex flex-col py-6 px-3 border-r border-stone-500 bg-stone-900">
            {/* Affichage conditionnel : Retour ou Titre */}
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
                {navItems.map((item) => {
                    const isActive = item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href) && item.href !== "/";

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded transition-all duration-200 ease-in-out text-sm font-medium 
        ${isActive ? "bg-stone-600" : "hover:bg-stone-500"}`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Section Paramètres en bas */}
            <div className="mt-auto pt-6 border-t border-stone-500">
                {settingsItems.map((setting) => (
                    <Link
                        key={setting.href}
                        href={setting.href}
                        className="flex items-center gap-3 px-3 py-2 rounded transition-all duration-200 ease-in-out text-sm font-medium hover:bg-stone-500"
                    >
                        {setting.icon}
                        {setting.label}
                    </Link>
                ))}
            </div>
        </aside>
    );
}
