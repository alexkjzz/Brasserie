<?php

namespace App\Controller;

use App\Entity\DetailsReservation;
use App\Repository\DetailsReservationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/details-reservation')]
class DetailsReservationController extends AbstractController
{

    #[Route('/', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $detail = new DetailsReservation();
        $detail->setReservation($data['id_reservation'])
            ->setProduit($data['id_produit'])
            ->setQuantite($data['quantite']);

        $entityManager->persist($detail);
        $entityManager->flush();

        return $this->json($detail, Response::HTTP_CREATED);
    }

    #[Route('/{id_reservation}/{id_produit}', methods: ['DELETE'])]
    public function delete(EntityManagerInterface $entityManager, DetailsReservationRepository $repository, int $id_reservation, int $id_produit): Response
    {
        $detail = $repository->findOneBy(['reservation' => $id_reservation, 'produit' => $id_produit]);
        if (!$detail) return $this->json(['message' => 'Détails de réservation non trouvés'], Response::HTTP_NOT_FOUND);

        $entityManager->remove($detail);
        $entityManager->flush();

        return $this->json(['message' => 'Détails supprimés']);
    }

    #[Route('/user', name: 'get_user_details_reservations', methods: ['GET'])]
    public function getUserDetailsReservations(
        DetailsReservationRepository $detailsReservationRepository
    ): JsonResponse {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non authentifié.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $details = $detailsReservationRepository->findByUser($user);

        $data = array_map(function ($detail) {
            return [
                'reservation_id' => $detail->getReservation()->getId(),
                'dateReservation' => $detail->getReservation()->getDateReservation()->format('Y-m-d H:i:s'),
                'produit' => $detail->getProduit()->getNom(),
                'quantite' => $detail->getQuantite(),
            ];
        }, $details);

        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }
}