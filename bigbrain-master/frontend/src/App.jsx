import React from 'react';
import SignUp from './components/signup';
import SignIn from './components/signin';
import Dashboard from './components/dashboard';
import Home from './components/home';
import UpdateQuiz from './components/updatequiz';
import SearchQuizPage from './components/searchquiz';
import QuizDetails from './components/quizdetail';
import PlaySignIn from './components/playersignin';
import PlayQuestion from './components/player/playerquestion';
import PlayerQuestionShow from './components/player/playerquestionshow';
import SessionResult from './components/seesionresult';
import PlayQuestionResult from './components/player/playquestionresult';

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

function App () {
  const [token, setToken] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [playerId, setPlayerId] = React.useState('');
  const [playerName, setPlayerName] = React.useState('');
  const [playerToken, setPlayerToken] = React.useState(null);
  const [playSession, setPlaySession] = React.useState(null);
  const [playSessionthumbnail, setPlaySessionthumbnail] = React.useState(null);
  const [results, setResults] = React.useState(null)
  const [playResults, setPlayResults] = React.useState(null)
  const [points, setPoints] = React.useState(null)

  function manageResults (results) {
    setResults(results)
  }

  function managePlayerResults (playResults) {
    setPlayResults(playResults)
  }

  function managePlayerpoints (points) {
    setPoints(points)
  }

  function managethumbnail (playSessionthumbnail) {
    setPlaySessionthumbnail(playSessionthumbnail);
    localStorage.setItem('playSessionthumbnail', playSessionthumbnail);
  }

  function managePlayerId (playerId, playerName, playerToken, playSession) {
    setPlayerId(playerId)
    setPlayerName(playerName)
    setPlayerToken(playerToken)
    setPlaySession(playSession)
  }

  function manageTokenSet (token, email) {
    setToken(token);
    setEmail(email);
    localStorage.setItem('token', token)
  }

  React.useEffect(function () {
    if (localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
    }
    const storedPlaySessionthumbnail = localStorage.getItem('playSessionthumbnail');
    if (storedPlaySessionthumbnail) {
      setPlaySessionthumbnail(storedPlaySessionthumbnail);
    }
  }, [])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Signin' element={<SignIn onSuccess={manageTokenSet}/>} />
          <Route path='/Signup' element={<SignUp onSuccess={manageTokenSet}/>} />
          <Route path='/Dashboard' element={<Dashboard token={token} email={email} />} />
          <Route path='/Dashboard/Update/:quizId' element={<UpdateQuiz token={token} />} />
          <Route path='/Dashboard/Search' element={<SearchQuizPage token={token}/>} />
          <Route path="/Dashboard/QuizDetails/:quizId" element={<QuizDetails token={token} email={email} onSuccesspic={managethumbnail} />} />
          <Route path="/Dashboard/QuizDetails/:quizId/:sessionActiveId" element={<QuizDetails token={token} email={email} onSuccesspic={managethumbnail} Results={manageResults}/>} />
          <Route path="/Dashboard/QuizDetails/:quizId/:sessionActiveId/result" element={<SessionResult token={token} results={results} />} />
          <Route path="/PlayJoinpage" element={<PlaySignIn onSuccess={managePlayerId}/>} />
          <Route path="/PlayerQuestion" element={<PlayQuestion playerName={playerName} playerId={playerId} token={playerToken} playSession={playSession} thumbnail={playSessionthumbnail || localStorage.getItem('playSessionthumbnail')} />}/>
          <Route path="/PlayerQuestion/:playerId" element={<PlayerQuestionShow playerName={playerName} playerId={playerId} token={playerToken} playSession={playSession} playResults={managePlayerResults} points={managePlayerpoints}/>} />
          <Route path="/PlayerQuestion/:playerId/result" element={<PlayQuestionResult playerName={playerName} playerId={playerId} token={playerToken} playSession={playSession} playResults={playResults} points={points}/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
