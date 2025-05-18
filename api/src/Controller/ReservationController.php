<?php

namespace App\Controller;

use App\Entity\Reservation;
use App\Entity\DetailsReservation;
use App\Entity\Produit;
use App\Repository\ReservationRepository;
use App\Repository\DetailsReservationRepository;
use App\Repository\ProduitRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use App\Repository\UtilisateurRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

#[Route('/api/reservation')]
class ReservationController extends AbstractController
{
    #[Route('/', name: 'app_reservation_create', methods: ['POST'])]
    public function create(
        Request $request, 
        EntityManagerInterface $entityManager, 
        ProduitRepository $produitRepository,
        UtilisateurRepository $utilisateurRepository
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['emailUtilisateur'], $data['produits']) || !is_array($data['produits']) || count($data['produits']) === 0) {
            return new JsonResponse(['message' => 'Données invalides.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $utilisateur = $utilisateurRepository->findOneBy(['email' => $data['emailUtilisateur']]);
        if (!$utilisateur) {
            return new JsonResponse(['message' => 'Utilisateur non trouvé.'], JsonResponse::HTTP_NOT_FOUND);
        }

        $reservation = new Reservation();
        $reservation->setUtilisateur($utilisateur);
        $reservation->setDateReservation(new \DateTime());

        foreach ($data['produits'] as $prod) {
            if (!isset($prod['id'], $prod['quantite'])) continue;

            $produit = $produitRepository->find($prod['id']);
            if (!$produit) {
                return new JsonResponse(['message' => "Produit ID {$prod['id']} non trouvé."], JsonResponse::HTTP_NOT_FOUND);
            }

            // Vérifiez si le produit est disponible en quantité suffisante
            if ($produit->getQuantite() < $prod['quantite']) {
                return new JsonResponse([
                    'message' => "Quantité insuffisante pour le produit {$produit->getNom()}. Disponible : {$produit->getQuantite()}."
                ], JsonResponse::HTTP_BAD_REQUEST);
            }

            // Diminuez la quantité globale du produit
            $produit->setQuantite($produit->getQuantite() - $prod['quantite']);

            $detailsReservation = new DetailsReservation();
            $detailsReservation->setReservation($reservation);
            $detailsReservation->setProduit($produit);
            $detailsReservation->setQuantite($prod['quantite']);
            $entityManager->persist($detailsReservation);
        }

        $entityManager->persist($reservation);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Réservation créée avec succès.',
            'reservation_id' => $reservation->getId(),
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('/all', methods: ['GET'])]
    public function fetchAllReservations(ReservationRepository $repository, DetailsReservationRepository $detailsRepository): Response
    {
        $reservations = $repository->findAll();
        $data = [];

        foreach ($reservations as $reservation) {
            $details = $detailsRepository->findBy(['reservation' => $reservation]);

            $produits = [];
            foreach ($details as $detail) {
                if ($detail->getProduit()) { // Vérifie que le produit n'est pas null
                    $produits[] = [
                        'id' => $detail->getProduit()->getId(),
                        'nom' => $detail->getProduit()->getNom(),
                        'quantite' => $detail->getQuantite(),
                    ];
                } else {
                    error_log("Produit NULL détecté dans la réservation ID=" . $reservation->getId());
                }
            }

            $data[] = [
                'id' => $reservation->getId(),
                'emailUtilisateur' => $reservation->getUtilisateur()->getEmail(),
                'dateReservation' => $reservation->getDateReservation()->format("Y-m-d H:i:s"),
                'produits' => $produits,
                'status' => $reservation->getStatus(),
            ];
        }

        return $this->json($data, Response::HTTP_OK);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(
        Request $request,
        EntityManagerInterface $entityManager,
        ReservationRepository $repository,
        DetailsReservationRepository $detailsRepository,
        ProduitRepository $produitRepository,
        int $id
    ): Response {
        $reservation = $repository->find($id);
    
        if (!$reservation) {
            return $this->json(['message' => 'Réservation introuvable.'], Response::HTTP_NOT_FOUND);
        }
    
        $data = json_decode($request->getContent(), true);
    
        // Mise à jour du statut
        if (isset($data['status'])) {
            $reservation->setStatus($data['status']);
        }
    
        // Mise à jour de la date de réservation
        if (isset($data['dateReservation'])) {
            try {
                $reservation->setDateReservation(new \DateTime($data['dateReservation']));
            } catch (\Exception $e) {
                return $this->json(['message' => 'Format de date invalide.'], Response::HTTP_BAD_REQUEST);
            }
        }
    
        // Mise à jour des produits
        if (isset($data['produits']) && is_array($data['produits'])) {
            // Supprimez les anciens détails de réservation
            foreach ($detailsRepository->findBy(['reservation' => $reservation]) as $detailsReservation) {
                $entityManager->remove($detailsReservation);
            }
    
            // Ajoutez les nouveaux détails de réservation
            foreach ($data['produits'] as $prod) {
                if (!isset($prod['id'], $prod['quantite'])) continue;
    
                $produit = $produitRepository->find($prod['id']);
                if (!$produit) {
                    return $this->json(['message' => "Produit ID {$prod['id']} non trouvé."], Response::HTTP_NOT_FOUND);
                }
    
                $detailsReservation = new DetailsReservation();
                $detailsReservation->setReservation($reservation);
                $detailsReservation->setProduit($produit);
                $detailsReservation->setQuantite($prod['quantite']);
                $entityManager->persist($detailsReservation);
            }
        }
    
        $entityManager->flush();
    
        return $this->json(
            $reservation,
            Response::HTTP_OK,
            [],
            [AbstractNormalizer::GROUPS => ['reservation:read']]
        );
    }

    #[Route('/{id<\d+>}', methods: ['DELETE'])]
    public function delete(
        EntityManagerInterface $entityManager, 
        ReservationRepository $repository, 
        DetailsReservationRepository $detailsRepository, 
        int $id, 
        Request $request
    ): Response
    {
        $reservation = $repository->find($id);
        $data = json_decode($request->getContent(), true);

        if (!$reservation) {
            return $this->json(['message' => 'Réservation introuvable.'], Response::HTTP_NOT_FOUND);
        }

        if (!isset($data['emailUtilisateur']) || $reservation->getUtilisateur()->getEmail() !== $data['emailUtilisateur']) {
            return $this->json(['message' => 'Accès refusé.'], Response::HTTP_FORBIDDEN);
        }

        foreach ($detailsRepository->findBy(['reservation' => $reservation]) as $detailsReservation) {
            $entityManager->remove($detailsReservation);
        }

        $entityManager->remove($reservation);
        $entityManager->flush();

        return $this->json(['message' => 'Réservation supprimée']);
    }

    #[Route('/{id}', name: 'create_reservation_with_id', methods: ['POST'])]
    public function createReservationWithId(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager,
        UtilisateurRepository $utilisateurRepository,
        ProduitRepository $produitRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $utilisateur = $utilisateurRepository->find($id);
        if (!$utilisateur) {
            return new JsonResponse(['message' => 'Utilisateur non trouvé.'], JsonResponse::HTTP_NOT_FOUND);
        }

        if (!isset($data['produits']) || !is_array($data['produits']) || count($data['produits']) === 0) {
            return new JsonResponse(['message' => 'Produits manquants.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $reservation = new Reservation();
        $reservation->setUtilisateur($utilisateur);
        $reservation->setDateReservation(new \DateTime());

        foreach ($data['produits'] as $prod) {
            if (!isset($prod['id'], $prod['quantite'])) continue;

            $produit = $produitRepository->find($prod['id']);
            if (!$produit) {
                return new JsonResponse(['message' => "Produit ID {$prod['id']} non trouvé."], JsonResponse::HTTP_NOT_FOUND);
            }

            // Vérifiez si le produit est disponible en quantité suffisante
            if ($produit->getQuantite() < $prod['quantite']) {
                return new JsonResponse([
                    'message' => "Quantité insuffisante pour le produit {$produit->getNom()}. Disponible : {$produit->getQuantite()}."
                ], JsonResponse::HTTP_BAD_REQUEST);
            }

            // Diminuez la quantité globale du produit
            $produit->setQuantite($produit->getQuantite() - $prod['quantite']);

            $detailsReservation = new DetailsReservation();
            $detailsReservation->setReservation($reservation);
            $detailsReservation->setProduit($produit);
            $detailsReservation->setQuantite($prod['quantite']);
            $entityManager->persist($detailsReservation);
        }

        $entityManager->persist($reservation);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Réservation créée avec succès.',
            'reservation_id' => $reservation->getId(),
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'delete_reservation', methods: ['DELETE'])]
    public function deleteReservation(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager,
        ReservationRepository $reservationRepository
    ): JsonResponse {
        $reservation = $reservationRepository->find($id);

        if (!$reservation) {
            return new JsonResponse(['message' => 'Réservation non trouvée.'], JsonResponse::HTTP_NOT_FOUND);
        }

        $currentUser = $this->getUser();

        // Vérifiez si l'utilisateur est admin ou propriétaire de la réservation
        if (!in_array('ROLE_ADMIN', $currentUser->getRoles()) && $reservation->getUtilisateur() !== $currentUser) {
            return new JsonResponse(['message' => 'Accès refusé.'], JsonResponse::HTTP_FORBIDDEN);
        }

        $entityManager->remove($reservation);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Réservation supprimée avec succès.'], JsonResponse::HTTP_OK);
    }

    #[Route('/user-orders', name: 'get_user_orders', methods: ['GET'])]
    public function getUserOrders(
        ReservationRepository $reservationRepository,
        DetailsReservationRepository $detailsReservationRepository
    ): JsonResponse {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non authentifié.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $reservations = $reservationRepository->findBy(['utilisateur' => $user]);

        $data = [];
        foreach ($reservations as $reservation) {
            $details = $detailsReservationRepository->findBy(['reservation' => $reservation]);

            $produits = [];
            foreach ($details as $detail) {
                if ($detail->getProduit()) {
                    $produits[] = [
                        'id' => $detail->getProduit()->getId(),
                        'nom' => $detail->getProduit()->getNom(),
                        'quantite' => $detail->getQuantite(),
                    ];
                }
            }

            $data[] = [
                'reservation_id' => $reservation->getId(),
                'utilisateur_id' => $reservation->getUtilisateur()->getId(),
                'dateReservation' => $reservation->getDateReservation()->format('Y-m-d H:i:s'),
                'produits' => $produits,
                'status' => $reservation->getStatus(),
            ];
        }

        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }
}
