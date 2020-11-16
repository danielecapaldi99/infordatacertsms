import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, wait } from '@testing-library/react';
import 'i18n/__mocks__/i18nMock';
import certsMock from 'components/__mocks__/certsMocks';
import CertsForm from 'components/CertsForm';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme();

describe('Certs Form', () => {
  it('shows form', () => {
    const { getByLabelText } = render(
      <ThemeProvider theme={theme}>
        <CertsForm certs={certsMock} />
      </ThemeProvider>
    );
    expect(getByLabelText('entities.certs.title').value).toBe(
      'Et pariatur aliquid a quidem asperiores. Labore necessitatibus dolorum odio quasi ex est neque ipsum quisquam. Recusandae excepturi eos qui. Quam qui id molestias et ut molestiae. Modi est reiciendis doloribus et est.'
    );
  });

  it('submits form', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <CertsForm certs={certsMock} onSubmit={handleSubmit} />
      </ThemeProvider>
    );

    const form = getByTestId('certs-form');
    fireEvent.submit(form);

    await wait(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
