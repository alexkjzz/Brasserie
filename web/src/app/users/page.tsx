"use client";

import { useState, useEffect } from "react";
import UtilisateurTable from "@/components/UtilisateurTable";
import UtilisateurModal from "@/components/UtilisateurModal";
import { fetchUtilisateurs, saveUtilisateur, deleteUtilisateur } from "@/services/utilisateurApi";
import { Utilisateur } from "@/models/types";


export default function UtilisateurPage() {
    const [users, setUsers] = useState<Utilisateur[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editingUser, setEditingUser] = useState<Utilisateur | null>(null);
    const [formData, setFormData] = useState<Omit<Utilisateur, "id">>({
        nom: "",
        prenom: "",
        email: ""
    });
    
    const [modalOpen, setModalOpen] = useState(false); // ✅ Gestion locale du modal

    const openModal = (user?: Utilisateur) => {
        setEditingUser(user ?? null); // ✅ Stocke l'utilisateur en cours d'édition
        setFormData(user ?? { nom: "", prenom: "", email: "" }); // ✅ Remplit les champs avec les données existantes
        setModalOpen(true); // ✅ Ouvre le modal
    };
    
    const closeModal = () => {
        setModalOpen(false); // ✅ Ferme le modal
        setEditingUser(null); // ✅ Réinitialise l'état d'édition
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) throw new Error("Token JWT requis.");
                const data = await fetchUtilisateurs(token);
                setUsers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erreur inconnue.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) throw new Error("Token JWT requis.");
            if (!editingUser) throw new Error("Impossible de modifier un utilisateur sans sélection."); 
    
            await saveUtilisateur(token, formData, editingUser.id); 
            closeModal();
            const data = await fetchUtilisateurs(token);
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    };
    

    const handleDelete = async (id: number) => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) throw new Error("Token JWT requis.");
            await deleteUtilisateur(token, id);
            setUsers(users.filter(user => user.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <main className="flex justify-center items-start w-full p-12">
            <div className="gap-10 w-full max-w-6xl mt-12 flex flex-col items-start">
                <section className="text-left w-full border-b border-stone-500 pb-6">
                    <h1 className="text-4xl font-extrabold text-white">Gestion des Utilisateurs</h1>
                    <p className="text-stone-300 mt-3 text-lg leading-relaxed max-w-3xl">
                        Ajoutez, modifiez ou supprimez les utilisateurs enregistrés.
                    </p>
                </section>

                <section className="w-full bg-stone-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-white border-b border-stone-500 pb-3">Liste des Utilisateurs</h2>
                    {loading ? (
                        <p className="text-stone-300 text-center mt-4">Chargement des utilisateurs...</p>
                    ) : error ? (
                        <p className="text-red-400 text-center mt-4">{error}</p>
                    ) : (
                        <UtilisateurTable users={users} isEditable={true} onEdit={openModal} onDelete={handleDelete} />
                    )}
                </section>

                {modalOpen && (
                    <UtilisateurModal 
                        user={editingUser} 
                        formData={formData} 
                        isOpen={modalOpen}
                        onChange={handleChange} 
                        onSave={handleSave} 
                        onClose={closeModal} 
                    />
                )}
            </div>
        </main>
    );
}
