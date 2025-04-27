"use client";

import { useState, useEffect } from "react";

interface Client {
    id: number;
    nom: string;
    email: string;
    telephone: string;
    inscritLe: string;
}

export default function ClientsEnregistres() {
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        setClients([
            { id: 1, nom: "Jean Dupont", email: "jean.dupont@example.com", telephone: "+33 6 12 34 56 78", inscritLe: "2025-01-10" },
            { id: 2, nom: "Alice Durand", email: "alice.durand@example.com", telephone: "+33 6 98 76 54 32", inscritLe: "2025-03-22" },
            { id: 3, nom: "Marc Leblanc", email: "marc.leblanc@example.com", telephone: "+33 7 65 43 21 09", inscritLe: "2025-04-05" },
        ]);
    }, []);

    return (
        <main className="flex justify-center items-start w-full p-12">
            <div className="gap-10 w-full max-w-6xl mt-12 flex flex-col items-start">

                <section className="text-left w-full border-b border-stone-500 pb-6">
                    <h1 className="text-4xl font-extrabold text-white">Clients Enregistrés</h1>
                    <p className="text-stone-300 mt-3 text-lg leading-relaxed max-w-3xl">
                        Liste des clients inscrits dans l'application.
                    </p>
                </section>

                <section className="w-full bg-stone-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-white border-b border-stone-500 pb-3">Liste des Clients</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full mt-4 border-collapse border border-stone-500 table-fixed">
                            <thead className="bg-stone-700 text-white">
                                <tr>
                                    <th className="p-3 border border-stone-500 w-[25%]">Nom</th>
                                    <th className="p-3 border border-stone-500 w-[25%]">Email</th>
                                    <th className="p-3 border border-stone-500 w-[20%]">Téléphone</th>
                                    <th className="p-3 border border-stone-500 w-[20%]">Inscrit le</th>
                                </tr>
                            </thead>

                            <tbody>
                                {clients.length > 0 ? (
                                    clients.map((client) => (
                                        <tr key={client.id} className="bg-stone-600 text-white hover:bg-stone-500 transition text-center">
                                            <td className="p-3 border border-stone-500">{client.nom}</td>
                                            <td className="p-3 border border-stone-500">{client.email}</td>
                                            <td className="p-3 border border-stone-500">{client.telephone}</td>
                                            <td className="p-3 border border-stone-500">{client.inscritLe}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="p-3 text-stone-300 text-center">Aucun client enregistré.</td>
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
