import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { apiCertsGet, apiCertsPut } from 'api/certs';
import CertsEditFormContainer from 'components/CertsEditFormContainer';
import 'i18n/__mocks__/i18nMock';
import certsMock from 'components/__mocks__/certsMocks';

jest.mock('api/certs');

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

describe('CertsEditFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const errorMessageKey = 'error.dataLoading';
  const successMessageKey = 'common.dataSaved';

  const onErrorMock = jest.fn();
  const onUpdateMock = jest.fn();

  it('loads data', async () => {
    apiCertsGet.mockImplementation(() => Promise.resolve(certsMock));
    const { queryByText } = render(
      <CertsEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiCertsGet).toHaveBeenCalledTimes(1);
      expect(apiCertsGet).toHaveBeenCalledWith('', '1');
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
    });
  }, 7000);

  it('saves data', async () => {
    apiCertsGet.mockImplementation(() => Promise.resolve(certsMock));
    apiCertsPut.mockImplementation(() => Promise.resolve(certsMock));

    const { findByTestId, queryByText } = render(
      <CertsEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiCertsPut).toHaveBeenCalledTimes(1);
      expect(apiCertsPut).toHaveBeenCalledWith('', certsMock);
      expect(queryByText(successMessageKey)).toBeInTheDocument();
      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully loaded', async () => {
    apiCertsGet.mockImplementation(() => Promise.reject());
    const { queryByText } = render(
      <CertsEditFormContainer id="1" onError={onErrorMock} onUpdate={onUpdateMock} />
    );

    await wait(() => {
      expect(apiCertsGet).toHaveBeenCalledTimes(1);
      expect(apiCertsGet).toHaveBeenCalledWith('', '1');
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).toBeInTheDocument();
      expect(queryByText(successMessageKey)).not.toBeInTheDocument();
    });
  }, 7000);

  it('shows an error if data is not successfully saved', async () => {
    apiCertsGet.mockImplementation(() => Promise.resolve(certsMock));
    apiCertsPut.mockImplementation(() => Promise.reject());
    const { findByTestId, getByText } = render(
      <CertsEditFormContainer id="1" onError={onErrorMock} />
    );

    const saveButton = await findByTestId('submit-btn');

    fireEvent.click(saveButton);

    await wait(() => {
      expect(apiCertsGet).toHaveBeenCalledTimes(1);
      expect(apiCertsGet).toHaveBeenCalledWith('', '1');

      expect(apiCertsPut).toHaveBeenCalledTimes(1);
      expect(apiCertsPut).toHaveBeenCalledWith('', certsMock);

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  }, 7000);
});
