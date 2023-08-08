import React from 'react';
import { Button, Input, Form, message } from 'antd';
import './home.css';

import {
  Link,
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

function SignIn ({ onSuccess }) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const navigate = useNavigate()

  async function login () {
    const response = await fetch('http://localhost:5005/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      })
    })
    const data = await response.json()
    if (response.ok) {
      onSuccess(data.token, email);
      message.info('Login successful 🎉')
      navigate('/Dashboard');
    } else {
      message.error('Invalid email or password');
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
            <h1 style={{ color: '#f9f0ff' }}>Welcome to BigBrain Game</h1>
        </div>

            <Form {...layout}>
            <Form.Item label="Email" name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
              {
                type: 'email',
                message: 'Please enter a valid email address!',
              },
            ]}>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '300px' }} />
            </Form.Item>
            <Form.Item label="Password" name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}>
                <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '300px' }} />
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Button style={{ marginLeft: '8px' }} htmlType="submit" onClick={login} >
                Log In
                </Button>
                <a>
            <Link to='/Signup' style={{ marginLeft: '15px', color: 'black' }}>Sign up</Link>
                </a>
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

export default SignIn;
