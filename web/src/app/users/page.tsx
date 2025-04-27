"use client";

import { useState, useEffect } from "react";
import UtilisateurTable from "@/components/UtilisateurTable";
import UtilisateurModal from "@/components/UtilisateurModal";

interface Utilisateur {
    id: number;
    nom: string;
    prenom: string;
    email: string;
}

export default function Utilisateur() {
    const [users, setUsers] = useState<Utilisateur[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Utilisateur | null>(null);
    const [formData, setFormData] = useState<Omit<Utilisateur, "id">>({
        nom: "",
        prenom: "",
        email: ""
    });

    // 🔥 Fetch des utilisateurs avec authentification JWT
    useEffect(() => {
        const fetchUtilisateurs = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) throw new Error("Token JWT manquant, veuillez vous reconnecter.");

                const response = await fetch("http://127.0.0.1:8000/api/utilisateur/all", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.status === 401) throw new Error("Authentification requise.");
                if (!response.ok) throw new Error("Erreur lors de la récupération des utilisateurs.");

                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erreur inconnue.");
            } finally {
                setLoading(false);
            }
        };

        fetchUtilisateurs();
    }, []);

    // 🔄 Gestion des changements dans le formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ 
            ...formData, 
            [e.target.name]: e.target.value
        });
    };

    // 🛠 Ajouter ou modifier un utilisateur
    const handleSave = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) return alert("Token JWT requis, veuillez vous reconnecter.");

        const method = editingUser ? "PUT" : "POST";
        const url = editingUser 
            ? `http://127.0.0.1:8000/api/utilisateur/${editingUser.id}`  // ✅ Correction du endpoint `PUT`
            : "http://127.0.0.1:8000/api/utilisateur";

        try {
            const response = await fetch(url, {
                method,
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.status === 401) throw new Error("Authentification requise.");
            if (!response.ok) throw new Error("Erreur lors de la sauvegarde.");

            setModalOpen(false);
            setEditingUser(null);
            setFormData({ nom: "", prenom: "", email: "" });

            // 🔄 Re-fetch des utilisateurs après modification
            const updatedResponse = await fetch("http://127.0.0.1:8000/api/utilisateur/all", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const updatedData = await updatedResponse.json();
            setUsers(updatedData);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Erreur inconnue.");
        }
    };

    // ❌ Supprimer un utilisateur
    const handleDelete = async (id: number) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) return alert("Token JWT requis, veuillez vous reconnecter.");

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/utilisateur/delete/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.status === 401) throw new Error("Authentification requise.");
            if (!response.ok) throw new Error("Erreur lors de la suppression.");

            setUsers(users.filter(user => user.id !== id));
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Erreur inconnue.");
        }
    };

    // 🛠 Ouvrir le modal pour ajouter/modifier
    const openModal = (user?: Utilisateur) => {
        setEditingUser(user || null);
        setFormData(user || { nom: "", prenom: "", email: "" });
        setModalOpen(true);
    };

    // ❌ Fermer le modal
    const closeModal = () => {
        setModalOpen(false);
        setEditingUser(null);
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

                {/* 🔥 Modal pour ajouter/modifier un utilisateur */}
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
