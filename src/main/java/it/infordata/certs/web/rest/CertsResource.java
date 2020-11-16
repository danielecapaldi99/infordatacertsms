package it.infordata.certs.web.rest;

import it.infordata.certs.domain.Certs;
import it.infordata.certs.service.CertsService;
import it.infordata.certs.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link it.infordata.certs.domain.Certs}.
 */
@RestController
@RequestMapping("/api")
public class CertsResource {

    private final Logger log = LoggerFactory.getLogger(CertsResource.class);

    private static final String ENTITY_NAME = "infordataCertsMsCerts";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CertsService certsService;

    public CertsResource(CertsService certsService) {
        this.certsService = certsService;
    }

    /**
     * {@code POST  /certs} : Create a new certs.
     *
     * @param certs the certs to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new certs, or with status {@code 400 (Bad Request)} if the certs has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/certs")
    public ResponseEntity<Certs> createCerts(@RequestBody Certs certs) throws URISyntaxException {
        log.debug("REST request to save Certs : {}", certs);
        if (certs.getId() != null) {
            throw new BadRequestAlertException("A new certs cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Certs result = certsService.save(certs);
        return ResponseEntity.created(new URI("/api/certs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /certs} : Updates an existing certs.
     *
     * @param certs the certs to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated certs,
     * or with status {@code 400 (Bad Request)} if the certs is not valid,
     * or with status {@code 500 (Internal Server Error)} if the certs couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/certs")
    public ResponseEntity<Certs> updateCerts(@RequestBody Certs certs) throws URISyntaxException {
        log.debug("REST request to update Certs : {}", certs);
        if (certs.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Certs result = certsService.save(certs);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, certs.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /certs} : get all the certs.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of certs in body.
     */
    @GetMapping("/certs")
    public ResponseEntity<List<Certs>> getAllCerts(Pageable pageable) {
        log.debug("REST request to get a page of Certs");
        Page<Certs> page = certsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /certs/:id} : get the "id" certs.
     *
     * @param id the id of the certs to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the certs, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/certs/{id}")
    public ResponseEntity<Certs> getCerts(@PathVariable Long id) {
        log.debug("REST request to get Certs : {}", id);
        Optional<Certs> certs = certsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(certs);
    }

    /**
     * {@code DELETE  /certs/:id} : delete the "id" certs.
     *
     * @param id the id of the certs to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/certs/{id}")
    public ResponseEntity<Void> deleteCerts(@PathVariable Long id) {
        log.debug("REST request to delete Certs : {}", id);

        certsService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
