import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

import 'components/__mocks__/i18n';
import CertsDetails from 'components/CertsDetails';
import certsMock from 'components/__mocks__/certsMocks';

describe('CertsDetails component', () => {
  test('renders data in details widget', () => {
    const { getByText } = render(<CertsDetails certs={certsMock} />);

    expect(getByText('entities.certs.title')).toBeInTheDocument();
  });
});
