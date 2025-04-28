"use client";

import { Check, X } from "lucide-react";
import { Reservation, Utilisateur, Produit } from "@/models/types";

interface Props {
    isOpen: boolean;
    reservation?: Reservation | null;
    formData: Partial<Reservation>;
    utilisateurs: Utilisateur[];
    produits: Produit[];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onProductChange: (produit: Produit, checked: boolean) => void; onQuantityChange: (produitId: number, quantite: number) => void;
    onSave: () => void;
    onClose: () => void;
}

export default function ReservationModal({
    isOpen,
    reservation,
    formData,
    utilisateurs,
    produits,
    onChange,
    onProductChange,
    onQuantityChange,
    onSave,
    onClose
}: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md">
            <div className="bg-stone-900 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl text-white mb-4">
                    {reservation ? "Modifier" : "Ajouter"} une réservation
                </h2>

                {/* Sélection de l'utilisateur */}
                {!reservation && (
                    <>
                        <select
                            name="emailUtilisateur"
                            value={formData.emailUtilisateur || ""}
                            onChange={onChange}
                            className="w-full p-2 mb-2 rounded bg-stone-800 text-white"
                        >
                            <option value="">Sélectionnez un utilisateur</option>
                            {utilisateurs.map((user) => (
                                <option key={user.id} value={user.email}>
                                    {user.nom} {user.prenom}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {/* Sélection des produits */}
                <label className="block text-white font-medium">Produits</label>
                <div className="space-y-2 mb-4">
                    {produits.map((produit) => {
                        const selected = formData.produits?.find((p) => p.id === produit.id);
                        return (
                            <div key={produit.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={!!selected}
                                    onChange={(e) => onProductChange(produit, e.target.checked)}
                                />
                                <span>{produit.nom} - {produit.prix}€</span>
                                {selected && (
                                    <input
                                        type="number"
                                        min="1"
                                        value={selected.quantite}
                                        onChange={(e) => onQuantityChange(produit.id, Number(e.target.value))}
                                        className="w-16 p-1 bg-stone-800 text-white text-center"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Date et Heure */}
                <label className="block text-white font-medium">Date et Heure</label>
                <input
                    type="datetime-local"
                    name="dateReservation"
                    value={formData.dateReservation ? formData.dateReservation.slice(0, 16) : ""} // ✅ Vérifie que la valeur existe
                    onChange={onChange}
                    className="w-full p-2 mb-2 rounded bg-stone-800 text-white"
                />
                <label className="block text-white font-medium">Statut</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={onChange}
                    className="w-full p-2 mb-2 rounded bg-stone-800 text-white"
                >
                    <option value="Pending">Pending</option>
                    <option value="En cours">En cours</option>
                    <option value="Expédié">Expédié</option>
                    <option value="Fini">Fini</option>
                    <option value="Annulé">Annulé</option>
                </select>


                <div className="flex justify-end gap-4 mt-4">
                    <button onClick={onSave} className="p-2"><Check size={28} /></button>
                    <button onClick={onClose} className="p-2"><X size={28} /></button>
                </div>
            </div>
        </div>
    );
}
