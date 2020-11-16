import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import 'components/__mocks__/i18n';
import certsMocks from 'components/__mocks__/certsMocks';
import CertsTable from 'components/CertsTable';

describe('CertsTable', () => {
  it('shows certs', () => {
    const { getByText } = render(<CertsTable items={certsMocks} />);
    expect(
      getByText(
        'Et pariatur aliquid a quidem asperiores. Labore necessitatibus dolorum odio quasi ex est neque ipsum quisquam. Recusandae excepturi eos qui. Quam qui id molestias et ut molestiae. Modi est reiciendis doloribus et est.'
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        'Dolore consequuntur magni maiores. Doloremque aut molestias in similique. Ratione qui quia assumenda in sint assumenda. Ut distinctio omnis in. Omnis et consectetur corporis voluptatem distinctio laudantium eaque non.'
      )
    ).toBeInTheDocument();
  });

  it('shows no certs message', () => {
    const { queryByText } = render(<CertsTable items={[]} />);
    expect(
      queryByText(
        'Et pariatur aliquid a quidem asperiores. Labore necessitatibus dolorum odio quasi ex est neque ipsum quisquam. Recusandae excepturi eos qui. Quam qui id molestias et ut molestiae. Modi est reiciendis doloribus et est.'
      )
    ).not.toBeInTheDocument();
    expect(
      queryByText(
        'Dolore consequuntur magni maiores. Doloremque aut molestias in similique. Ratione qui quia assumenda in sint assumenda. Ut distinctio omnis in. Omnis et consectetur corporis voluptatem distinctio laudantium eaque non.'
      )
    ).not.toBeInTheDocument();

    expect(queryByText('entities.certs.noItems')).toBeInTheDocument();
  });

  it('calls onSelect when the user clicks a table row', () => {
    const onSelectMock = jest.fn();
    const { getByText } = render(<CertsTable items={certsMocks} onSelect={onSelectMock} />);
    fireEvent.click(
      getByText(
        'Et pariatur aliquid a quidem asperiores. Labore necessitatibus dolorum odio quasi ex est neque ipsum quisquam. Recusandae excepturi eos qui. Quam qui id molestias et ut molestiae. Modi est reiciendis doloribus et est.'
      )
    );
    expect(onSelectMock).toHaveBeenCalledTimes(1);
  });
});
