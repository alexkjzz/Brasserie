import { Produit } from "@/models/types";
import { Check, X } from "lucide-react";

interface Props {
    isOpen: boolean;
    produit?: Produit | null;
    formData: Omit<Produit, "id">;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSave: () => void;
    onClose: () => void;
}

export default function ProductModal({ isOpen, produit, formData, onChange, onSave, onClose }: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md">
            <div className="bg-stone-900 p-8 rounded-lg shadow-lg w-[700px]">
                <h2 className="text-2xl font-bold text-white mb-6">
                    {produit ? `Modifier le produit "${formData.nom}"` : "Ajouter un nouveau produit"}
                </h2>

                <div className="space-y-4">
                    <label className="block text-white font-medium">Nom du produit</label>
                    <input type="text" name="nom" value={formData.nom} onChange={onChange} className="w-full p-3 rounded-lg bg-stone-800 text-white border border-stone-600" />

                    <label className="block text-white font-medium">Description</label>
                    <textarea name="description" value={formData.description} onChange={onChange} className="w-full p-3 rounded-lg bg-stone-800 text-white border border-stone-600 h-40" />

                    <label className="block text-white font-medium">Prix (€)</label>
                    <input type="number" name="prix" value={formData.prix} onChange={onChange} className="w-full p-3 rounded-lg bg-stone-800 text-white border border-stone-600" />

                    <label className="block text-white font-medium">Quantité</label>
                    <input type="number" name="quantite" value={formData.quantite} onChange={onChange} className="w-full p-3 rounded-lg bg-stone-800 text-white border border-stone-600" />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                <button onClick={onSave} className="p-2"><Check size={28} /></button>
                <button onClick={onClose} className="p-2"><X size={28} /></button>
                </div>
            </div>
        </div>
    );
}
