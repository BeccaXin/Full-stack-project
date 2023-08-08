import React from 'react';
// import Nav from './nav'
import { Button, Input, Form, message } from 'antd';
import './home.css';

import {
  useNavigate,
} from 'react-router-dom';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const PlaySignIn = ({ onSuccess }) => {
  const [playerName, setPlayName] = React.useState('')
  const [playSession, setPlaySession] = React.useState('')
  const navigate = useNavigate()

  async function playEnterGame () {
    const response = await fetch(`http://localhost:5005/play/join/${playSession}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        session: playSession,
        name: playerName,
      })
    })

    const data = await response.json()
    if (response.ok) {
      onSuccess(data.playerId, playerName, data.token, playSession);
      navigate('/PlayerQuestion');
    } else {
      message.error('Invalid sesssionId');
    }
  }

  function backtoLastpage () {
    window.history.back();
  }

  return (
        <>
        <div className="home-container">
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ width: 500, backgroundColor: 'rgba(249, 240, 255, 0.5)' }} className='home-content'>
        <div className="home-title">
            <h1 style={{ color: '#f9f0ff' }}>Hello Player :）</h1>
            <h1>Welcome to BigBrain Game</h1>
        </div>

            <Form {...layout}>
            <Form.Item label="Name" name="name">
            <Input placeholder="Setting your player name" onChange={(e) => setPlayName(e.target.value)} style={{ width: '300px' }} />
            </Form.Item>
            <Form.Item label="Session ID" name="SeesionID">
            <Input placeholder="Input valid Session Id" onChange={(e) => setPlaySession(e.target.value)} style={{ width: '300px' }} />
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Button style={{ marginLeft: '8px' }} htmlType="submit" onClick={playEnterGame} >
                Enter Game
                </Button>
                <a style={{ marginLeft: '65px', color: 'black', fontSize: '10px' }} onClick={backtoLastpage}>
                Return
                </a>
            </Form.Item>
            </Form>
        </div>
        </div>
        </div>
        </>
  )
}

export default PlaySignIn;
