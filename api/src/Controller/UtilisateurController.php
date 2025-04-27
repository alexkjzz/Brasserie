<?php

namespace App\Controller;

use App\Entity\Utilisateur;
use App\Repository\UtilisateurRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/utilisateur')]
class UtilisateurController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/all', name: 'get_all_utilisateurs', methods: ['GET'])]
    public function getAllUtilisateurs(UtilisateurRepository $utilisateurRepository): JsonResponse
    {
        $utilisateurs = $utilisateurRepository->findAll();
        return $this->json($utilisateurs);
    }

    #[Route('/{id}', name: 'get_utilisateur', methods: ['GET'])]
    public function getUtilisateur(UtilisateurRepository $utilisateurRepository, int $id): JsonResponse
    {
        $utilisateur = $utilisateurRepository->find($id);
        if (!$utilisateur) {
            return new JsonResponse(['message' => 'Utilisateur non trouvé.'], JsonResponse::HTTP_NOT_FOUND);
        }
        return $this->json($utilisateur);
    }

    #[Route('/{id}', name: 'update_utilisateur', methods: ['PUT'])]
    public function updateUtilisateur(Request $request, EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        $utilisateur = $entityManager->getRepository(Utilisateur::class)->find($id);
    
        if (!$utilisateur) {
            return new JsonResponse(['message' => 'Utilisateur non trouvé.'], JsonResponse::HTTP_NOT_FOUND);
        }
    
        $data = json_decode($request->getContent(), true);
        if (isset($data['nom'])) $utilisateur->setNom($data['nom']);
        if (isset($data['prenom'])) $utilisateur->setPrenom($data['prenom']);
        if (isset($data['email'])) $utilisateur->setEmail($data['email']);
    
        $entityManager->persist($utilisateur);
        $entityManager->flush();
    
        return new JsonResponse(['message' => 'Utilisateur mis à jour avec succès.'], JsonResponse::HTTP_OK);
    }

    #[Route('/delete/{id}', name: 'delete_utilisateur', methods: ['DELETE'])]
    public function deleteUtilisateur(int $id): JsonResponse
    {
        $utilisateur = $this->entityManager->getRepository(Utilisateur::class)->find($id);
        if (!$utilisateur) {
            return new JsonResponse(['message' => 'Utilisateur non trouvé.'], JsonResponse::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($utilisateur);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Utilisateur supprimé avec succès.'], JsonResponse::HTTP_OK);
    }
}
