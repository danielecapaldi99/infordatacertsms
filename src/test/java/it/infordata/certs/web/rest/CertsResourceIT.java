package it.infordata.certs.web.rest;

import it.infordata.certs.InfordataCertsMsApp;
import it.infordata.certs.config.TestSecurityConfiguration;
import it.infordata.certs.domain.Certs;
import it.infordata.certs.repository.CertsRepository;
import it.infordata.certs.service.CertsService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link CertsResource} REST controller.
 */
@SpringBootTest(classes = { InfordataCertsMsApp.class, TestSecurityConfiguration.class })
@AutoConfigureMockMvc
@WithMockUser
public class CertsResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final String DEFAULT_MAIN_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_MAIN_CONTENT = "BBBBBBBBBB";

    private static final byte[] DEFAULT_ATTACHMENTS = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_ATTACHMENTS = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_ATTACHMENTS_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_ATTACHMENTS_CONTENT_TYPE = "image/png";

    private static final byte[] DEFAULT_IMAGES = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGES = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGES_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGES_CONTENT_TYPE = "image/png";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private CertsRepository certsRepository;

    @Autowired
    private CertsService certsService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCertsMockMvc;

    private Certs certs;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Certs createEntity(EntityManager em) {
        Certs certs = new Certs()
            .title(DEFAULT_TITLE)
            .content(DEFAULT_CONTENT)
            .mainContent(DEFAULT_MAIN_CONTENT)
            .attachments(DEFAULT_ATTACHMENTS)
            .attachmentsContentType(DEFAULT_ATTACHMENTS_CONTENT_TYPE)
            .images(DEFAULT_IMAGES)
            .imagesContentType(DEFAULT_IMAGES_CONTENT_TYPE)
            .date(DEFAULT_DATE);
        return certs;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Certs createUpdatedEntity(EntityManager em) {
        Certs certs = new Certs()
            .title(UPDATED_TITLE)
            .content(UPDATED_CONTENT)
            .mainContent(UPDATED_MAIN_CONTENT)
            .attachments(UPDATED_ATTACHMENTS)
            .attachmentsContentType(UPDATED_ATTACHMENTS_CONTENT_TYPE)
            .images(UPDATED_IMAGES)
            .imagesContentType(UPDATED_IMAGES_CONTENT_TYPE)
            .date(UPDATED_DATE);
        return certs;
    }

    @BeforeEach
    public void initTest() {
        certs = createEntity(em);
    }

    @Test
    @Transactional
    public void createCerts() throws Exception {
        int databaseSizeBeforeCreate = certsRepository.findAll().size();
        // Create the Certs
        restCertsMockMvc.perform(post("/api/certs").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(certs)))
            .andExpect(status().isCreated());

        // Validate the Certs in the database
        List<Certs> certsList = certsRepository.findAll();
        assertThat(certsList).hasSize(databaseSizeBeforeCreate + 1);
        Certs testCerts = certsList.get(certsList.size() - 1);
        assertThat(testCerts.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testCerts.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testCerts.getMainContent()).isEqualTo(DEFAULT_MAIN_CONTENT);
        assertThat(testCerts.getAttachments()).isEqualTo(DEFAULT_ATTACHMENTS);
        assertThat(testCerts.getAttachmentsContentType()).isEqualTo(DEFAULT_ATTACHMENTS_CONTENT_TYPE);
        assertThat(testCerts.getImages()).isEqualTo(DEFAULT_IMAGES);
        assertThat(testCerts.getImagesContentType()).isEqualTo(DEFAULT_IMAGES_CONTENT_TYPE);
        assertThat(testCerts.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    public void createCertsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = certsRepository.findAll().size();

        // Create the Certs with an existing ID
        certs.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCertsMockMvc.perform(post("/api/certs").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(certs)))
            .andExpect(status().isBadRequest());

        // Validate the Certs in the database
        List<Certs> certsList = certsRepository.findAll();
        assertThat(certsList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllCerts() throws Exception {
        // Initialize the database
        certsRepository.saveAndFlush(certs);

        // Get all the certsList
        restCertsMockMvc.perform(get("/api/certs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(certs.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT)))
            .andExpect(jsonPath("$.[*].mainContent").value(hasItem(DEFAULT_MAIN_CONTENT)))
            .andExpect(jsonPath("$.[*].attachmentsContentType").value(hasItem(DEFAULT_ATTACHMENTS_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].attachments").value(hasItem(Base64Utils.encodeToString(DEFAULT_ATTACHMENTS))))
            .andExpect(jsonPath("$.[*].imagesContentType").value(hasItem(DEFAULT_IMAGES_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].images").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGES))))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getCerts() throws Exception {
        // Initialize the database
        certsRepository.saveAndFlush(certs);

        // Get the certs
        restCertsMockMvc.perform(get("/api/certs/{id}", certs.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(certs.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT))
            .andExpect(jsonPath("$.mainContent").value(DEFAULT_MAIN_CONTENT))
            .andExpect(jsonPath("$.attachmentsContentType").value(DEFAULT_ATTACHMENTS_CONTENT_TYPE))
            .andExpect(jsonPath("$.attachments").value(Base64Utils.encodeToString(DEFAULT_ATTACHMENTS)))
            .andExpect(jsonPath("$.imagesContentType").value(DEFAULT_IMAGES_CONTENT_TYPE))
            .andExpect(jsonPath("$.images").value(Base64Utils.encodeToString(DEFAULT_IMAGES)))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingCerts() throws Exception {
        // Get the certs
        restCertsMockMvc.perform(get("/api/certs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCerts() throws Exception {
        // Initialize the database
        certsService.save(certs);

        int databaseSizeBeforeUpdate = certsRepository.findAll().size();

        // Update the certs
        Certs updatedCerts = certsRepository.findById(certs.getId()).get();
        // Disconnect from session so that the updates on updatedCerts are not directly saved in db
        em.detach(updatedCerts);
        updatedCerts
            .title(UPDATED_TITLE)
            .content(UPDATED_CONTENT)
            .mainContent(UPDATED_MAIN_CONTENT)
            .attachments(UPDATED_ATTACHMENTS)
            .attachmentsContentType(UPDATED_ATTACHMENTS_CONTENT_TYPE)
            .images(UPDATED_IMAGES)
            .imagesContentType(UPDATED_IMAGES_CONTENT_TYPE)
            .date(UPDATED_DATE);

        restCertsMockMvc.perform(put("/api/certs").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedCerts)))
            .andExpect(status().isOk());

        // Validate the Certs in the database
        List<Certs> certsList = certsRepository.findAll();
        assertThat(certsList).hasSize(databaseSizeBeforeUpdate);
        Certs testCerts = certsList.get(certsList.size() - 1);
        assertThat(testCerts.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testCerts.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testCerts.getMainContent()).isEqualTo(UPDATED_MAIN_CONTENT);
        assertThat(testCerts.getAttachments()).isEqualTo(UPDATED_ATTACHMENTS);
        assertThat(testCerts.getAttachmentsContentType()).isEqualTo(UPDATED_ATTACHMENTS_CONTENT_TYPE);
        assertThat(testCerts.getImages()).isEqualTo(UPDATED_IMAGES);
        assertThat(testCerts.getImagesContentType()).isEqualTo(UPDATED_IMAGES_CONTENT_TYPE);
        assertThat(testCerts.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingCerts() throws Exception {
        int databaseSizeBeforeUpdate = certsRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCertsMockMvc.perform(put("/api/certs").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(certs)))
            .andExpect(status().isBadRequest());

        // Validate the Certs in the database
        List<Certs> certsList = certsRepository.findAll();
        assertThat(certsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteCerts() throws Exception {
        // Initialize the database
        certsService.save(certs);

        int databaseSizeBeforeDelete = certsRepository.findAll().size();

        // Delete the certs
        restCertsMockMvc.perform(delete("/api/certs/{id}", certs.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Certs> certsList = certsRepository.findAll();
        assertThat(certsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
