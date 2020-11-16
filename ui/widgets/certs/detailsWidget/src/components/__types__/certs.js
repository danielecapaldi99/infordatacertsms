import PropTypes from 'prop-types';

const certsType = PropTypes.shape({
  id: PropTypes.number,

  title: PropTypes.string,
  content: PropTypes.string,
  mainContent: PropTypes.string,
  attachments: PropTypes.string,
  images: PropTypes.string,
  date: PropTypes.string,
});

export default certsType;
