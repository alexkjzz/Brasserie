"use client";

import { FaEdit, FaTrash } from "react-icons/fa";

interface Utilisateur {
    id: number;
    nom: string;
    prenom: string;
    email: string;
}

interface UtilisateurTableProps {
    users: Utilisateur[];
    isEditable?: boolean;
    onEdit?: (user?: Utilisateur) => void;
    onDelete?: (id: number) => void;
}

export default function UtilisateurTable({ users, isEditable = false, onEdit, onDelete }: UtilisateurTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full mt-4 border-collapse border border-stone-500">
                <thead className="bg-stone-700 text-white">
                    <tr>
                        <th className="p-3 border border-stone-500 w-[30%]">Nom</th>
                        <th className="p-3 border border-stone-500 w-[30%]">Prénom</th>
                        <th className="p-3 border border-stone-500 w-[40%]">Email</th>
                        {isEditable && <th className="p-3 border border-stone-500 w-[10%]">Actions</th>}
                    </tr>
                </thead>

                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id} className="bg-stone-600 text-white hover:bg-stone-500 transition text-center">
                                <td className="p-3 border border-stone-500">{user.nom}</td>
                                <td className="p-3 border border-stone-500">{user.prenom}</td>
                                <td className="p-3 border border-stone-500">{user.email}</td>
                                {isEditable && (
                                    <td className="p-3 border border-stone-500">
                                        <div className="flex justify-center items-center gap-4">
                                            <button onClick={() => onEdit?.(user)} className="text-yellow-500">
                                                <FaEdit size={20} />
                                            </button>
                                            <button onClick={() => onDelete?.(user.id)} className="text-red-500">
                                                <FaTrash size={20} />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={isEditable ? 4 : 3} className="p-3 text-stone-300 text-center">Aucun utilisateur enregistré.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
