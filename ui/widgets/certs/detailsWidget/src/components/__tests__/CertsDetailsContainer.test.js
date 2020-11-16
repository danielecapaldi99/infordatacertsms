import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import 'components/__mocks__/i18n';
import { apiCertsGet } from 'api/certs';
import certsApiGetResponseMock from 'components/__mocks__/certsMocks';
import CertsDetailsContainer from 'components/CertsDetailsContainer';

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

beforeEach(() => {
  apiCertsGet.mockClear();
});

describe('CertsDetailsContainer component', () => {
  test('requests data when component is mounted', async () => {
    apiCertsGet.mockImplementation(() => Promise.resolve(certsApiGetResponseMock));

    render(<CertsDetailsContainer id="1" />);

    await wait(() => {
      expect(apiCertsGet).toHaveBeenCalledTimes(1);
    });
  });

  test('data is shown after mount API call', async () => {
    apiCertsGet.mockImplementation(() => Promise.resolve(certsApiGetResponseMock));

    const { getByText } = render(<CertsDetailsContainer id="1" />);

    await wait(() => {
      expect(apiCertsGet).toHaveBeenCalledTimes(1);
      expect(getByText('entities.certs.title')).toBeInTheDocument();
      expect(getByText('entities.certs.content')).toBeInTheDocument();
      expect(getByText('entities.certs.mainContent')).toBeInTheDocument();
      expect(getByText('entities.certs.attachments')).toBeInTheDocument();
      expect(getByText('entities.certs.images')).toBeInTheDocument();
      expect(getByText('entities.certs.date')).toBeInTheDocument();
    });
  });

  test('error is shown after failed API call', async () => {
    const onErrorMock = jest.fn();
    apiCertsGet.mockImplementation(() => Promise.reject());

    const { getByText } = render(<CertsDetailsContainer id="1" onError={onErrorMock} />);

    await wait(() => {
      expect(apiCertsGet).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getByText('common.couldNotFetchData')).toBeInTheDocument();
    });
  });
});
