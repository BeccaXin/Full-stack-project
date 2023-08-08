import React from 'react';
import { SmileOutlined } from '@ant-design/icons';
import { Layout, Menu, message, Empty } from 'antd';
import Button from '@mui/material/Button';

import {
  useNavigate,
} from 'react-router-dom';

const PlayQuestion = ({ playerName, playerId, playerToken, playSession, thumbnail }) => {
  const navigate = useNavigate()

  function backtolastpage () {
    window.history.back();
  }

  async function startToPlayGame () {
    const response = await fetch(`http://localhost:5005/play/${playerId}/status`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${playerToken}`,
      },
    });
    const data = await response.json();
    if (data.started === false) {
      message.info('The quiz has not started yet 💗 please wait a moment ')
    } else {
      navigate((`/PlayerQuestion/${playerId}`))
    }
  }

  return (
    <>
    <Layout>
        <Menu
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ display: 'flex', justifyContent: 'flex-start' }}
        >
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button style={{ backgroundColor: '#d9d9d9', color: '#434343', marginRight: '20px' }}
            endIcon={<SmileOutlined />}>Player: {playerName}</Button>
            <Button style={{ backgroundColor: '#d6e4ff', color: '#434343', }} onClick={backtolastpage}>Logout</Button>
        </div>
        </Menu>
    </Layout>
    <div className="home-title">
    <div className="question-card" style={{ textAlign: 'center' }}>
        {thumbnail
          ? (
              thumbnail?.startsWith('https://www.youtube.com/')
                ? (
                    <iframe
                    width="100%"
                    height="auto"
                    src={`https://www.youtube.com/embed/${thumbnail?.split('v=')[1]}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    style={{ height: '500px', width: '500px' }}
                ></iframe>
                  )
                : thumbnail?.startsWith('https')
                  ? (
                    <img
                    alt="thumbnail"
                    src={thumbnail}
                    style={{ height: '500px', width: 'auto' }}
                    />
                    )
                  : (
                    <img
                        alt="thumbnail"
                        src={`data:image/png;base64,${thumbnail}`}
                        style={{ height: 'auto', width: '350px' }}
                    />
                    )
            )
          : (
                <div style={{ marginTop: '200px' }}><Empty description={false} /></div>
            )
        }
        </div>
    <h3 style={{ color: 'black' }}>Hello <b style={{ color: 'pink' }}>{playerName}</b> 😊</h3>
    <h3 style={{ color: 'black' }}>Welcome to Session <b style={{ color: 'pink' }}>{playSession}</b> Game 🎉</h3>
        <Button style={{ backgroundColor: '#d6e4ff' }} onClick={startToPlayGame}> ☝️ Start To Play</Button>
    </div>
    </>
  )
}

export default PlayQuestion;
