<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250505095637 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE details_reservation ADD CONSTRAINT FK_29B263AAB83297E7 FOREIGN KEY (reservation_id) REFERENCES reservation (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE details_reservation ADD CONSTRAINT FK_29B263AAF347EFB FOREIGN KEY (produit_id) REFERENCES produit (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_29B263AAB83297E7 ON details_reservation (reservation_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_29B263AAF347EFB ON details_reservation (produit_id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE details_reservation DROP FOREIGN KEY FK_29B263AAB83297E7
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE details_reservation DROP FOREIGN KEY FK_29B263AAF347EFB
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_29B263AAB83297E7 ON details_reservation
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_29B263AAF347EFB ON details_reservation
        SQL);
    }
}
