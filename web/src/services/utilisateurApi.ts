import type { Utilisateur } from "@/models/types";

const API_URL = "http://127.0.0.1:8000/api/utilisateur";

export const fetchUtilisateurs = async (token: string) => {
    const response = await fetch(`${API_URL}/all`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error("Erreur lors de la récupération des utilisateurs.");
    return response.json();
};

export const saveUtilisateur = async (token: string, data: Omit<Utilisateur, "id">, id: number) => {
    if (!id) throw new Error("Impossible de modifier un utilisateur sans ID."); 

    const url = `${API_URL}/${id}`; // 

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erreur lors de la modification de l'utilisateur.");
    return response.json();
};

export const deleteUtilisateur = async (token: string, id: number) => {
    const response = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Erreur lors de la suppression.");
};
