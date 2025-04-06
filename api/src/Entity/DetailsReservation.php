<?php

namespace App\Entity;

use App\Repository\DetailsReservationRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DetailsReservationRepository::class)]
class DetailsReservation
{
    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: Reservation::class, inversedBy: 'detailsReservations')]
    #[ORM\JoinColumn(name: "id_reservation", referencedColumnName: "id")]
    private ?Reservation $reservation = null;

    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: Produit::class)]
    #[ORM\JoinColumn(name: "id_produit", referencedColumnName: "id")]
    private ?Produit $produit = null;

    #[ORM\Column]
    private ?int $quantite = null;

    public function getQuantite(): ?int
    {
        return $this->quantite;
    }

    public function setQuantite(int $quantite): static
    {
        $this->quantite = $quantite;
        return $this;
    }

    public function getProduit(): ?Produit
    {
        return $this->produit;
    }

    public function setProduit(?Produit $produit): static
    {
        $this->produit = $produit;
        return $this;
    }

    public function getReservation(): ?Reservation
    {
        return $this->reservation;
    }

    public function setReservation(?Reservation $reservation): static
    {
        $this->reservation = $reservation;
        return $this;
    }
}

