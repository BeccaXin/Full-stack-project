import React from 'react';
// import Nav from './nav'
import './home.css';
import { Form, Input, Button, message } from 'antd';

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

function SignUp ({ onSuccess }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const navigate = useNavigate()
  async function register () {
    const response = await fetch('http://localhost:5005/admin/auth/register', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
      })
    })
    const data = await response.json()
    if (response.ok) {
      onSuccess(data.token, email);
      message.info('Sign in successful 🎉')
      navigate('/Dashboard');
    } else {
      message.error('Invalid sign up information');
    }
  }

  const handleRegister = () => {
    if (password !== confirmPassword) {
      message.error('The passwords you entered do not match!');
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
        <Form
        {...layout}
        name="register"
        onFinish={handleRegister}
        >
            <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
              {
                type: 'email',
                message: 'Please enter a valid email address!',
              },
            ]}
            >
            <Input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '300px' }} />
            </Form.Item>

            <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            >
            <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '300px' }} />
            </Form.Item>

            <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator (_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The passwords you entered do not match!'));
                },
              }),
            ]}
            >
            <Input.Password value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: '300px' }} />
            </Form.Item>

            <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your name!',
              },
            ]}
            >
            <Input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '300px' }} />
            </Form.Item>

            <Form.Item {...tailLayout}>
            <Button htmlType="submit" onClick={register}>
                Sign Up
            </Button>
            <a>
            <Link to='/Signin' style={{ marginLeft: '15px', color: 'black' }}>Log In</Link>
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

export default SignUp;
