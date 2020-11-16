import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import certsType from 'components/__types__/certs';

const styles = {
  tableRoot: {
    marginTop: '10px',
  },
  rowRoot: {
    cursor: 'pointer',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  noItems: {
    margin: '15px',
  },
};

const CertsTable = ({ items, onSelect, classes, t, i18n, Actions }) => {
  const tableRows = items.map((item) => (
    <TableRow hover className={classes.rowRoot} key={item.id} onClick={() => onSelect(item)}>
      <TableCell>
        <span>{item.title}</span>
      </TableCell>
      <TableCell>
        <span>{item.content}</span>
      </TableCell>
      <TableCell>
        <span>{item.mainContent}</span>
      </TableCell>
      <TableCell>
        <span>
          <img src={`data:${item.attachmentsContentType};base64, ${item.attachments}`} alt="" />
        </span>
      </TableCell>
      <TableCell>
        <span>
          <img src={`data:${item.imagesContentType};base64, ${item.images}`} alt="" />
        </span>
      </TableCell>
      <TableCell>
        <span>{new Date(item.date).toLocaleDateString(i18n.language)}</span>
      </TableCell>
      {Actions && (
        <TableCell>
          <Actions item={item} />
        </TableCell>
      )}
    </TableRow>
  ));

  return items.length ? (
    <Table className={classes.tableRoot} stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell>
            <span>{t('entities.certs.title')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.certs.content')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.certs.mainContent')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.certs.attachments')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.certs.images')}</span>
          </TableCell>
          <TableCell>
            <span>{t('entities.certs.date')}</span>
          </TableCell>
          {Actions && <TableCell />}
        </TableRow>
      </TableHead>
      <TableBody>{tableRows}</TableBody>
    </Table>
  ) : (
    <div className={classes.noItems}>{t('entities.certs.noItems')}</div>
  );
};

CertsTable.propTypes = {
  items: PropTypes.arrayOf(certsType).isRequired,
  onSelect: PropTypes.func,
  classes: PropTypes.shape({
    rowRoot: PropTypes.string,
    tableRoot: PropTypes.string,
    noItems: PropTypes.string,
  }).isRequired,
  t: PropTypes.func.isRequired,
  i18n: PropTypes.shape({ language: PropTypes.string }).isRequired,
  Actions: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

CertsTable.defaultProps = {
  onSelect: () => {},
  Actions: null,
};

export default withStyles(styles)(withTranslation()(CertsTable));
