import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PlaySignIn from '../../components/playersignin';

describe('Player signin test', () => {
  test('renders the component', () => {
    render(
        <MemoryRouter initialEntries={['/PlayJoinpage']}>
        <PlaySignIn />
        </MemoryRouter>
    );

    const PlayerNameComponent = screen.getByLabelText('Name');
    const SessionIDComponent = screen.getByLabelText('Session ID');

    expect(PlayerNameComponent).toBeInTheDocument();
    expect(SessionIDComponent).toBeInTheDocument();

    const buttonComponent = screen.getByText('Enter Game');
    expect(buttonComponent).toBeInTheDocument();
  });
});
