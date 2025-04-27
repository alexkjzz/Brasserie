"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface AdminRedirectProps {
    children: ReactNode;// Définition explicite du type pour "children"
}

export default function AdminRedirect({ children }: AdminRedirectProps) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            router.push("/");//Redirige vers l'accueil si non connecté
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (!payload.roles.includes("ROLE_ADMIN")) {
                router.push("/");//Redirige vers l'accueil si pas admin
            }
        } catch (error) {
            console.error("Erreur lors de la vérification du JWT:", error);
            router.push("/");
        }
    }, []);

    return <>{children}</>;
}
