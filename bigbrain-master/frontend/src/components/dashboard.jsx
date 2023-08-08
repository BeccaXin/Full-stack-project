/* eslint-disable react/jsx-key */
import React from 'react';
import Button from '@mui/material/Button';
import { Card, Col, Row, Input, message } from 'antd';
import NavDash from './navdash'
import BlankPage from './blankpage'
import Blankpaper from './blankpaper.png';
import { DeleteOutlined, FormOutlined } from '@ant-design/icons';
import './home.css';

import {
  useNavigate,
} from 'react-router-dom';

const GameListTitle = () => {
  return <>
        <div className="home-title">
        <h1 style={{ color: '#597ef7' }}>👼 Game List 👼</h1>
    </div>
    </>
}

function Dashboard ({ token, email }) {
  const navigate = useNavigate()
  const [newGameShow, setNewGameShow] = React.useState(false)
  const [quizzes, setQuizzes] = React.useState([])

  const [newQuizName, setNewQuizName] = React.useState('')

  localStorage.setItem('token', token)

  async function DeleteQuiz (id) {
    if (window.confirm(`Do you want to delete game:${id}?`)) {
      await fetch(`http://localhost:5005/admin/quiz/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setQuizzes((prevQuizzes) =>
        prevQuizzes.filter((quiz) => quiz.id !== id)
      );
    }
  }

  async function fetchAllQuizzes () {
    const response = await fetch('http://localhost:5005/admin/quiz', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json();
    setQuizzes(data.quizzes)
  }

  React.useEffect(async () => {
    await fetchAllQuizzes();
  }, [newGameShow])

  async function createNewGame () {
    if (newQuizName === '') {
      message.info('Please submit valid name.')
    } else {
      await fetch('http://localhost:5005/admin/quiz/new', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newQuizName,
        })
      })
      setNewGameShow(false)
    }
  }

  return <>
        <NavDash email={email} />
        <GameListTitle />
        <div className="home-title">
        <Button style={{ backgroundColor: '#d6e4ff', color: '#434343' }} onClick={() => setNewGameShow(!newGameShow)}>
            {newGameShow ? '👋' : '😊'} Create New Game
        </Button>
        {newGameShow && (
            <>
            <br />
            <b style={{ color: '#597ef7' }}>💗 Game Name: </b>
            <Input size="large" placeholder="Input Quiz Name" value={newQuizName} style={{ width: 300 }} onChange={(e) => setNewQuizName(e.target.value)}></Input>
            <Button style={{ margin: 10, color: '#391085', backgroundColor: '#d6e4ff' }}
            onClick={createNewGame}>☝️ Create
            </Button>
            </>
        )}
        </div>

        {quizzes.length === 0
          ? (
            <div style={{ marginTop: '200px' }}><BlankPage /></div>
            )
          : (
            <>
            <div style={{ padding: '10px' }}>
            <Row gutter={[16, 16]}>
                {quizzes.map((quiz) => (
                <Col span={6}>
                <Card
            onClick={() => {
              navigate(`/Dashboard/QuizDetails/${quiz.id}`);
            }}
            hoverable
            cover={
                quiz.thumbnail
                  ? (
                      quiz.thumbnail.startsWith('https://www.youtube.com/')
                        ? (
                        <iframe
                        width="100%"
                        height="auto"
                        src={`https://www.youtube.com/embed/${quiz.thumbnail.split('v=')[1]}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                        style={{ height: 'auto', width: '100%' }}
                        ></iframe>
                          )
                        : quiz.thumbnail.startsWith('https')
                          ? (
                        <img
                        alt="thumbnail"
                        src={quiz.thumbnail}
                        style={{ height: 'auto', width: '100%' }}
                        />
                            )
                          : (
                    <img
                        alt="thumbnail"
                        src={`data:image/png;base64,${quiz.thumbnail}`}
                        style={{ height: 'auto', width: '100%' }}
                        />
                            )
                    )
                  : (
                    <img
                        alt="thumbnail"
                        src={Blankpaper}
                        style={{ height: 'auto', width: '100%' }}
                        />
                    )
                }
                >
                    <Card.Meta title={`Name: ${quiz.name}`} />
                    <Card.Meta title={`Game ID: ${quiz.id}`} />
                    </Card>
                    <Button onClick={() => DeleteQuiz(quiz.id)} endIcon={<DeleteOutlined />}>Delete</Button>
                    <Button onClick={() => navigate(`/Dashboard/Update/${quiz.id}`)} endIcon={<FormOutlined />}>Edit</Button>
                </Col>
                ))}
            </Row>
            </div>
            </>
            )}
    </>;
}

export default Dashboard;
