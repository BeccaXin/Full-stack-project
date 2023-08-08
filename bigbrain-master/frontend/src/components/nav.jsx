import React from 'react';
// import Button from '@mui/material/Button';
import { Button } from 'antd';

import {
  Link,
} from 'react-router-dom';

const Nav = () => {
  return (
        <>
    <div className="button-container">
        <Button size="large">
        <Link to='/Signup'>Sign Up</Link>
        </Button>

        <Button size="large" style={{ marginLeft: '8px' }}>
        <Link to='/Signin'>Log In</Link>
        </Button>

        <Button size="large" style={{ marginLeft: '8px' }}>
        <Link to='/PlayJoinpage'>Player Join</Link>
        </Button>

    </div>
        </>
  )
}

export default Nav;
