package it.infordata.certs.service.impl;

import it.infordata.certs.service.CertsService;
import it.infordata.certs.domain.Certs;
import it.infordata.certs.repository.CertsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link Certs}.
 */
@Service
@Transactional
public class CertsServiceImpl implements CertsService {

    private final Logger log = LoggerFactory.getLogger(CertsServiceImpl.class);

    private final CertsRepository certsRepository;

    public CertsServiceImpl(CertsRepository certsRepository) {
        this.certsRepository = certsRepository;
    }

    /**
     * Save a certs.
     *
     * @param certs the entity to save.
     * @return the persisted entity.
     */
    @Override
    public Certs save(Certs certs) {
        log.debug("Request to save Certs : {}", certs);
        return certsRepository.save(certs);
    }

    /**
     * Get all the certs.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Certs> findAll(Pageable pageable) {
        log.debug("Request to get all Certs");
        return certsRepository.findAll(pageable);
    }


    /**
     * Get one certs by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Certs> findOne(Long id) {
        log.debug("Request to get Certs : {}", id);
        return certsRepository.findById(id);
    }

    /**
     * Delete the certs by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Certs : {}", id);

        certsRepository.deleteById(id);
    }
}
