<?php

namespace App\Entity;

use App\Repository\ReservationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ReservationRepository::class)]
class Reservation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups("reservation")]
    private ?int $id = null;

    #[ORM\Column(type: "datetime")]
    #[Groups("reservation")]
    private ?\DateTimeInterface $dateReservation = null;

    #[ORM\ManyToOne(targetEntity: Utilisateur::class, inversedBy: "reservations")]
    #[ORM\JoinColumn(name: "id_utilisateur", referencedColumnName: "id", nullable: false, onDelete: "CASCADE")]
    #[Groups("reservation")]
    private ?Utilisateur $utilisateur = null;

    #[ORM\Column(type: "string", length: 20)]
    private string $status = "Pending";

    #[ORM\OneToMany(mappedBy: "reservation", targetEntity: DetailsReservation::class, cascade: ["persist", "remove"])]
    private Collection $detailsReservations;

    public function __construct()
    {
        $this->detailsReservations = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateReservation(): ?\DateTimeInterface
    {
        return $this->dateReservation;
    }

    public function setDateReservation(\DateTimeInterface $dateReservation): self
    {
        $this->dateReservation = $dateReservation;
        return $this;
    }

    public function getUtilisateur(): ?Utilisateur
    {
        return $this->utilisateur;
    }

    public function setUtilisateur(?Utilisateur $utilisateur): self
    {
        $this->utilisateur = $utilisateur;
        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;
        return $this;
    }

    public function getDetailsReservations(): Collection
    {
        return $this->detailsReservations;
    }

    public function addDetailsReservation(DetailsReservation $detailsReservation): self
    {
        if (!$this->detailsReservations->contains($detailsReservation)) {
            $this->detailsReservations[] = $detailsReservation;
            $detailsReservation->setReservation($this);
        }

        return $this;
    }

    public function removeDetailsReservation(DetailsReservation $detailsReservation): self
    {
        if ($this->detailsReservations->removeElement($detailsReservation)) {
            // Set the owning side to null (unless already changed)
            if ($detailsReservation->getReservation() === $this) {
                $detailsReservation->setReservation(null);
            }
        }
        return $this;
    }
}