export interface Produit {
    id: number;
    nom: string;
    description: string;
    prix: number;
    quantite: number;
    disponible: boolean;
}

export interface Utilisateur {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    password?: string;
}

export interface Reservation {
    id: number;
    emailUtilisateur: string;
    dateReservation: string;
    produits: { id: number; nom: string; quantite: number }[];
    status: "Pending" | "En cours" | "Expédié" | "Fini" | "Annulé";
}

