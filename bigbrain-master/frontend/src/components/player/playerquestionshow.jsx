import React from 'react';
import { SmileOutlined } from '@ant-design/icons';
import { Radio, Checkbox, Card, Button, message, Layout, Menu } from 'antd';
import { FormControlLabel, CardContent, TextField } from '@material-ui/core';

import {
  useNavigate,
} from 'react-router-dom';

const PlayerQuestionShow = ({ playerName, playerId, playerToken, playSession, playResults, points }) => {
  const navigate = useNavigate()
  const [score, setScore] = React.useState(null);
  const [remainingTime, setRemainingTime] = React.useState(null);
  const [quizzess, setQuizzess] = React.useState([]);
  const [userAnswer, setUserAnswer] = React.useState()
  const [userShortAnswer, setUserShortAnswer] = React.useState()
  const [righranswerforquestion, setRighranswerforquestion] = React.useState()

  function backtolastpage () {
    window.history.back();
  }

  async function startToGetQuiz () {
    const response = await fetch(`http://localhost:5005/play/${playerId}/question`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${playerToken}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      setQuizzess(data.question)
      setRighranswerforquestion(data.question.correctAnswer)

      setRemainingTime(30);

      const timer = setInterval(() => {
        setRemainingTime((prevRemainingTime) => {
          if (prevRemainingTime <= 1) {
            clearInterval(timer);
          }
          return prevRemainingTime - 1;
        });
      }, 1000);
    } else { message.info(data.error) }
  }

  if (remainingTime === 0) {
    message.info('Time is up! please answer question, Enter next question.');
    if (!userAnswer && !userShortAnswer) {
      finishthisQuestion();
    } else if (userAnswer && userShortAnswer) {
      putUseranswer()
    }
  }

  async function finishthisQuestion () {
    const response = await fetch(`http://localhost:5005/play/${playerId}/answer`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${playerToken}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      if (quizzess.type === 'short') {
        message.info(`Right answer is ${righranswerforquestion}`)
      } else {
        message.info(`Right answer is ${righranswerforquestion} position`)
      }
    } else {
      message.error(data.error)
    }
  }

  async function putUseranswer () {
    let points = 0;
    let userAnswerIds = [];

    if (quizzess.type === 'single') {
      if (userAnswer === parseInt(quizzess.correctAnswer)) {
        points = 1;
        userAnswerIds = [123];
      } else {
        userAnswerIds = [0];
      }
    } else if (quizzess.type === 'multiple') {
      const userAnswerStrings = userAnswer.map((index) => index.toString());
      if (userAnswerStrings && userAnswerStrings.length === quizzess.correctAnswer.length && userAnswerStrings.every((index) => quizzess.correctAnswer.includes(index))) {
        points = 2;
        userAnswerIds = [123];
      } else {
        userAnswerIds = [0];
      }
    } else if (quizzess.type === 'short') {
      if (userShortAnswer === quizzess.correctAnswer) {
        points = 3;
        userAnswerIds = [123];
      } else {
        userAnswerIds = [0];
      }
    }

    const response = await fetch(`http://localhost:5005/play/${playerId}/answer`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${playerToken}`,
      },
      body: JSON.stringify({
        answerIds: userAnswerIds,
        points
      })
    });
    const data = await response.json();
    if (response.ok) {
      message.info('You answer submit successful 🎉')
      setScore(prevScore => prevScore + points);
    } else { message.error(data.error) }
  }

  async function EndGameCheckPoint () {
    const response = await fetch(`http://localhost:5005/play/${playerId}/results`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${playerToken}`,
      },
    });
    const data = await response.json();
    playResults(data)
    points(score)
    if (response.ok) {
      navigate(`/PlayerQuestion/${playerId}/result`)
      if (score > 3) {
        message.info(`Your score is ${score}, Congratulations 🎉 !`)
      } else {
        message.info(`Your score is ${score}, keep it up 😊!`)
      }
    } else {
      message.error(data.error)
    }
  }

  return (
    <>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ width: '600px' }}>
    <div>
    <Layout>
        <Menu
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ display: 'flex', justifyContent: 'flex-start' }}
        >
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button style={{ backgroundColor: '#d9d9d9', color: '#434343', marginRight: '40px' }} onClick={backtolastpage}> <SmileOutlined /> Player: {playerName} </Button>
            <Button style={{ backgroundColor: '#d6e4ff', color: '#434343', marginRight: '40px' }}>Session ID: {playSession}</Button>
            <Button style={{ backgroundColor: '#d6e4ff', color: '#434343', marginRight: '10px' }}>💎 Your Point: {score}</Button>
        </div>
        </Menu>
    </Layout>
            <div style={{ marginTop: '5px' }}><b>⏰ Remaining Time: {remainingTime} seconds</b></div>
                <Card>
                <CardContent>
                <h3>{quizzess.question}</h3>
                {
                quizzess?.type === 'short'
                  ? (
                    <TextField
                        label="Answer"
                        value={userShortAnswer}
                        onChange={(e) => setUserShortAnswer(e.target.value)}
                    />
                    )
                  : quizzess?.answers?.map((answer, answerIndex) => (
                    <FormControlLabel
                    key={answerIndex}
                    control={
                        quizzess?.type === 'single'
                          ? (
                        <Radio
                            checked={userAnswer === answerIndex}
                            value={answerIndex}
                            onChange={() => setUserAnswer(answerIndex)}
                        />
                            )
                          : (
                    <Checkbox
                            checked={
                                Array.isArray(userAnswer) && userAnswer.includes(answerIndex)
                            }
                            onChange={() => {
                              const newAnswerIds = Array.isArray(userAnswer)
                                ? [...userAnswer]
                                : [];
                              if (newAnswerIds.includes(answerIndex)) {
                                newAnswerIds.splice(newAnswerIds.indexOf(answerIndex), 1);
                              } else {
                                newAnswerIds.push(answerIndex);
                              }
                              setUserAnswer(newAnswerIds);
                            }}
                            value={answerIndex}
                        />
                            )
                    }
                    label={answer}
                    />
                  ))}
                </CardContent>
                <Button style={{ backgroundColor: '#d6e4ff', color: '#597ef7' }} onClick={putUseranswer}>
                Put Answer
                </Button>
                </Card>
                <Button style={{ backgroundColor: '#d6e4ff', color: '#597ef7', marginTop: '5px', marginRight: '20px' }} onClick={startToGetQuiz}>
                Get Question
                </Button>
                <Button style={{ marginTop: '5px' }} variant="outlined" onClick={EndGameCheckPoint}>
                End Game
                </Button>
            </div>
        </div>
        </div>
    </>
  )
}

export default PlayerQuestionShow;
