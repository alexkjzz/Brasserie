"use client";

import AdminRedirect from "@/components/AdminRedirect";
import ProductTable from "@/components/ProductTable";
import { useState, useEffect } from "react";

interface Produit {
    id: number;
    nom: string;
    description: string;
    prix: number;
    quantite: number;
    disponible: boolean;
}

export default function Home() {
    const [produits, setProduits] = useState<Produit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true; // 🔥 Empêche l'exécution multiple
        
        const fetchProduits = async () => {
            try {
                const token = localStorage.getItem("jwtToken"); // 🔐 Récupère le token JWT
        
                const response = await fetch("http://127.0.0.1:8000/api/produit", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`, // 🔥 Ajoute le token JWT dans les headers
                    },
                });
        
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des produits.");
                }
        
                const data = await response.json();
                setProduits(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erreur inconnue.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchProduits();
    
        return () => { isMounted = false; }; 
    }, []);
    

    return (
            <main className="flex justify-center items-start w-full p-12">
                <div className="gap-10 w-full max-w-6xl mt-12 flex flex-col items-start">
                    
                    <section className="text-left w-full border-b border-stone-500 pb-6">
                        <h1 className="text-4xl font-extrabold text-white">Vitrine</h1>
                        <p className="text-stone-300 mt-3 text-lg leading-relaxed max-w-3xl">
                            Aperçu de nos produits disponibles.
                        </p>
                    </section>

                    <section className="w-full mb-20 bg-stone-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-white border-b border-stone-500 pb-3">Liste des Produits</h2>

                        {loading ? (
                            <p className="text-stone-300 text-center mt-4">Chargement des produits...</p>
                        ) : error ? (
                            <p className="text-red-400 text-center mt-4">{error}</p>
                        ) : (
                            <ProductTable produits={produits} />
                        )}
                    </section>

                </div>
            </main>
    );
}
