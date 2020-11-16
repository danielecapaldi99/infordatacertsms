import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import certsMocks from 'components/__mocks__/certsMocks';
import { apiCertsGet } from 'api/certs';
import 'i18n/__mocks__/i18nMock';
import CertsTableContainer from 'components/CertsTableContainer';

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

jest.mock('components/pagination/withPagination', () => {
  const withPagination = (Component) => {
    return (props) => (
      <Component
        {...props} // eslint-disable-line react/jsx-props-no-spreading
        pagination={{
          onChangeItemsPerPage: () => {},
          onChangeCurrentPage: () => {},
        }}
      />
    );
  };

  return withPagination;
});

describe('CertsTableContainer', () => {
  const errorMessageKey = 'error.dataLoading';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls API', async () => {
    apiCertsGet.mockImplementation(() => Promise.resolve({ certs: certsMocks, count: 2 }));
    const { queryByText } = render(<CertsTableContainer />);

    await wait(() => {
      expect(apiCertsGet).toHaveBeenCalledTimes(1);
      expect(queryByText(errorMessageKey)).not.toBeInTheDocument();
    });
  });

  it('shows an error if the API call is not successful', async () => {
    apiCertsGet.mockImplementation(() => {
      throw new Error();
    });
    const { getByText } = render(<CertsTableContainer />);

    wait(() => {
      expect(apiCertsGet).toHaveBeenCalledTimes(1);
      expect(getByText(errorMessageKey)).toBeInTheDocument();
    });
  });
});
