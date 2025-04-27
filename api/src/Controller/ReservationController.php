<?php

namespace App\Controller;

use App\Entity\Reservation;
use App\Repository\ReservationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

#[Route('/api/reservation')]
class ReservationController extends AbstractController
{
    #[Route('/utilisateur', methods: ['GET'])]
    public function listUserReservations(ReservationRepository $repository): Response
    {
        $utilisateur = $this->getUser(); // 🔥 Récupère l'utilisateur connecté
        if (!$utilisateur) {
            throw new AccessDeniedException("Authentification requise.");
        }

        $reservations = $repository->findBy(['utilisateur' => $utilisateur]); // ✅ Filtrage des réservations par utilisateur
        return $this->json($reservations);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(ReservationRepository $repository, int $id): Response
    {
        $reservation = $repository->find($id);
        return $reservation ? $this->json($reservation) : $this->json(['message' => 'Réservation non trouvée'], Response::HTTP_NOT_FOUND);
    }

    #[Route('/', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): Response
    {
        $utilisateur = $this->getUser(); // 🔥 Ajout de l'utilisateur connecté
        if (!$utilisateur) {
            throw new AccessDeniedException("Authentification requise.");
        }

        $data = json_decode($request->getContent(), true);
        $reservation = new Reservation();
        $reservation->setDateReservation(new \DateTime($data['dateReservation']));
        $reservation->setUtilisateur($utilisateur); // ✅ Associe la réservation à l'utilisateur

        $entityManager->persist($reservation);
        $entityManager->flush();

        return $this->json($reservation, Response::HTTP_CREATED);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(Request $request, EntityManagerInterface $entityManager, ReservationRepository $repository, int $id): Response
    {
        $utilisateur = $this->getUser();
        if (!$utilisateur) {
            throw new AccessDeniedException("Authentification requise.");
        }

        $reservation = $repository->find($id);
        if (!$reservation || $reservation->getUtilisateur() !== $utilisateur) { // ✅ Vérifie que l'utilisateur possède cette réservation
            return $this->json(['message' => 'Accès refusé.'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);
        if (isset($data['dateReservation'])) {
            $reservation->setDateReservation(new \DateTime($data['dateReservation']));
        }

        $entityManager->flush();
        return $this->json($reservation);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(EntityManagerInterface $entityManager, ReservationRepository $repository, int $id): Response
    {
        $utilisateur = $this->getUser();
        if (!$utilisateur) {
            throw new AccessDeniedException("Authentification requise.");
        }

        $reservation = $repository->find($id);
        if (!$reservation || $reservation->getUtilisateur() !== $utilisateur) { // ✅ Vérifie que l'utilisateur possède cette réservation
            return $this->json(['message' => 'Accès refusé.'], Response::HTTP_FORBIDDEN);
        }

        $entityManager->remove($reservation);
        $entityManager->flush();

        return $this->json(['message' => 'Réservation supprimée']);
    }
}
