
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchQuizPage from '../../components/searchquiz';

describe('SearchQuizPage component', () => {
  test('renders the component', () => {
    render(
        <MemoryRouter initialEntries={['/Dashboard/Search']}>
        <SearchQuizPage />
        </MemoryRouter>
    );

    const quizIdInput = screen.getByPlaceholderText('Quiz ID');
    const searchButton = screen.getByRole('button', { name: '🔍 Search' });
    const returnButton = screen.getByRole('button', { name: '👼 Return' });

    expect(quizIdInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
    expect(returnButton).toBeInTheDocument();
  });

  test('renders game information after searching', async () => {
    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ name: 'Test Quiz', owner: 'Test Owner', questions: [] }),
    });

    render(
            <MemoryRouter>
            <SearchQuizPage initialEntries={['/Dashboard/Search']}/>
            </MemoryRouter>
    );

    const quizIdInput = screen.getByPlaceholderText('Quiz ID');
    const searchButton = screen.getByRole('button', { name: '🔍 Search' });

    fireEvent.change(quizIdInput, { target: { value: '360848206' } });
    fireEvent.click(searchButton);

    const gameName = screen.getByText('💰 Game Name:');
    const gameOwner = screen.getByText('👸 Game Owner:');
    const numOfQuestions = screen.getByText('🔢 Number of Questions:');
    const totalTimeRequired = screen.getByText('⏰ Total Time Required:');
    const enterButton = screen.getByText('💎 Enter');

    expect(gameName).toBeInTheDocument();
    expect(gameOwner).toBeInTheDocument();
    expect(numOfQuestions).toBeInTheDocument();
    expect(totalTimeRequired).toBeInTheDocument();
    expect(enterButton).toBeInTheDocument();
  });
})
