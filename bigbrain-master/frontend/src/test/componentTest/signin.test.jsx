import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignIn from '../../components/signin';

describe('User signin test', () => {
  test('renders the component', () => {
    render(
      <MemoryRouter initialEntries={['/Signin']}>
        <SignIn />
      </MemoryRouter>
    );

    const emailComponent = screen.getByLabelText('Email');
    const passwordComponent = screen.getByLabelText('Password');
    const buttonComponent = screen.getByText('Log In');

    expect(emailComponent).toBeInTheDocument();
    expect(passwordComponent).toBeInTheDocument();

    expect(buttonComponent).toBeInTheDocument();
  });
});
