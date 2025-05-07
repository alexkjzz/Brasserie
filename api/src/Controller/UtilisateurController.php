<?php

namespace App\Controller;

use App\Entity\Utilisateur;
use App\Repository\UtilisateurRepository;
use App\Repository\ReservationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

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

    #[Route('/me', name: 'get_user_profile', methods: ['GET'])]
    public function getUserProfile(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non authentifié.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'id' => $user->getId(),
            'nom' => $user->getNom(),
            'prenom' => $user->getPrenom(),
            'email' => $user->getEmail(),
        ], JsonResponse::HTTP_OK);
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
    public function deleteUtilisateur(
        int $id,
        EntityManagerInterface $entityManager,
        ReservationRepository $reservationRepository,
        UtilisateurRepository $utilisateurRepository
    ): JsonResponse {
        $utilisateur = $utilisateurRepository->find($id);
    
        if (!$utilisateur) {
            return new JsonResponse(['message' => 'Utilisateur non trouvé.'], JsonResponse::HTTP_NOT_FOUND);
        }
    
        $reservations = $reservationRepository->findBy(['utilisateur' => $utilisateur]);
        foreach ($reservations as $reservation) {
            $entityManager->remove($reservation);
        }
    
        $entityManager->remove($utilisateur);
        $entityManager->flush();
    
        return new JsonResponse(['message' => 'Utilisateur supprimé avec succès.'], JsonResponse::HTTP_OK);
    }

    #[Route('/create', name: 'create_utilisateur', methods: ['POST'])]
    public function createUtilisateur(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
    
        if (!isset($data['nom'], $data['prenom'], $data['email'], $data['password'])) {
            return new JsonResponse(['message' => 'Données incomplètes.'], JsonResponse::HTTP_BAD_REQUEST);
        }
    
        $utilisateur = new Utilisateur();
        $utilisateur->setNom($data['nom']);
        $utilisateur->setPrenom($data['prenom']);
        $utilisateur->setEmail($data['email']);
        
        // Définition du mot de passe haché
        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
        $utilisateur->setPassword($hashedPassword);
        
        // Ajout du rôle ROLE_USER
        $utilisateur->setRoles(['ROLE_USER']);
    
        $this->entityManager->persist($utilisateur);
        $this->entityManager->flush();
    
        return new JsonResponse([
            'message' => 'Utilisateur créé avec succès.',
            'id' => $utilisateur->getId(),
            'roles' => $utilisateur->getRoles()
        ], JsonResponse::HTTP_CREATED);
    }
    

    #[Route('/change-password', name: 'change_password', methods: ['POST'])]
    public function changePassword(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non authentifié.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);
        $oldPassword = $data['oldPassword'] ?? null;
        $newPassword = $data['newPassword'] ?? null;

        if (!$passwordHasher->isPasswordValid($user, $oldPassword)) {
            return new JsonResponse(['message' => 'Ancien mot de passe incorrect.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user->setPassword($passwordHasher->hashPassword($user, $newPassword));
        $entityManager->flush();

        return new JsonResponse(['message' => 'Mot de passe modifié avec succès.'], JsonResponse::HTTP_OK);
    }
}