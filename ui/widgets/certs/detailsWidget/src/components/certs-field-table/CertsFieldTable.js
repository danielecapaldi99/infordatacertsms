import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import certsType from 'components/__types__/certs';

const CertsFieldTable = ({ t, i18n: { language }, certs }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>{t('common.name')}</TableCell>
        <TableCell>{t('common.value')}</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>
          <span>{t('entities.certs.id')}</span>
        </TableCell>
        <TableCell>
          <span>{certs.id}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.certs.title')}</span>
        </TableCell>
        <TableCell>
          <span>{certs.title}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.certs.content')}</span>
        </TableCell>
        <TableCell>
          <span>{certs.content}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.certs.mainContent')}</span>
        </TableCell>
        <TableCell>
          <span>{certs.mainContent}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.certs.attachments')}</span>
        </TableCell>
        <TableCell>
          <span>
            <img src={`data:${certs.attachmentsContentType};base64, ${certs.attachments}`} alt="" />
          </span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.certs.images')}</span>
        </TableCell>
        <TableCell>
          <span>
            <img src={`data:${certs.imagesContentType};base64, ${certs.images}`} alt="" />
          </span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <span>{t('entities.certs.date')}</span>
        </TableCell>
        <TableCell>
          <span>{certs.date && new Date(certs.date).toLocaleDateString(language)}</span>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

CertsFieldTable.propTypes = {
  certs: certsType,
  t: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    language: PropTypes.string,
  }).isRequired,
};

CertsFieldTable.defaultProps = {
  certs: [],
};

export default withTranslation()(CertsFieldTable);
