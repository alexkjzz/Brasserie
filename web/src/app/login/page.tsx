"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function SubmitButton({ pending }: { pending: boolean }) {
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-2 rounded bg-stone-600 hover:bg-stone-500 transition-colors disabled:opacity-50"
        >
            {pending ? "Connexion en cours..." : "Login"}
        </button>
    );
}

export default function LoginForm() {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setPending(true);
    
        const formData = new FormData(formRef.current!);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
    
        try {
            const response = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erreur de connexion");
            }

            // 🔐 Vérifier si l'utilisateur a le rôle admin avant d'autoriser la connexion
            const payload = JSON.parse(atob(data.token.split(".")[1]));
            if (!payload.roles.includes("ROLE_ADMIN")) {
                throw new Error("Accès refusé : seuls les administrateurs peuvent se connecter.");
            }

            // 🔐 Stocker le token JWT, mettre à jour la sidebar et rediriger
            localStorage.setItem("jwtToken", data.token);
            window.dispatchEvent(new Event("storage")); // 🔥 Force la mise à jour de la sidebar immédiatement
            router.push("/dashboard"); // 🔄 Redirection admin
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Une erreur inconnue est survenue.");
            }
        } finally {
            setPending(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* 🔹 Ajout du header en haut */}
            <Header />

            {/* 🔹 Conteneur centré pour le formulaire */}
            <div className="flex flex-1 justify-center items-center">
                <div className="w-full max-w-md bg-stone-700 p-8 rounded-2xl space-y-4 border border-stone-500">
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
                        <div className="flex flex-col">
                            <label htmlFor="email" className="mb-1 text-sm">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Entrez votre email..."
                                className="px-4 py-2 text-sm rounded bg-stone-600 text-stone-100 border border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-500"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="password" className="mb-1 text-sm">Mot de passe</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Entrez votre mot de passe..."
                                className="px-4 py-2 text-sm rounded bg-stone-600 text-stone-100 border border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-500"
                                required
                            />
                        </div>
                        <SubmitButton pending={pending} />
                    </form>
                </div>
            </div>

            {/* 🔹 Footer fixe en bas */}
            <Footer />
        </div>
    );
}
