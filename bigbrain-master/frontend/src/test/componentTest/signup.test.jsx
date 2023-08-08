import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignUp from '../../components/signup';

describe('User SignUp test', () => {
  test('renders the component', () => {
    render(
        <MemoryRouter initialEntries={['/Signup']}>
            <SignUp />
        </MemoryRouter>
    );

    const emailComponent = screen.getByLabelText('Email');
    const passwordComponent = screen.getByLabelText('Password');
    const passwordcomfirmComponent = screen.getByLabelText('Confirm Password');
    const NameComponent = screen.getByLabelText('Name');

    expect(emailComponent).toBeInTheDocument();
    expect(passwordComponent).toBeInTheDocument();
    expect(passwordcomfirmComponent).toBeInTheDocument();
    expect(NameComponent).toBeInTheDocument();

    const buttonComponent = screen.getByText('Sign Up');
    expect(buttonComponent).toBeInTheDocument();
  });
});
