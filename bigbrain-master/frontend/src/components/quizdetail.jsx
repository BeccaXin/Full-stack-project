import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, message } from 'antd';
import { CardContent, Box } from '@material-ui/core';
import NavDash from './navdash';
import './home.css';
import BlankPage from './blankpage'

function QuizDetails ({ token, email, onSuccesspic, Results }) {
  const { quizId } = useParams();

  const navigate = useNavigate()
  const [quizzess, setQuizzess] = React.useState([]);
  const [selectedQuiz, setSelectedQuiz] = React.useState();
  const [remainingTime, setRemainingTime] = React.useState(null);
  const [sessionActiveId, setSessionActiveId] = React.useState(null);

  function backtoLastpage () {
    window.history.back();
  }

  function backtoLastwindowpage () {
    setSelectedQuiz();
  }

  function EnterGamePage () {
    setSelectedQuiz('Enter');
  }

  React.useEffect(async () => {
    message.info('You can start the game click button start game 😊')
    const quizid = quizId
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizid}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json();
    setQuizzess(data)
    setSessionActiveId(data.active)
    onSuccesspic(data.thumbnail)
  }, []);

  // http://localhost:3000/Dashboard/QuizDetails/QuizAnswer/601736

  async function startToPlayGame () {
    if (window.confirm('Do you want to start game new?')) {
      const quizid = quizId;
      const response = await fetch(`http://localhost:5005/admin/quiz/${quizid}/start`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      if (response.ok) {
        const response = await fetch(`http://localhost:5005/admin/quiz/${quizid}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json();
        setSessionActiveId(data.active)
        navigate(`/Dashboard/QuizDetails/${quizId}/${data.active}`)
      }
    }
  }

  // change question in page

  async function advanceToPlayGame () {
    if (window.confirm('Do you want to enter question?')) {
      const quizid = quizId;
      const response = await fetch(`http://localhost:5005/admin/quiz/${quizid}/advance`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      const data = await response.json()
      if (response.ok) {
        setRemainingTime(30)

        // set timer for question answer
        const timer = setInterval(() => {
          setRemainingTime((prevRemainingTime) => {
            if (prevRemainingTime <= 1) {
              clearInterval(timer);
            }
            return prevRemainingTime - 1;
          });
        }, 1000);
      } else {
        message.error(data.error)
      }
    }
  }

  if (remainingTime === 3) {
    message.info('Time is up! Enter next questions for player.');
  }

  // submit answer to check

  async function submitEndGame () {
    if (window.confirm(`Do you want to end of Id: ${sessionActiveId} game?`)) {
      const quizid = quizId;
      await fetch(`http://localhost:5005/admin/quiz/${quizid}/end`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
    }
  }

  // check result
  async function checkSessionSResults () {
    const response = await fetch(`http://localhost:5005/admin/session/${sessionActiveId}/results`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json();
    if (response.ok) {
      Results(data)
      navigate(`/Dashboard/QuizDetails/${quizId}/${sessionActiveId}/result`)
    } else {
      (
        message.error(data.error)
      )
    }
  }

  if (selectedQuiz) {
    return (
            <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '600px' }}>
            <div>
                <p><b>Session ID: {sessionActiveId}</b></p>
                <p>⏰ Remaining Time: {remainingTime} seconds</p>
                <Button style={{ backgroundColor: '#d6e4ff', color: '#434343' }} onClick={startToPlayGame}> Start Game </Button>
                <Button variant="outlined" onClick={submitEndGame} style={{ marginLeft: '5px' }}>
                End Game
                </Button>
                <Button variant="outlined" onClick={checkSessionSResults} style={{ marginLeft: '5px' }}>
                Check result
                </Button>
                {quizzess?.questions?.map((question, index) => (
                <Card key={index}>
                    <CardContent>
                    <h3>{question.question}</h3>
                    {question?.answers?.map((answer, answerIndex) => (
                        <div key={answerIndex}>
                            {question.type === 'short'
                              ? <Box style={{ color: 'pink' }}>{answer}</Box>
                              : question.type === 'multiple' && question.correctAnswer.includes(answerIndex.toString())
                                ? <b style={{ color: 'pink' }}><strong>{answer}</strong></b>
                                : question.type === 'single' && answerIndex.toString() === question.correctAnswer
                                  ? <b style={{ color: 'pink' }}><strong>{answer}</strong></b>
                                  : <p>{answer}</p>
                        }
                        </div>
                    ))}
                    </CardContent>
                    <Button style={{ backgroundColor: '#d6e4ff', color: '#434343' }} onClick={advanceToPlayGame}> Show Question For Player</Button>
                </Card>
                ))}
                <Button variant="outlined" onClick={backtoLastwindowpage} style={{ marginTop: '5px' }}>
                👼 Return
                </Button>
                <p>You can check the result after click end game 😊</p>
            </div>
            </div>
            </div>
            </>
    );
  }

  return (
        <>
        <NavDash email={email} />
        <div className="question-card" style={{ textAlign: 'center' }}>
        {quizzess?.thumbnail
          ? (
              quizzess?.thumbnail.startsWith('https://www.youtube.com/')
                ? (
                    <iframe
                    width="100%"
                    height="auto"
                    src={`https://www.youtube.com/embed/${quizzess?.thumbnail.split('v=')[1]}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    style={{ height: '500px', width: '500px' }}
                ></iframe>
                  )
                : quizzess?.thumbnail.startsWith('https')
                  ? (
                    <img
                    alt="thumbnail"
                    src={quizzess?.thumbnail}
                    style={{ height: '500px', width: 'auto' }}
                    />
                    )
                  : (
                    <img
                        alt="thumbnail"
                        src={`data:image/png;base64,${quizzess?.thumbnail}`}
                        style={{ height: 'auto', width: '350px' }}
                    />
                    )
            )
          : (
                <div style={{ marginTop: '200px' }}><BlankPage /></div>
            )
        }
            <h3>SessionID: <b>{sessionActiveId}</b></h3>
            <p>Name: {quizzess?.name}</p>
            <p>Number of Questions: {quizzess?.questions?.length}</p>
            <p>
            ⏰ Total Time Required:{' '}
            {(
              (quizzess?.questions?.filter((q) => q.type === 'single').length * 30 +
                quizzess?.questions?.filter((q) => q.type === 'multiple').length * 60) /
                60
            ).toFixed(2)}{' '}
            minutes
            </p>
            <Button type="primary" variant="outlined" onClick={EnterGamePage}>
            Start Quiz
            </Button>
            <Button onClick={backtoLastpage} style={{ marginLeft: '5px' }}>
            {' '}
            👼 Return{' '}
            </Button>
        </div>
        </>
  )
}

export default QuizDetails;
