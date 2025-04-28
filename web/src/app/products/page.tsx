"use client";

import AdminRedirect from "@/components/AdminRedirect";
import ProductTable from "@/components/ProductTable";
import { PlusCircle} from "lucide-react";
import { useState, useEffect } from "react";
import { fetchProduits, saveProduit, deleteProduit } from "@/services/produitApi";
import { Produit } from "@/models/types";
import ProductModal from "@/components/ProductModal";


export default function Products() {
    const [produits, setProduits] = useState<Produit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingProduit, setEditingProduit] = useState<Produit | null>(null);
    const [formData, setFormData] = useState<Omit<Produit, "id">>({
        nom: "",
        description: "",
        prix: 0,
        quantite: 0,
        disponible: false,
    });

    const [modalOpen, setModalOpen] = useState(false); // ✅ Gestion locale du modal

    const openModal = (produit?: Produit) => {
        setEditingProduit(produit ?? null);
        setFormData(produit ?? { nom: "", description: "", prix: 0, quantite: 0, disponible: false }); // ✅ Remplit les données si édition
        setModalOpen(true); // ✅ Ouvre le modal
    };
    
    const closeModal = () => {
        setModalOpen(false); // ✅ Ferme le modal
        setEditingProduit(null); // ✅ Réinitialise l'état d'édition
    };
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) throw new Error("Token JWT requis.");
                const data = await fetchProduits(token);
                setProduits(data);
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
    
            const method = editingProduit ? "PUT" : "POST";
            await saveProduit(token, formData, method, editingProduit?.id);
            closeModal();
            const data = await fetchProduits(token);
            setProduits(data);
        } catch (err) {
            console.error(err);
        }
    };
    
    const handleDelete = async (id: number) => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) throw new Error("Token JWT requis.");
            await deleteProduit(token, id);
            setProduits(produits.filter(produit => produit.id !== id));
        } catch (err) {
            console.error(err);
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const rawValue = e.target.value;
        const value = e.target.name === "quantite" || e.target.name === "prix"
            ? Number(rawValue) || 0  
            : rawValue;
    
        setFormData(prevData => ({
            ...prevData, 
            [e.target.name]: value
        }));
    };

    return (
        <AdminRedirect>
            <main className="flex justify-center items-start w-full p-12">
                <div className="gap-10 w-full max-w-6xl mt-12 flex flex-col items-start">
                    
                    <section className="text-left w-full border-b border-stone-500 pb-6">
                        <h1 className="text-4xl font-extrabold text-white">Gestion des Produits</h1>
                        <p className="text-stone-300 mt-3 text-lg leading-relaxed max-w-3xl">
                            Ajoutez, modifiez ou supprimez les produits disponibles dans la boutique.
                        </p>



                    </section>

                    <section className="w-full bg-stone-800 mb-20 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-white border-b border-stone-500 pb-3">Liste des Produits</h2>
                        <button onClick={() => openModal()} className="flex items-center text-green-400 hover:text-green-500 transition mt-4">
                        <PlusCircle size={20} className="mr-2" />
                        Ajouter un produit
                        </button>

                
                        {loading ? (
                            <p className="text-stone-300 text-center mt-4">Chargement des produits...</p>
                        ) : error ? (
                            <p className="text-red-400 text-center mt-4">{error}</p>
                        ) : (
                            <ProductTable produits={produits} isEditable={true} onEdit={openModal} onDelete={handleDelete} />
                        )}
                    </section>

                    {/* 🔥 Modal pour ajouter/modifier un produit */}
                    {modalOpen && (
                        <ProductModal isOpen={modalOpen} produit={editingProduit} formData={formData} onChange={handleChange} onSave={handleSave} onClose={closeModal} />
                    )}
                </div>
            </main>
        </AdminRedirect>
    );
}
