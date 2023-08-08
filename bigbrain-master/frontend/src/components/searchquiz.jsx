import React from 'react';
import { Input, Button, Card, message } from 'antd';

import {
  useNavigate,
} from 'react-router-dom';
function SearchQuizPage ({ token }) {
  const navigate = useNavigate();
  const [searchQuizId, setSearchQuizId] = React.useState('')
  const [quizSearchInformation, setQuizSearchInformation] = React.useState({})

  async function showGameInformation () {
    const quizid = searchQuizId
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizid}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (response.ok) {
      const data = await response.json();
      setQuizSearchInformation(data)
    } else {
      message.error('Input valid quiz id')
    }
  }

  function backtolastpage () {
    navigate('/Dashboard')
  }

  return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ width: '400px' }}>
                <h1 style={{ textAlign: 'center' }}>🔍 Search Game</h1>
                <hr /><br />
                <Input placeholder="Quiz ID" value={searchQuizId} onChange={(e) => setSearchQuizId(e.target.value)}></Input><br /><br />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button type="primary" onClick={showGameInformation}> 🔍 Search </Button>
                    <Button style={{ marginLeft: '10px' }} onClick={backtolastpage}> 👼 Return </Button>
                </div>
                <br />
                <Card title="Game Information" style={{ marginTop: 16 }}>
                    <p><b>💰 Game Name:</b> {quizSearchInformation.name}</p>
                    <p><b>👸 Game Owner:</b> {quizSearchInformation.owner}</p>
                    <p><b>🔢 Number of Questions:</b> {quizSearchInformation?.questions?.length}</p>
                    <p>
                    <b>⏰ Total Time Required: </b>
                        {(
                          (quizSearchInformation?.questions?.filter((q) => q.type === 'single').length * 30 +
                            quizSearchInformation?.questions?.filter((q) => q.type === 'multiple').length * 60) /
                            60
                        ).toFixed(2)}{' '}
                        minutes
                        </p>
                        <Button type="primary" onClick={() => { navigate(`/Dashboard/QuizDetails/${searchQuizId}`) }}>💎 Enter </Button>
                </Card>

            </div>
        </div>
  );
}

export default SearchQuizPage;
