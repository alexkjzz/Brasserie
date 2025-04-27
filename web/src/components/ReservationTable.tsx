"use client";

import { Edit, Trash } from "lucide-react";

interface Reservation {
    id: number;
    emailUtilisateur: string; // ✅ On récupère l'email de l'utilisateur
    nomUtilisateur: string; // ✅ Ajout du nom de l'utilisateur
    prenomUtilisateur: string; // ✅ Ajout du prénom de l'utilisateur
    date: string;
    heure: string;
    produitsDifferents: number;
    status: "Pending" | "En cours" | "Expédié" | "Fini" | "Annulé";
}

interface Props {
    reservations: Reservation[];
    onEdit: (reservation?: Reservation) => void;
    onDelete: (id: number) => void;
}

export default function ReservationTable({ reservations, onEdit, onDelete }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full mt-4 border-collapse border border-stone-500 table-fixed">
                <thead className="bg-stone-700 text-white">
                    <tr>
                        <th className="p-3 border border-stone-500">Email</th>
                        <th className="p-3 border border-stone-500">Date</th>
                        <th className="p-3 border border-stone-500">Heure</th>
                        <th className="p-3 border border-stone-500">Produits</th>
                        <th className="p-3 border border-stone-500">Statut</th>
                        <th className="p-3 border border-stone-500">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {reservations.map((res) => (
                        <tr key={res.id} className="bg-stone-600 text-white hover:bg-stone-500 transition">
                            <td className="p-3 border border-stone-500">{res.emailUtilisateur}</td>
                            <td className="p-3 border border-stone-500">{res.date}</td>
                            <td className="p-3 border border-stone-500">{res.heure}</td>
                            <td className="p-3 border border-stone-500">{res.produitsDifferents} produits</td>
                            <td className="p-3 border border-stone-500">{res.status}</td>
                            <td className="p-3 border border-stone-500 text-center">
                                <button onClick={() => onEdit(res)} className="text-blue-400 hover:text-blue-300 transition border-none"><Edit size={20} /></button>
                                <button onClick={() => onDelete(res.id)} className="text-red-400 hover:text-red-300 transition border-none"><Trash size={20} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
