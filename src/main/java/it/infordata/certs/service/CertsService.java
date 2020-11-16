package it.infordata.certs.service;

import it.infordata.certs.domain.Certs;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing {@link Certs}.
 */
public interface CertsService {

    /**
     * Save a certs.
     *
     * @param certs the entity to save.
     * @return the persisted entity.
     */
    Certs save(Certs certs);

    /**
     * Get all the certs.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Certs> findAll(Pageable pageable);


    /**
     * Get the "id" certs.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Certs> findOne(Long id);

    /**
     * Delete the "id" certs.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
