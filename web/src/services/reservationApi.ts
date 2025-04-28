import type { Reservation } from "@/models/types";

const API_URL = "http://127.0.0.1:8000/api/reservation";

// export const fetchReservations = async (token: string): Promise<Reservation[]> => {
//     const response = await fetch(`${API_URL}/utilisateur`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`,
//         },
//     });

//     if (!response.ok) throw new Error("Erreur lors de la récupération des réservations.");
//     return response.json();
// };

export const fetchAllReservations = async (token: string): Promise<Reservation[]> => {
    
    const response = await fetch(`${API_URL}/all`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Erreur lors de la récupération des réservations: ${errorMessage}`);
    }

    return response.json();
};

export const saveReservation = async (
    token: string,
    data: Partial<Reservation>,
    method: "POST" | "PUT",
    id?: number
): Promise<Reservation> => {
    const url = method === "POST" ? `${API_URL}/` : `${API_URL}/${id}`;

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            emailUtilisateur: data.emailUtilisateur, // ✅ Ajout ici
            dateReservation: data.dateReservation,
            produits: data.produits?.map(p => ({ id: p.id, quantite: p.quantite })),
            status: data.status || "Pending"
        }),
    });
    console.log("Données envoyées:", {
        emailUtilisateur: data.emailUtilisateur,
        dateReservation: data.dateReservation,
        produits: data.produits?.map(p => ({ id: p.id, quantite: p.quantite })),
        status: data.status || "Pending"
    });
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Erreur lors de la sauvegarde: ${errorMessage}`);
    }

    
    return response.json();
};



export const deleteReservation = async (token: string, id: number, emailUtilisateur: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ emailUtilisateur }) // ✅ Ajout ici
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Erreur lors de la suppression: ${errorMessage}`);
    }
};
