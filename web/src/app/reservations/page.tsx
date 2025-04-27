"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash } from "lucide-react";

interface Reservation {
    id: number;
    client: string;
    date: string;
    heure: string;
    produitsDifferents: number;
    status: "Pending" | "En cours" | "Expédié" | "Fini" | "Annulé";
}

export default function ReservationsActives() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
    const [formData, setFormData] = useState<Partial<Reservation>>({ client: "", date: "", heure: "", produitsDifferents: 1, status: "Pending" });

    useEffect(() => {
        setReservations([
            { id: 1, client: "Jean Dupont", date: "2025-04-30", heure: "19:00", produitsDifferents: 3, status: "Pending" },
            { id: 2, client: "Alice Durand", date: "2025-04-30", heure: "20:00", produitsDifferents: 5, status: "En cours" },
            { id: 3, client: "Marc Leblanc", date: "2025-04-30", heure: "21:30", produitsDifferents: 2, status: "Expédié" },
        ]);
    }, []);

    const openModal = (reservation?: Reservation) => {
        setModalOpen(true);
        setEditingReservation(reservation || null);
        setFormData(reservation || { client: "", date: "", heure: "", produitsDifferents: 1, status: "Pending" });
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingReservation(null);
        setFormData({ client: "", date: "", heure: "", produitsDifferents: 1, status: "Pending" });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (editingReservation) {
            setReservations((prev) =>
                prev.map((res) => (res.id === editingReservation.id ? { ...res, ...formData } : res))
            );
        } else {
            setReservations([...reservations, { id: Date.now(), ...formData } as Reservation]);
        }
        closeModal();
    };

    const handleDelete = (id: number) => {
        setReservations(reservations.filter((res) => res.id !== id));
    };

    const statusOptions: Reservation["status"][] = ["Pending", "En cours", "Expédié", "Fini", "Annulé"];

    return (
        <main className="flex justify-center items-start w-full p-12">
            <div className="gap-10 w-full max-w-6xl mt-12 flex flex-col items-start">

                <section className="text-left w-full border-b border-stone-500 pb-6 flex justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white">Réservations Actives</h1>
                        <p className="text-stone-300 mt-3 text-lg leading-relaxed max-w-3xl">
                            Liste des réservations passées par l’application mobile.
                        </p>
                    </div>
                    <button onClick={() => openModal()} className="flex items-center text-green-400 hover:text-green-500 transition">
                        <PlusCircle size={20} className="mr-2" />
                        Ajouter une réservation
                    </button>
                </section>

                <section className="w-full bg-stone-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-white border-b border-stone-500 pb-3">Réservations en cours</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full mt-4 border-collapse border border-stone-500 table-fixed">
                            <thead className="bg-stone-700 text-white">
                                <tr>
                                    <th className="p-3 border border-stone-500">Client</th>
                                    <th className="p-3 border border-stone-500">Date</th>
                                    <th className="p-3 border border-stone-500">Heure</th>
                                    <th className="p-3 border border-stone-500">Produits</th>
                                    <th className="p-3 border border-stone-500">Statut</th>
                                    <th className="p-3 border border-stone-500">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {reservations.map((res) => (
                                    <tr key={res.id} className="bg-stone-600 text-white hover:bg-stone-500 transition">
                                        <td className="p-3 border border-stone-500">{res.client}</td>
                                        <td className="p-3 border border-stone-500">{res.date}</td>
                                        <td className="p-3 border border-stone-500">{res.heure}</td>
                                        <td className="p-3 border border-stone-500">{res.produitsDifferents} produits</td>
                                        <td className="p-3 border border-stone-500">{res.status}</td>
                                        <td className="p-3 border border-stone-500 text-center">
                                            <div className="flex justify-center items-center gap-6">
                                                <button onClick={() => openModal(res)} className="text-blue-400 hover:text-blue-300 transition border-none">
                                                    <Edit size={20} />
                                                </button>
                                                <button onClick={() => handleDelete(res.id)} className="text-red-400 hover:text-red-300 transition border-none">
                                                    <Trash size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {modalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md">
                        <div className="bg-stone-900 p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl text-white mb-4">{editingReservation ? "Modifier" : "Ajouter"} une réservation</h2>
                            <input type="text" name="client" value={formData.client} onChange={handleChange} placeholder="Client" className="w-full p-2 mb-2 rounded" />
                            <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 mb-2 rounded" />
                            <input type="time" name="heure" value={formData.heure} onChange={handleChange} className="w-full p-2 mb-2 rounded" />

                            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 mb-2 rounded bg-stone-700 text-white">
                                {statusOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>

                            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2">Enregistrer</button>
                            <button onClick={closeModal} className="bg-red-500 text-white px-4 py-2 rounded-lg">Annuler</button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
