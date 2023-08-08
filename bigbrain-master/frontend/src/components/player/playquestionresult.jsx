import React from 'react';
import { SmileOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import Button from '@mui/material/Button';
import {
  useNavigate,
} from 'react-router-dom';

const PlayQuestionResult = ({ playerName, playerId, playerToken, playSession, playResults, points }) => {
  const navigate = useNavigate()

  return (

    <>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ width: '500px' }}>
        <Layout>
        <Menu
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ display: 'flex', justifyContent: 'flex-start' }}
        >
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button style={{ backgroundColor: '#d9d9d9', color: '#434343', marginRight: '40px' }}
            endIcon={<SmileOutlined />} onClick={() => { navigate('/PlayJoinpage') }}>Return Login Page</Button>
        </div>
        </Menu>
    </Layout>
    <h1>Your Game Results Form</h1>
    <h3>👼 Player: {playerName}</h3>
    <h4>💎 Your Score : {points}</h4>
    <ul>
    {playResults?.map((answer, index) => (
        <li key={index}>
            ✨ Question {index + 1} started time: {new Date(answer.questionStartedAt).toLocaleString()}<br />
            ✨ Question {index + 1} Answered time: {new Date(answer.answeredAt).toLocaleString()}<br />
            ✨ Question {index + 1} Total time: {(((new Date(answer.answeredAt)) - (new Date(answer.questionStartedAt))) / 1000).toFixed(2)} seconds <br />
            ✨ Correct: {answer.correct ? 'Yes🙆' : 'No🙅'}
        </li>
    ))}
        </ul>
    <p>Game is over, Thanks for your join {playSession} game ❤️</p>
    </div>
    </div>
    </>
  )
}
export default PlayQuestionResult;
