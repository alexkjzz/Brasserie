"use client";

import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import AdminRedirect from "@/components/AdminRedirect";
import ReservationTable from "@/components/ReservationTable";
import ReservationModal from "@/components/ReservationModal";
import { Produit, Reservation, Utilisateur } from "@/models/types";
import { fetchAllReservations, saveReservation, deleteReservation } from "@/services/reservationApi";
import { fetchUtilisateurs } from "@/services/utilisateurApi";
import { fetchProduits } from "@/services/produitApi";

export default function Reservations() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
    const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
    const [produits, setProduits] = useState<Produit[]>([]);

    const [formData, setFormData] = useState<Partial<Reservation>>({
        emailUtilisateur: "",
        dateReservation: new Date().toISOString().slice(0, 16),
        produits: [],
        status: "Pending"
    });
    
    
    


    // 🔥 Fetch des réservations de l'utilisateur authentifié
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) throw new Error("Token JWT requis, veuillez vous reconnecter.");
    
                const data = await fetchAllReservations(token); // ✅ Utilise `fetchAllReservations`
                setReservations(data);
            } catch (err) {
                console.error(err);
            }
        };
    
        fetchReservations();
    }, []);


    const openModal = async (reservation?: Reservation) => {
        setModalOpen(true);
        setEditingReservation(reservation || null);
        setFormData(reservation || { 
            emailUtilisateur: "",  
            dateReservation: new Date().toISOString().slice(0, 16),
            produits: [], 
            status: "Pending"
        });
    
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) return alert("Token JWT requis, veuillez vous reconnecter.");
    
            const utilisateursData = await fetchUtilisateurs(token);
            const produitsData = await fetchProduits(token);
            setUtilisateurs(utilisateursData);
            setProduits(produitsData);
        } catch (err) {
            console.error("Erreur lors de la récupération des données :", err);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingReservation(null);
        setFormData({ 
            emailUtilisateur: "",  
            dateReservation: new Date().toISOString().slice(0, 16),
            produits: [], // ✅ Remplace `produitsDifferents` par un tableau vide
            status: "Pending"
        });
    };
    
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prevForm) => ({
            ...prevForm,
            [e.target.name]: e.target.type === "datetime-local" ? new Date(e.target.value).toISOString() : e.target.value // ✅ Corrige la date
        }));
    };
    
    
    const handleSave = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) return alert("Token JWT requis.");
        if (!formData.emailUtilisateur) return alert("Veuillez entrer un email.");
        if (!formData.produits || formData.produits.length === 0) return alert("Veuillez sélectionner au moins un produit.");
    
        const method = editingReservation ? "PUT" : "POST";
        await saveReservation(token, formData, method, editingReservation?.id);
    
        closeModal();
        const data = await fetchAllReservations(token);
        setReservations(data);
    };
    
    
    
    

    const handleDelete = async (id: number) => { // ✅ Accepte maintenant un `id`
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) throw new Error("Token JWT requis.");
                const reservation = reservations.find((res) => res.id === id);
            if (!reservation) throw new Error("Réservation introuvable.");
    
            await deleteReservation(token, id, reservation.emailUtilisateur); 
            const data = await fetchAllReservations(token);
            setReservations(data);
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
    };
    

    const handleProductChange = (produit: Produit, checked: boolean) => {
        setFormData((prevForm) => {
            const produitsSelectionnes = prevForm.produits || [];
    
            const newProduits = checked
                ? [...produitsSelectionnes, { id: produit.id, nom: produit.nom, quantite: 1 }]
                : produitsSelectionnes.filter((p) => p.id !== produit.id);
    
            return { ...prevForm, produits: newProduits };
        });
    };
    
    
    const handleQuantityChange = (produitId: number, quantite: number) => {
        setFormData((prevForm) => {
            const produitsSelectionnes = prevForm.produits || [];
    
            const newProduits = produitsSelectionnes.map((prod) =>
                prod.id === produitId ? { ...prod, quantite } : prod
            );
    
            return { ...prevForm, produits: newProduits };
        });
    };
    

    return (
        <AdminRedirect>
        <main className="flex justify-center items-start w-full p-12">
            <div className="gap-10 w-full max-w-6xl mt-12 flex flex-col items-start">

                <section className="text-left w-full border-b border-stone-500 pb-6 flex justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white">Réservations</h1>
                        <p className="text-stone-300 mt-3 text-lg leading-relaxed max-w-3xl">
                            Liste de vos réservations effectuées via l’application.
                        </p>
                    </div>
                </section>

                <section className="w-full bg-stone-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-white border-b border-stone-500 pb-3">Réservations en cours</h2>
                    <button onClick={() => openModal()} className="flex items-center text-green-400 hover:text-green-500 transition mt-4">
                        <PlusCircle size={20} className="mr-2" />
                        Ajouter une réservation
                    </button>
                    <ReservationTable reservations={reservations} onEdit={openModal} onDelete={handleDelete} />
                </section>

                {/* 🔥 Modal pour ajouter/modifier une réservation */}
                <ReservationModal
                    isOpen={modalOpen}
                    reservation={editingReservation}
                    formData={formData}
                    utilisateurs={utilisateurs}
                    produits={produits}
                    onChange={handleChange}
                    onProductChange={handleProductChange}
                    onQuantityChange={handleQuantityChange} // ✅ Ajout ici
                    onSave={handleSave}
                    onClose={closeModal}
                />
            </div>
        </main>
        </AdminRedirect>
    );
}
