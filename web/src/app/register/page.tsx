"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createUtilisateur } from "@/services/utilisateurApi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function SubmitButton({ pending }: { pending: boolean }) {
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-2 rounded bg-green-600 hover:bg-green-500 transition-colors disabled:opacity-50"
        >
            {pending ? "Inscription en cours..." : "S'inscrire"}
        </button>
    );
}

export default function RegisterForm() {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setPending(true);
    
        const formData = new FormData(formRef.current!);
        const nom = formData.get("nom") as string;
        const prenom = formData.get("prenom") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
    
        try {
            // ✅ Appel API pour créer un nouvel utilisateur (sans vérification de connexion)
            await createUtilisateur({ nom, prenom, email, password });

            router.push("/login"); // ✅ Redirection vers la connexion après inscription
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
            <Header />

            <div className="flex flex-1 justify-center items-center">
                <div className="w-full max-w-md bg-stone-700 p-8 rounded-2xl space-y-4 border border-stone-500">
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex flex-col">
                            <label htmlFor="nom" className="mb-1 text-sm">Nom</label>
                            <input
                                id="nom"
                                name="nom"
                                type="text"
                                placeholder="Entrez votre nom..."
                                className="px-4 py-2 text-sm rounded bg-stone-600 text-stone-100 border border-stone-500 focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="prenom" className="mb-1 text-sm">Prénom</label>
                            <input
                                id="prenom"
                                name="prenom"
                                type="text"
                                placeholder="Entrez votre prénom..."
                                className="px-4 py-2 text-sm rounded bg-stone-600 text-stone-100 border border-stone-500 focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="email" className="mb-1 text-sm">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Entrez votre email..."
                                className="px-4 py-2 text-sm rounded bg-stone-600 text-stone-100 border border-stone-500 focus:ring-2 focus:ring-green-500"
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
                                className="px-4 py-2 text-sm rounded bg-stone-600 text-stone-100 border border-stone-500 focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        <SubmitButton pending={pending} />
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
}
