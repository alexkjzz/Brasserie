import { Produit } from "@/models/types";

const API_URL = "http://127.0.0.1:8000/api/produit";

export const fetchProduits = async (token: string) => {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error("Erreur lors de la récupération des produits.");
    return response.json();
};

export const saveProduit = async (token: string, data: Omit<Produit, "id">, method: "POST" | "PUT", id?: number) => {
    const url = method === "PUT" && id ? `${API_URL}/${id}` : `${API_URL}/`; 

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erreur lors de la sauvegarde.");
    return response.json();
};

export const deleteProduit = async (token: string, id: number) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Erreur lors de la suppression.");
};
