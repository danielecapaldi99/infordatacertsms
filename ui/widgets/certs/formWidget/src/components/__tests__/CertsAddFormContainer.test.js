import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiCertsPost } from 'api/certs';
import CertsAddFormContainer from 'components/CertsAddFormContainer';
import 'i18n/__mocks__/i18nMock';
import certsMock from 'components/__mocks__/certsMocks';

jest.mock('api/certs');
jest.mock('@material-ui/pickers', () => {
  // eslint-disable-next-line react/prop-types
  const MockPicker = ({ id, value, name, label, onChange }) => {
    const handleChange = (event) => onChange(event.currentTarget.value);
    return (
      <span>
        <label htmlFor={id}>{label}</label>
        <input id={id} name={name} value={value || ''} onChange={handleChange} />
      </span>
    );
  };
  return {
    ...jest.requireActual('@material-ui/pickers'),
    DateTimePicker: MockPicker,
    DatePicker: MockPicker,
  };
});
const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n) {
    n -= 1;
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

jest.mock('auth/withKeycloak', () => {
  const withKeycloak = (Component) => {
    return (props) => (
      <Component
        {...props} // eslint-disable-line react/jsx-props-no-spreading
        keycloak={{
          initialized: true,
          authenticated: true,
        }}
      />
    );
  };

  return withKeycloak;
});

describe('CertsAddFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onCreateMock = jest.fn();

  it('saves data', async () => {
    apiCertsPost.mockImplementation((data) => Promise.resolve(data));

    const { findByTestId, findByLabelText, queryByText, rerender } = render(
      <CertsAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />
    );

    const titleField = await findByLabelText('entities.certs.title');
    fireEvent.change(titleField, { target: { value: certsMock.title } });
    const contentField = await findByLabelText('entities.certs.content');
    fireEvent.change(contentField, { target: { value: certsMock.content } });
    const mainContentField = await findByLabelText('entities.certs.mainContent');
    fireEvent.change(mainContentField, { target: { value: certsMock.mainContent } });
    const attachmentsField = await findByTestId('attachments-uploader');
    const attachmentsFile = dataURLtoFile(
      `data:image/png;base64,${certsMock.attachments}`,
      'attachments.png'
    );
    fireEvent.change(attachmentsField, { target: { files: [attachmentsFile] } });
    const imagesField = await findByTestId('images-uploader');
    const imagesFile = dataURLtoFile(`data:image/png;base64,${certsMock.images}`, 'images.png');
    fireEvent.change(imagesField, { target: { files: [imagesFile] } });
    const dateField = await findByLabelText('entities.certs.date');
    fireEvent.change(dateField, { target: { value: certsMock.date } });
    rerender(<CertsAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />);

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiCertsPost).toHaveBeenCalledTimes(1);
      expect(apiCertsPost).toHaveBeenCalledWith('', certsMock);

      expect(queryByText(successMessageKey)).toBeInTheDocument();

      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiCertsPost.mockImplementation(() => Promise.reject());

    const { findByTestId, findByLabelText, queryByText, rerender } = render(
      <CertsAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />
    );

    const titleField = await findByLabelText('entities.certs.title');
    fireEvent.change(titleField, { target: { value: certsMock.title } });
    const contentField = await findByLabelText('entities.certs.content');
    fireEvent.change(contentField, { target: { value: certsMock.content } });
    const mainContentField = await findByLabelText('entities.certs.mainContent');
    fireEvent.change(mainContentField, { target: { value: certsMock.mainContent } });
    const attachmentsField = await findByTestId('attachments-uploader');
    const attachmentsFile = dataURLtoFile(
      `data:image/png;base64,${certsMock.attachments}`,
      'attachments.png'
    );
    fireEvent.change(attachmentsField, { target: { files: [attachmentsFile] } });
    const imagesField = await findByTestId('images-uploader');
    const imagesFile = dataURLtoFile(`data:image/png;base64,${certsMock.images}`, 'images.png');
    fireEvent.change(imagesField, { target: { files: [imagesFile] } });
    const dateField = await findByLabelText('entities.certs.date');
    fireEvent.change(dateField, { target: { value: certsMock.date } });
    rerender(<CertsAddFormContainer onError={onErrorMock} onUpdate={onCreateMock} />);

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiCertsPost).toHaveBeenCalledTimes(1);
      expect(apiCertsPost).toHaveBeenCalledWith('', certsMock);

      expect(queryByText(successMessageKey)).not.toBeInTheDocument();

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
