"use client";

import { Check, X } from "lucide-react";

interface Utilisateur {
    id: number;
    nom: string;
    prenom: string;
    email: string;
}

interface UtilisateurModalProps {
    user: Utilisateur | null;
    formData: Omit<Utilisateur, "id">;
    isOpen: boolean;
    onClose: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
}

export default function UtilisateurModal({ user, formData, isOpen, onClose, onChange, onSave }: UtilisateurModalProps) {
    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md">
            <div className="bg-stone-900 p-8 rounded-lg shadow-lg w-[500px]">
                <h2 className="text-2xl font-bold text-white mb-6">
                    {user ? `Modifier l'utilisateur "${formData.nom}"` : "Ajouter un utilisateur"}
                </h2>

                <div className="space-y-4">
                    <label className="block text-white font-medium">Nom</label>
                    <input type="text" name="nom" value={formData.nom} onChange={onChange} className="w-full p-3 rounded-lg bg-stone-800 text-white border border-stone-600 focus:ring-2 focus:ring-blue-500" />

                    <label className="block text-white font-medium">Prénom</label>
                    <input type="text" name="prenom" value={formData.prenom} onChange={onChange} className="w-full p-3 rounded-lg bg-stone-800 text-white border border-stone-600 focus:ring-2 focus:ring-blue-500" />

                    <label className="block text-white font-medium">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={onChange} className="w-full p-3 rounded-lg bg-stone-800 text-white border border-stone-600 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onSave} className="p-2"><Check size={28} /></button>
                    <button onClick={onClose} className="p-2"><X size={28} /></button>
                </div>
            </div>
        </div>
    ) : null;
}
