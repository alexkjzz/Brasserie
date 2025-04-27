"use client";

import { useState, useEffect } from "react";

interface Biere {
    id: number;
    nom: string;
    image: string;
    prix: number;
    quantite: number;
    categorie: string;
    volume: string;
}

export default function BieresEnregistrees() {
    const [bieres, setBieres] = useState<Biere[]>([]);

    useEffect(() => {
        setBieres([
            {
                id: 1,
                nom: "IPA Artisanale",
                image: "https://via.placeholder.com/100",
                prix: 5.99,
                quantite: 50,
                categorie: "IPA",
                volume: "500ml",
            },
            {
                id: 2,
                nom: "Lager Classique",
                image: "https://via.placeholder.com/100",
                prix: 4.50,
                quantite: 100,
                categorie: "Lager",
                volume: "330ml",
            },
            {
                id: 3,
                nom: "Stout Noir Intense",
                image: "https://via.placeholder.com/100",
                prix: 6.75,
                quantite: 30,
                categorie: "Stout",
                volume: "440ml",
            },
        ]);
    }, []);

    return (
        <main className="flex justify-center items-start w-full p-12">
            <div className="gap-10 w-full max-w-6xl mt-12 flex flex-col items-start">

                <section className="text-left w-full border-b border-stone-500 pb-6">
                    <h1 className="text-4xl font-extrabold text-white">Bières Enregistrées</h1>
                    <p className="text-stone-300 mt-3 text-lg leading-relaxed max-w-3xl">
                        Voici la liste des bières disponibles dans l'application.
                    </p>
                </section>

                <section className="w-full bg-stone-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-white border-b border-stone-500 pb-3">Liste des Bières</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full mt-4 border-collapse border border-stone-500 table-fixed">
                            <thead className="bg-stone-700 text-white">
                                <tr>
                                    <th className="p-3 border border-stone-500 w-[15%]">Image</th>
                                    <th className="p-3 border border-stone-500 w-[20%]">Nom</th>
                                    <th className="p-3 border border-stone-500 w-[15%]">Prix (€)</th>
                                    <th className="p-3 border border-stone-500 w-[15%]">Quantité</th>
                                    <th className="p-3 border border-stone-500 w-[15%]">Catégorie</th>
                                    <th className="p-3 border border-stone-500 w-[20%]">Volume</th>
                                </tr>
                            </thead>

                            <tbody>
                                {bieres.length > 0 ? (
                                    bieres.map((biere) => (
                                        <tr key={biere.id} className="bg-stone-600 text-white hover:bg-stone-500 transition text-center">
                                            <td className="p-3 border border-stone-500">
                                                <img src={biere.image} alt={biere.nom} className="w-16 h-16 mx-auto rounded-lg" />
                                            </td>
                                            <td className="p-3 border border-stone-500">{biere.nom}</td>
                                            <td className="p-3 border border-stone-500">{biere.prix} €</td>
                                            <td className="p-3 border border-stone-500">{biere.quantite}</td>
                                            <td className="p-3 border border-stone-500">{biere.categorie}</td>
                                            <td className="p-3 border border-stone-500">{biere.volume}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-3 text-stone-300 text-center">Aucune bière enregistrée.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>
        </main>
    );
}
