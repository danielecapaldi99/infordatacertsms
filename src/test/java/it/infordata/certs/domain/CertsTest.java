package it.infordata.certs.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import it.infordata.certs.web.rest.TestUtil;

public class CertsTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Certs.class);
        Certs certs1 = new Certs();
        certs1.setId(1L);
        Certs certs2 = new Certs();
        certs2.setId(certs1.getId());
        assertThat(certs1).isEqualTo(certs2);
        certs2.setId(2L);
        assertThat(certs1).isNotEqualTo(certs2);
        certs1.setId(null);
        assertThat(certs1).isNotEqualTo(certs2);
    }
}
