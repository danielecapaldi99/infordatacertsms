package it.infordata.certs.repository;

import it.infordata.certs.domain.Certs;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Certs entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CertsRepository extends JpaRepository<Certs, Long> {
}
