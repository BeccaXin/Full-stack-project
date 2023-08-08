/* eslint-disable array-callback-return */
import React from 'react';
import { SmileOutlined } from '@ant-design/icons';
import { Empty, Layout, Menu, Table } from 'antd';
import Button from '@mui/material/Button';

import {
  useNavigate,
} from 'react-router-dom';

function SessionResult ({ token, results }) {
  // Check if results is empty
  const navigate = useNavigate()
  const [statusResults, setStatusResults] = React.useState({})

  if (!results || Object.keys(results).length === 0) {
    return <Empty description="No results available" />;
  }

  async function resultForPlayer () {
    const url = window.location.href;
    const parts = url.split('/');
    const sessionId = parts[parts.length - 2];

    const response = await fetch(`http://localhost:5005/admin/session/${sessionId}/status`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const statusData = await response.json();
    setStatusResults(statusData.results)
  }

  React.useEffect(async () => {
    await resultForPlayer();
  }, [results])

  const resultComponents = [];
  Object.values(results).forEach((resultArray) => {
    resultComponents.push(...resultArray.map((result, index) => {
      const { questions, players } = statusResults;
      if (questions && Object.keys(questions).length > 0 && players && Object.keys(players).length > 0) {
        let points = 0
        if (result) {
          result?.answers?.forEach((answer, index) => {
            const questiontype = Object.values(questions)[index].type
            if (answer.correct === true && questiontype === 'single') {
              points += 1;
            } else if (answer.correct === true && questiontype === 'multiple') {
              points += 2;
            } else if (answer.correct === true && questiontype === 'short') {
              points += 3;
            }
          })
        }
        return (
                <div key={index}>
                    <h3>👼 Player: {result?.name} </h3>
                    <h4>💎 Points: {points}</h4>
                    <ul>
                        {result?.answers?.map((answer, index) => (
                        <li key={index}>
                            ✨ Question {index + 1} started time: {new Date(answer.questionStartedAt).toLocaleString()}<br />
                            ✨ Question {index + 1} Answered time: {new Date(answer.answeredAt).toLocaleString()}<br />
                            ✨ Question {index + 1} Total time: {(((new Date(answer.answeredAt)) - (new Date(answer.questionStartedAt))) / 1000).toFixed(2)} seconds <br />
                            ✨ Correct: {answer.correct ? 'Yes🙆' : 'No🙅'}
                        </li>
                        ))}
                    </ul>
                </div>
        );
      }
    }))
  });

  const columns = [
    {
      title: 'Player',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
    },
    {
      title: 'Total Time',
      dataIndex: 'times',
      key: 'times',
    }
  ];

  const data = Object.entries(results).map(([key, resultArray]) =>
    resultArray.map((result, index) => {
      const { questions, players } = statusResults;
      let points = 0;
      let times = 0; // define times outside the map function
      if (questions && Object.keys(questions).length > 0 && players && Object.keys(players).length > 0) {
        if (result) {
          result?.answers?.forEach((answer, index) => {
            const questiontype = Object.values(questions)[index].type;
            if (answer.correct === true && questiontype === 'single') {
              points += 1;
            } else if (answer.correct === true && questiontype === 'multiple') {
              points += 2;
            } else if (answer.correct === true && questiontype === 'short') {
              points += 3;
            }
          });
        }
      }
      result?.answers?.forEach((answer, index) => {
        const time = (((new Date(answer.answeredAt)) - (new Date(answer.questionStartedAt))) / 1000);
        times += time;
      });

      return {
        key: `${index}`,
        name: result?.name,
        points,
        times: `${times.toFixed(2)} sec`,
      }
    })
  ).flat().sort((a, b) => b.points - a.points).slice(0, 5);

  return (
    <div>
        <Layout>
        <Menu
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ display: 'flex', justifyContent: 'flex-start' }}
        >
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button style={{ backgroundColor: '#d9d9d9', color: '#434343', marginRight: '40px' }}
            endIcon={<SmileOutlined />} onClick={() => { navigate('/Dashboard') }}>Return Game List</Button>
        </div>
        </Menu>
    </Layout>
        <h1>Session Results Form</h1>
        <Table dataSource={data} columns={columns} />
        {resultComponents}
    </div>
  );
}

export default SessionResult;
