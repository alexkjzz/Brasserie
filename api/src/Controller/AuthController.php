<?php

namespace App\Controller;

use App\Entity\Utilisateur;
use App\Repository\UtilisateurRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;

class AuthController extends AbstractController
{
    #[Route('/api/login', name: 'verifyUtilisateur', methods: ['POST'])]
    public function verifyUtilisateur(
        Request $request,
        UtilisateurRepository $utilisateurRepository,
        UserPasswordHasherInterface $passwordHasher,
        JWTTokenManagerInterface $JWTManager,
        SerializerInterface $serializer
    ): JsonResponse {
        $content = json_decode($request->getContent(), true);
        $email = $content['email'] ?? null;
        $password = $content['password'] ?? null;

        // Vérification des champs requis
        if (empty($email) || empty($password)) {
            return new JsonResponse(['message' => 'Email et mot de passe sont requis.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Recherche de l'utilisateur par email
        $utilisateur = $utilisateurRepository->findOneBy(['email' => $email]);

        if (!$utilisateur) {
            return new JsonResponse(['message' => 'Utilisateur non trouvé.'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Vérification du mot de passe
        if (!$passwordHasher->isPasswordValid($utilisateur, $password)) {
            return new JsonResponse(['message' => 'Mot de passe incorrect.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        try {
            // Génération du token JWT
            $token = $JWTManager->create($utilisateur);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Erreur lors de la génération du token JWT.'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Sérialisation des données utilisateur
        $jsonUtilisateur = $serializer->serialize($utilisateur, 'json', ['groups' => 'getUtilisateurs']);
        $utilisateurData = json_decode($jsonUtilisateur, true);

        // Ajout de l'ID utilisateur dans la réponse
        return new JsonResponse([
            'token' => $token,
            'utilisateur' => [
                'id' => $utilisateur->getId(),
                'nom' => $utilisateur->getNom(),
                'prenom' => $utilisateur->getPrenom(),
                'email' => $utilisateur->getEmail(),
            ],
        ], JsonResponse::HTTP_OK);
    }

    #[Route('/api/register', name: 'registerUtilisateur', methods: ['POST'])]
    public function registerUtilisateur(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $content = json_decode($request->getContent(), true);
        $nom = $content['nom'] ?? null;
        $prenom = $content['prenom'] ?? null;
        $email = $content['email'] ?? null;
        $password = $content['password'] ?? null;

        if (empty($nom) || empty($prenom) || empty($email) || empty($password)) {
            return new JsonResponse(['message' => 'Tous les champs sont requis.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Vérifier si l'utilisateur existe déjà
        if ($entityManager->getRepository(Utilisateur::class)->findOneBy(['email' => $email])) {
            return new JsonResponse(['message' => 'Cet email est déjà utilisé.'], JsonResponse::HTTP_CONFLICT);
        }

        // Création de l'utilisateur
        $utilisateur = new Utilisateur();
        $utilisateur->setNom($nom)
                    ->setPrenom($prenom)
                    ->setEmail($email)
                    ->setPassword($passwordHasher->hashPassword($utilisateur, $password))
                    ->setRoles(['ROLE_USER']);

        $entityManager->persist($utilisateur);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Utilisateur enregistré avec succès.'], JsonResponse::HTTP_CREATED);
    }
}
