"use client";

interface Reservation {
    id: number;
    emailUtilisateur: string; // ✅ Récupère l'email de l'utilisateur
    nomUtilisateur: string; // ✅ Ajout du nom de l'utilisateur
    prenomUtilisateur: string; // ✅ Ajout du prénom de l'utilisateur
    date: string;
    heure: string;
    produitsDifferents: number;
    status: "Pending" | "En cours" | "Expédié" | "Fini" | "Annulé";
}

interface Props {
    isOpen: boolean;
    reservation?: Reservation | null;  // ✅ Ajout de `| null` pour éviter l'erreur
    formData: Partial<Reservation>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSave: () => void;
    onClose: () => void;
}


export default function ReservationModal({ isOpen, reservation, formData, onChange, onSave, onClose }: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md">
            <div className="bg-stone-900 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl text-white mb-4">
                    {reservation ? "Modifier" : "Ajouter"} une réservation
                </h2>

                <label className="block text-white font-medium">Nom</label>
                <input type="text" name="nomUtilisateur" value={formData.nomUtilisateur} onChange={onChange} className="w-full p-2 mb-2 rounded bg-stone-800 text-white border border-stone-600" />

                <label className="block text-white font-medium">Prénom</label>
                <input type="text" name="prenomUtilisateur" value={formData.prenomUtilisateur} onChange={onChange} className="w-full p-2 mb-2 rounded bg-stone-800 text-white border border-stone-600" />

                <label className="block text-white font-medium">Email</label>
                <input type="email" name="emailUtilisateur" value={formData.emailUtilisateur} onChange={onChange} className="w-full p-2 mb-2 rounded bg-stone-800 text-white border border-stone-600" />

                <label className="block text-white font-medium">Date</label>
                <input type="date" name="date" value={formData.date} onChange={onChange} className="w-full p-2 mb-2 rounded bg-stone-800 text-white border border-stone-600" />

                <label className="block text-white font-medium">Heure</label>
                <input type="time" name="heure" value={formData.heure} onChange={onChange} className="w-full p-2 mb-2 rounded bg-stone-800 text-white border border-stone-600" />

                <label className="block text-white font-medium">Nombre de produits</label>
                <input type="number" name="produitsDifferents" value={formData.produitsDifferents} onChange={onChange} className="w-full p-2 mb-2 rounded bg-stone-800 text-white border border-stone-600" />

                <label className="block text-white font-medium">Statut</label>
                <select name="status" value={formData.status} onChange={onChange} className="w-full p-2 mb-2 rounded bg-stone-700 text-white">
                    {["Pending", "En cours", "Expédié", "Fini", "Annulé"].map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>

                <div className="flex justify-end gap-4 mt-4">
                    <button onClick={onSave} className="bg-green-500 text-white px-4 py-2 rounded-lg">Enregistrer</button>
                    <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded-lg">Annuler</button>
                </div>
            </div>
        </div>
    );
}
