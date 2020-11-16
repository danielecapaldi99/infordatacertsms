import 'date-fns';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { formValues, formTouched, formErrors } from 'components/__types__/certs';
import { withFormik } from 'formik';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import dateFnsLocales from 'i18n/dateFnsLocales';
import ConfirmationDialogTrigger from 'components/common/ConfirmationDialogTrigger';

const styles = (theme) => ({
  root: {
    margin: theme.spacing(3),
  },
  button: {
    marginBottom: '10px',
  },
  downloadAnchor: {
    color: 'inherit',
    textDecoration: 'inherit',
    fontWeight: 'inherit',
    '&:link, &:visited, &:hover, &:active': {
      color: 'inherit',
      textDecoration: 'inherit',
      fontWeight: 'inherit',
    },
  },
  textField: {
    width: '100%',
  },
});
class CertsForm extends PureComponent {
  constructor(props) {
    super(props);
    this.handleConfirmationDialogAction = this.handleConfirmationDialogAction.bind(this);
  }

  handleConfirmationDialogAction(action) {
    const { onDelete, values } = this.props;
    switch (action) {
      case ConfirmationDialogTrigger.CONFIRM: {
        onDelete(values);
        break;
      }
      default:
        break;
    }
  }

  render() {
    const {
      classes,
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      handleSubmit: formikHandleSubmit,
      onDelete,
      onCancelEditing,
      isSubmitting,
      setFieldValue,
      t,
      i18n,
    } = this.props;

    const handleDateChange = (field) => (value) => {
      setFieldValue(field, value);
    };

    const dateLabelFn = (date) => (date ? new Date(date).toLocaleDateString(i18n.language) : '');
    const getHelperText = (field) => (errors[field] && touched[field] ? errors[field] : '');
    const getFormattedTime = () => {
      const today = new Date();
      return `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`;
    };

    const handleFiles = (field) => (event) => {
      const uploadedFile = event.target;
      const reader = new FileReader();
      reader.onload = () => {
        const dataURL = reader.result;
        const imageData = dataURL.match(/data:([^;]*);base64,(.*)$/);
        if (imageData && imageData[1] && imageData[2]) {
          setFieldValue(field, imageData[2]);
          setFieldValue(`${field}ContentType`, imageData[1]);
        }
      };
      reader.readAsDataURL(uploadedFile.files[0]);
    };

    const handleSubmit = (e) => {
      e.stopPropagation(); // avoids double submission caused by react-shadow-dom-retarget-events
      formikHandleSubmit(e);
    };

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={dateFnsLocales[i18n.language]}>
        <form onSubmit={handleSubmit} className={classes.root} data-testid="certs-form">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="certs-title"
                error={errors.title && touched.title}
                helperText={getHelperText('title')}
                className={classes.textField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.title}
                name="title"
                label={t('entities.certs.title')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="certs-content"
                error={errors.content && touched.content}
                helperText={getHelperText('content')}
                className={classes.textField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.content}
                name="content"
                label={t('entities.certs.content')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="certs-mainContent"
                error={errors.mainContent && touched.mainContent}
                helperText={getHelperText('mainContent')}
                className={classes.textField}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.mainContent}
                name="mainContent"
                label={t('entities.certs.mainContent')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel htmlFor="attachments-upload-file-button">
                {t('entities.certs.attachments')}
              </InputLabel>
              <div>
                <input
                  data-testid="attachments-uploader"
                  style={{ display: 'none' }}
                  id="attachments-upload-file-button"
                  accept="image/*"
                  type="file"
                  onChange={handleFiles('attachments')}
                />
                <label htmlFor="attachments-upload-file-button">
                  <Button className={classes.button} component="span">
                    {t('common.selectImageFile')}
                  </Button>
                </label>
              </div>
              {values.attachments && (
                <div>
                  <img
                    src={`data:${values.attachmentsContentType};base64, ${values.attachments}`}
                    alt=""
                  />
                </div>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel htmlFor="images-upload-file-button">
                {t('entities.certs.images')}
              </InputLabel>
              <div>
                <input
                  data-testid="images-uploader"
                  style={{ display: 'none' }}
                  id="images-upload-file-button"
                  accept="image/*"
                  type="file"
                  onChange={handleFiles('images')}
                />
                <label htmlFor="images-upload-file-button">
                  <Button className={classes.button} component="span">
                    {t('common.selectImageFile')}
                  </Button>
                </label>
              </div>
              {values.images && (
                <div>
                  <img src={`data:${values.imagesContentType};base64, ${values.images}`} alt="" />
                </div>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                id="certs-date"
                error={errors.date && touched.date}
                helperText={getHelperText('date')}
                className={classes.textField}
                onChange={handleDateChange('date')}
                value={values.date}
                labelFunc={dateLabelFn}
                name="date"
                label={t('entities.certs.date')}
              />
            </Grid>
            {onDelete && (
              <ConfirmationDialogTrigger
                onCloseDialog={this.handleConfirmationDialogAction}
                dialog={{
                  title: t('entities.certs.deleteDialog.title'),
                  description: t('entities.certs.deleteDialog.description'),
                  confirmLabel: t('common.yes'),
                  discardLabel: t('common.no'),
                }}
                Renderer={({ onClick }) => (
                  <Button onClick={onClick} disabled={isSubmitting}>
                    {t('common.delete')}
                  </Button>
                )}
              />
            )}

            <Button onClick={onCancelEditing} disabled={isSubmitting} data-testid="cancel-btn">
              {t('common.cancel')}
            </Button>

            <Button type="submit" color="primary" disabled={isSubmitting} data-testid="submit-btn">
              {t('common.save')}
            </Button>
          </Grid>
        </form>
      </MuiPickersUtilsProvider>
    );
  }
}

CertsForm.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    textField: PropTypes.string,
    submitButton: PropTypes.string,
    button: PropTypes.string,
    downloadAnchor: PropTypes.string,
  }),
  values: formValues,
  touched: formTouched,
  errors: formErrors,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onCancelEditing: PropTypes.func,
  isSubmitting: PropTypes.bool.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  i18n: PropTypes.shape({ language: PropTypes.string }).isRequired,
};

CertsForm.defaultProps = {
  onCancelEditing: () => {},
  classes: {},
  values: {},
  touched: {},
  errors: {},
  onDelete: null,
};

const emptyCerts = {
  title: '',
  content: '',
  mainContent: '',
  attachments: '',
  images: '',
  date: null,
};

const validationSchema = Yup.object().shape({
  title: Yup.string(),
  content: Yup.string(),
  mainContent: Yup.string(),
  attachments: Yup.string(),
  images: Yup.string(),
  date: Yup.date().nullable(),
});

const formikBag = {
  mapPropsToValues: ({ certs }) => certs || emptyCerts,

  enableReinitialize: true,

  validationSchema,

  handleSubmit: (values, { setSubmitting, props: { onSubmit } }) => {
    onSubmit(values);
    setSubmitting(false);
  },

  displayName: 'CertsForm',
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withTranslation(),
  withFormik(formikBag)
)(CertsForm);
