"use client";

import { FaEdit, FaTrash } from "react-icons/fa";

interface Produit {
    id: number;
    nom: string;
    description: string;
    prix: number;
    quantite: number;
    disponible: boolean;
}

interface ProductTableProps {
    produits: Produit[];
    isEditable?: boolean; // 🔥 Permet de masquer ou afficher les boutons
    onEdit?: (produit?: Produit) => void;
    onDelete?: (id: number) => void;
}

export default function ProductTable({ produits, isEditable = false, onEdit, onDelete }: ProductTableProps) {
    return (
        <div className="overflow-x-auto mb-12"> {/* 🔥 Ajoute un espace sous le tableau */}
            <table className="w-full mt-4 border-collapse border border-stone-500">
                <thead className="bg-stone-700 text-white">
                    <tr>
                        <th className="p-3 border border-stone-500 w-[10%]">Nom</th>
                        <th className="p-3 border border-stone-500 w-[40%]">Description</th>
                        <th className="p-3 border border-stone-500 w-[10%]">Prix (€)</th>
                        <th className="p-3 border border-stone-500 w-[10%]">Quantité</th>
                        <th className="p-3 border border-stone-500 w-[10%]">Disponible</th>
                        {isEditable && <th className="p-3 border border-stone-500 w-[10%]">Actions</th>}
                    </tr>
                </thead>

                <tbody>
                    {produits.length > 0 ? (
                        produits.map((produit) => (
                            <tr key={produit.id} className="bg-stone-600 text-white hover:bg-stone-500 transition text-center">
                                <td className="p-3 border border-stone-500">{produit.nom}</td>
                                <td className="p-3 border border-stone-500 text-left">{produit.description}</td>
                                <td className="p-3 border border-stone-500">{produit.prix} €</td>
                                <td className="p-3 border border-stone-500">{produit.quantite}</td>
                                <td className="p-3 border border-stone-500">{produit.disponible ? "✅" : "❌"}</td>
                                {isEditable && (
                                    <td className="p-3 border border-stone-500">
                                    <div className="flex justify-center items-center gap-4"> {/* 🔥 Centrage parfait */}
                                        <button onClick={() => onEdit?.(produit)} className="text-yellow-500">
                                            <FaEdit size={20} />
                                        </button>
                                        <button onClick={() => onDelete?.(produit.id)} className="text-red-500">
                                            <FaTrash size={20} />
                                        </button>
                                    </div>
                                </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={isEditable ? 6 : 5} className="p-3 text-stone-300 text-center">Aucun produit enregistré.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        
    );
}
