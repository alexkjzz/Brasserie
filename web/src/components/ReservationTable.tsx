"use client";

import { Edit, Trash } from "lucide-react";
import { Reservation } from "@/models/types";

interface Props {
    reservations: Reservation[];
    onEdit: (reservation?: Reservation) => void;
    onDelete: (id: number) => void;
}

export default function ReservationTable({ reservations, onEdit, onDelete }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full mt-4 border-collapse border border-stone-500">
                <thead className="bg-stone-700 text-white">
                    <tr>
                        <th className="p-3 border border-stone-500">Email</th>
                        <th className="p-3 border border-stone-500">Date et Heure</th>
                        <th className="p-3 border border-stone-500">Produits</th>
                        <th className="p-3 border border-stone-500">Statut</th>
                        <th className="p-3 border border-stone-500">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {reservations.length > 0 ? (
                        reservations.map((res) => (
                            <tr key={res.id} className="bg-stone-600 text-white hover:bg-stone-500 transition">
                                <td className="p-3 border border-stone-500 min-w-[150px] text-center">{res.emailUtilisateur}</td>
                                <td className="p-3 border border-stone-500 min-w-[180px] text-center">
                                    {new Date(res.dateReservation).toLocaleString("fr-FR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false
                                    })}
                                </td>
                                <td className="p-3 border border-stone-500 min-w-[250px]">
                                    {res.produits.map((prod) => `${prod.nom} (${prod.quantite})`).join(", ")}
                                </td>
                                <td className="p-3 border border-stone-500 text-center">{res.status}</td>
                                <td className="p-3 border border-stone-500 text-center">
                                    <div className="flex justify-center items-center gap-4"> {/* 🔥 Centrage parfait */}
                                        <button onClick={() => onEdit(res)} className="text-yellow-500 hover:text-yellow-400 transition">
                                            <Edit size={20} />
                                        </button>
                                        <button onClick={() => onDelete(res.id)} className="text-red-500 hover:text-red-400 transition">
                                            <Trash size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="p-3 text-stone-300 text-center">Aucune réservation enregistrée.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
