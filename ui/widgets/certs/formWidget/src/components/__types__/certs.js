import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.number,

  title: PropTypes.string,
  content: PropTypes.string,
  mainContent: PropTypes.string,
  attachments: PropTypes.string,
  images: PropTypes.string,
  date: PropTypes.string,
});

export const formValues = PropTypes.shape({
  title: PropTypes.string,
  content: PropTypes.string,
  mainContent: PropTypes.string,
  attachments: PropTypes.string,
  images: PropTypes.string,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
});

export const formTouched = PropTypes.shape({
  title: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  content: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  mainContent: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  attachments: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  images: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
  date: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]),
});

export const formErrors = PropTypes.shape({
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  mainContent: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  attachments: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  images: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
});
