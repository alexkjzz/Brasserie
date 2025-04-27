<?php

namespace App\Controller;

use App\Entity\Produit;
use App\Repository\ProduitRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/produit')]
class ProduitController extends AbstractController
{
    // ✅ Route pour récupérer tous les produits
    #[Route('/', methods: ['GET'])]
    public function list(ProduitRepository $repository): JsonResponse
    {
        $produits = $repository->findAll();
        return $this->json($produits, Response::HTTP_OK);
    }

    // ✅ Route pour récupérer un produit par ID
    #[Route('/{id}', methods: ['GET'])]
    public function show(ProduitRepository $repository, int $id): JsonResponse
    {
        $produit = $repository->find($id);
        return $produit ? $this->json($produit) : $this->json(['message' => 'Produit non trouvé'], Response::HTTP_NOT_FOUND);
    }

    // ✅ Route pour ajouter un produit
    #[Route('/', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // 🔍 Validation des champs requis
        if (!isset($data['nom'], $data['description'], $data['prix'], $data['quantite'])) {
            return $this->json(['message' => 'Tous les champs sont requis'], Response::HTTP_BAD_REQUEST);
        }

        if (!is_numeric($data['prix']) || !is_int($data['quantite'])) {
            return $this->json(['message' => 'Prix doit être un nombre et quantité un entier'], Response::HTTP_BAD_REQUEST);
        }

        $produit = new Produit();
        $produit->setNom($data['nom'])
                ->setDescription($data['description'])
                ->setPrix((float) $data['prix'])
                ->setQuantite((int) $data['quantite'])
                ->setDisponible($data['quantite'] > 0);

        $entityManager->persist($produit);
        $entityManager->flush();

        return $this->json($produit, Response::HTTP_CREATED);
    }

    // ✅ Route pour mettre à jour un produit
    #[Route('/{id}', methods: ['PUT'])]
    public function update(Request $request, EntityManagerInterface $entityManager, ProduitRepository $repository, int $id): JsonResponse
    {
        $produit = $repository->find($id);
        if (!$produit) {
            return $this->json(['message' => 'Produit non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['nom'])) $produit->setNom($data['nom']);
        if (isset($data['description'])) $produit->setDescription($data['description']);
        if (isset($data['prix']) && is_numeric($data['prix'])) $produit->setPrix((float) $data['prix']);
        if (isset($data['quantite']) && is_int($data['quantite'])) {
            $produit->setQuantite((int) $data['quantite']);
            $produit->setDisponible($data['quantite'] > 0);
        }

        $entityManager->flush();

        return $this->json($produit, Response::HTTP_OK);
    }

    // ✅ Route pour supprimer un produit
    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(EntityManagerInterface $entityManager, ProduitRepository $repository, int $id): JsonResponse
    {
        $produit = $repository->find($id);
        if (!$produit) {
            return $this->json(['message' => 'Produit non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($produit);
        $entityManager->flush();

        return $this->json(['message' => 'Produit supprimé'], Response::HTTP_OK);
    }
}
