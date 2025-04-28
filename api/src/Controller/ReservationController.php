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

#[Route('/api/reservation')]
class ReservationController extends AbstractController
{
    #[Route('/', name: 'app_reservation_create', methods: ['POST'])]
    public function create(
        Request $request, 
        EntityManagerInterface $entityManager, 
        ProduitRepository $produitRepository,
        UtilisateurRepository $utilisateurRepository
    ): Response
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['dateReservation'], $data['emailUtilisateur'], $data['produits']) || !is_array($data['produits']) || count($data['produits']) === 0) {
            return $this->json(['message' => 'Données invalides.'], Response::HTTP_BAD_REQUEST);
        }

        $utilisateur = $utilisateurRepository->findOneBy(['email' => $data['emailUtilisateur']]);
        if (!$utilisateur) {
            return $this->json(['message' => 'Utilisateur non trouvé.'], Response::HTTP_NOT_FOUND);
        }

        try {
            $date = new \DateTime($data['dateReservation']);
        } catch (\Exception $e) {
            return $this->json(['message' => 'Format de date invalide.'], Response::HTTP_BAD_REQUEST);
        }

        $reservation = new Reservation();
        $reservation->setDateReservation($date);
        $reservation->setUtilisateur($utilisateur);
        $entityManager->persist($reservation);

        foreach ($data['produits'] as $prod) {
            if (!isset($prod['id'], $prod['quantite'])) continue;

            $produit = $produitRepository->find($prod['id']);
            if ($produit) {
                $detailsReservation = new DetailsReservation();
                $detailsReservation->setReservation($reservation);
                $detailsReservation->setProduit($produit);
                $detailsReservation->setQuantite($prod['quantite']);
                $entityManager->persist($detailsReservation);
            }
        }

        $entityManager->flush();

        return $this->json($reservation, Response::HTTP_CREATED);
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
                if ($detail->getProduit()) { // ✅ Vérifie que le produit n'est pas null
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

    #[Route('/{id<\d+>}', methods: ['PUT'])]
    public function update(
        Request $request, 
        EntityManagerInterface $entityManager, 
        ReservationRepository $repository, 
        DetailsReservationRepository $detailsRepository, 
        ProduitRepository $produitRepository, 
        int $id
    ): Response
    {
        $reservation = $repository->find($id);
        $data = json_decode($request->getContent(), true);

        if (!$reservation) {
            return $this->json(['message' => 'Réservation introuvable.'], Response::HTTP_NOT_FOUND);
        }

        if (isset($data['status'])) {
            $reservation->setStatus($data['status']);
        }
        
        if (!isset($data['emailUtilisateur']) || $reservation->getUtilisateur()->getEmail() !== $data['emailUtilisateur']) {
            return $this->json(['message' => 'Accès refusé.'], Response::HTTP_FORBIDDEN);
        }

        if (isset($data['dateReservation'])) {
            try {
                $reservation->setDateReservation(new \DateTime($data['dateReservation']));
            } catch (\Exception $e) {
                return $this->json(['message' => 'Format de date invalide.'], Response::HTTP_BAD_REQUEST);
            }
        }

        // ✅ Vérifie qu'il y a bien des produits avant de supprimer
        if (isset($data['produits']) && is_array($data['produits']) && count($data['produits']) > 0) {
            foreach ($detailsRepository->findBy(['reservation' => $reservation]) as $detailsReservation) {
                $entityManager->remove($detailsReservation);
            }

            foreach ($data['produits'] as $prod) {
                if (!isset($prod['id'], $prod['quantite'])) continue;

                $produit = $produitRepository->find($prod['id']);
                if ($produit) {
                    $detailsReservation = new DetailsReservation();
                    $detailsReservation->setReservation($reservation);
                    $detailsReservation->setProduit($produit);
                    $detailsReservation->setQuantite($prod['quantite']);
                    $entityManager->persist($detailsReservation);
                }
            }
        }

        $entityManager->flush();

        return $this->json($reservation);
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
}
