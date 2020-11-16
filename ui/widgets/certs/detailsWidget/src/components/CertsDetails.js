import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';

import certsType from 'components/__types__/certs';
import CertsFieldTable from 'components/certs-field-table/CertsFieldTable';

const CertsDetails = ({ t, certs }) => {
  return (
    <Box>
      <h3>
        {t('common.widgetName', {
          widgetNamePlaceholder: 'Certs',
        })}
      </h3>
      <CertsFieldTable certs={certs} />
    </Box>
  );
};

CertsDetails.propTypes = {
  certs: certsType,
  t: PropTypes.func.isRequired,
};

CertsDetails.defaultProps = {
  certs: {},
};

export default withTranslation()(CertsDetails);
