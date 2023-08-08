import React from 'react';
import Button from '@mui/material/Button';
import { SmileOutlined, SendOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

const NavDash = ({ token, email }) => {
  const navigate = useNavigate()

  function Logout () {
    fetch('http://localhost:5005/admin/auth/logout', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({})
    })
      .then(response => response.json())
      .then(data => {
      })
    localStorage.removeItem('token')
    navigate('/Signin')
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
            <Button style={{ backgroundColor: '#d9d9d9', color: '#434343', marginRight: '40px' }}
            endIcon={<SmileOutlined />} onClick={Logout}>Log Out ({email})</Button>
            <Button style={{ backgroundColor: '#d6e4ff', color: '#fff', marginRight: '10px' }}
            endIcon={<SendOutlined />} ><Link to='/Dashboard/Search' style={{ color: '#434343' }}>Search Game</Link></Button>
        </div>
        </Menu>
    </Layout>
    </>
  )
}

export default NavDash;
