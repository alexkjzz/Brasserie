"use client";

import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import AdminRedirect from "@/components/AdminRedirect";
import ReservationTable from "@/components/ReservationTable";
import ReservationModal from "@/components/ReservationModal";

interface Reservation {
    id: number;
    emailUtilisateur: string; // ✅ On récupère l'email de l'utilisateur
    nomUtilisateur: string; // ✅ Ajout du nom de l'utilisateur
    prenomUtilisateur: string; // ✅ Ajout du prénom de l'utilisateur
    date: string;
    heure: string;
    produitsDifferents: number;
    status: "Pending" | "En cours" | "Expédié" | "Fini" | "Annulé";
}


export default function Reservations() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
    const [formData, setFormData] = useState<Partial<Reservation>>({ 
        nomUtilisateur: "",  // ✅ Nom de l'utilisateur
        prenomUtilisateur: "", // ✅ Prénom de l'utilisateur
        emailUtilisateur: "",  // ✅ Email de l'utilisateur
        date: "",
        heure: "",
        produitsDifferents: 1,
        status: "Pending"
    });


    // 🔥 Fetch des réservations de l'utilisateur authentifié
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) throw new Error("Token JWT requis, veuillez vous reconnecter.");

                const response = await fetch("http://127.0.0.1:8000/api/reservation/utilisateur", { 
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`, 
                    },
                });

                if (!response.ok) throw new Error("Erreur lors de la récupération des réservations.");
                const data = await response.json();
                setReservations(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchReservations();
    }, []);

    // 🔄 Gestion des changements dans le formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const closeModal = () => {
        setModalOpen(false);
        setEditingReservation(null);
        setFormData({ 
            nomUtilisateur: "",  
            prenomUtilisateur: "", 
            emailUtilisateur: "",  
            date: "", 
            heure: "", 
            produitsDifferents: 1, 
            status: "Pending"
        });
    };
    
    
    // 🛠 Ajouter ou modifier une réservation
    const handleSave = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) return alert("Token JWT requis, veuillez vous reconnecter.");

        const method = editingReservation ? "PUT" : "POST";
        const url = editingReservation 
            ? `http://127.0.0.1:8000/api/reservation/${editingReservation.id}` 
            : "http://127.0.0.1:8000/api/reservation";

        try {
            const response = await fetch(url, {
                method,
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Erreur lors de la sauvegarde.");
            closeModal();

            // 🔄 Re-fetch des réservations après modification
            const updatedResponse = await fetch("http://127.0.0.1:8000/api/reservation/utilisateur", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const updatedData = await updatedResponse.json();
            setReservations(updatedData);
        } catch (err) {
            console.error(err);
        }
    };

    // ❌ Supprimer une réservation
    const handleDelete = async (id: number) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) return alert("Token JWT requis, veuillez vous reconnecter.");

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/reservation/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Erreur lors de la suppression.");
            setReservations(reservations.filter(res => res.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const openModal = (reservation?: Reservation) => {
        setModalOpen(true);
        setEditingReservation(reservation || null);
        setFormData(reservation || { 
            nomUtilisateur: "",  
            prenomUtilisateur: "", 
            emailUtilisateur: "",  
            date: "", 
            heure: "", 
            produitsDifferents: 1, 
            status: "Pending"
        });
    };
    

    return (
        <AdminRedirect>
        <main className="flex justify-center items-start w-full p-12">
            <div className="gap-10 w-full max-w-6xl mt-12 flex flex-col items-start">

                <section className="text-left w-full border-b border-stone-500 pb-6 flex justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white">Mes Réservations</h1>
                        <p className="text-stone-300 mt-3 text-lg leading-relaxed max-w-3xl">
                            Liste de vos réservations effectuées via l’application.
                        </p>
                    </div>
                    <button onClick={() => openModal()} className="flex items-center text-green-400 hover:text-green-500 transition">
                        <PlusCircle size={20} className="mr-2" />
                        Ajouter une réservation
                    </button>
                </section>

                <section className="w-full bg-stone-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-white border-b border-stone-500 pb-3">Réservations en cours</h2>
                    <ReservationTable reservations={reservations} onEdit={openModal} onDelete={handleDelete} />
                </section>

                {/* 🔥 Modal pour ajouter/modifier une réservation */}
                <ReservationModal isOpen={modalOpen} reservation={editingReservation} formData={formData} onChange={handleChange} onSave={handleSave} onClose={closeModal} />
            </div>
        </main>
        </AdminRedirect>
    );
}
