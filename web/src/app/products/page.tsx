"use client";

import AdminRedirect from "@/components/AdminRedirect";
import ProductTable from "@/components/ProductTable";
import { Check, PlusCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { FaBeer, FaPlus } from "react-icons/fa";

interface Produit {
    id: number;
    nom: string;
    description: string;
    prix: number;
    quantite: number;
    disponible: boolean;
}

export default function Products() {
    const [produits, setProduits] = useState<Produit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduit, setEditingProduit] = useState<Produit | null>(null);
    const [editingField, setEditingField] = useState<string>(""); // 🔥 Stocke le champ modifié
    const [formData, setFormData] = useState<Omit<Produit, "id">>({
        nom: "",
        description: "",
        prix: 0,
        quantite: 0,
        disponible: false,
    });

    // 🔥 Fetch des produits depuis l'API
    useEffect(() => {
        const fetchProduits = async () => {
            try {
                const token = localStorage.getItem("jwtToken");

                const response = await fetch("http://127.0.0.1:8000/api/produit", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Erreur lors de la récupération des produits.");

                const data = await response.json();
                setProduits(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erreur inconnue.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduits();
    }, []);

    // 🔄 Gestion des changements dans le formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const rawValue = e.target.value;
        const value = e.target.name === "quantite" || e.target.name === "prix" 
            ? Number(rawValue) || 0  
            : rawValue;

        setEditingField(e.target.name); // ✅ Mets à jour le champ modifié
        setFormData({ 
            ...formData, 
            [e.target.name]: value,
            disponible: e.target.name === "quantite" ? Number(value) > 0 : formData.disponible,
        });
    };

    // 🛠 Ajouter ou modifier un produit
    const handleSave = async () => {
        const method = editingProduit ? "PUT" : "POST";
        const url = editingProduit ? `http://127.0.0.1:8000/api/produit/${editingProduit.id}` : "http://127.0.0.1:8000/api/produit/";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Erreur lors de la sauvegarde.");

            setModalOpen(false);
            setEditingProduit(null);
            setEditingField(""); // ✅ Réinitialise le champ après sauvegarde
            setFormData({ nom: "", description: "", prix: 0, quantite: 0, disponible: false });

            // 🔄 Re-fetch des produits après modification
            const updatedResponse = await fetch("http://127.0.0.1:8000/api/produit/");
            const updatedData = await updatedResponse.json();
            setProduits(updatedData);
        } catch (err) {
            console.error(err);
        }
    };

    // ❌ Supprimer un produit
    const handleDelete = async (id: number) => {
        try {
            await fetch(`http://127.0.0.1:8000/api/produit/${id}`, { method: "DELETE" });
            setProduits(produits.filter(produit => produit.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    // 🛠 Ouvrir le modal pour ajouter/modifier
    const openModal = (produit?: Produit) => {
        setEditingProduit(produit || null);
        setEditingField(""); // ✅ Réinitialise le champ affiché
        setFormData(produit || { nom: "", description: "", prix: 0, quantite: 0, disponible: false });
        setModalOpen(true);
    };

    // ❌ Fermer le modal
    const closeModal = () => {
        setModalOpen(false);
        setEditingProduit(null);
        setEditingField(""); // ✅ Réinitialise le champ affiché
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
                        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md">
                            <div className="bg-stone-900 p-8 rounded-lg shadow-lg w-[700px]"> {/* 🔥 Largeur augmentée */}
                                <h2 className="text-2xl font-bold text-white mb-6">
                                    {editingProduit ? `Modifier le produit "${formData.nom}"` : "Ajouter un nouveau produit"}
                                </h2>

                                <div className="space-y-4"> {/* 🔥 Ajout d'espace entre les inputs */}
                                    <label className="block text-white font-medium">Nom du produit</label>
                                    <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="w-full p-3 rounded-lg bg-stone-800 text-white border border-stone-600 focus:ring-2 focus:ring-blue-500" />

                                    <label className="block text-white font-medium">Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 rounded-lg bg-stone-800 text-white border border-stone-600 h-40 focus:ring-2 focus:ring-blue-500" />

                                    <label className="block text-white font-medium">Prix (€)</label>
                                    <input type="number" name="prix" value={formData.prix} onChange={handleChange} className="w-full p-3 rounded-lg bg-stone-800 text-white border border-stone-600 focus:ring-2 focus:ring-blue-500" />

                                    <label className="block text-white font-medium">Quantité</label>
                                    <input type="number" name="quantite" value={formData.quantite} onChange={handleChange} className="w-full p-3 rounded-lg bg-stone-800 text-white border border-stone-600 focus:ring-2 focus:ring-blue-500" />
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button onClick={handleSave} className="p-2">
                                        <Check size={28} /> {/* ✅ Icône "Enregistrer" */}
                                    </button>

                                    <button onClick={closeModal} className="p-2">
                                        <X size={28} /> {/* ❌ Icône "Annuler" */}
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </main>
        </AdminRedirect>
    );
}
