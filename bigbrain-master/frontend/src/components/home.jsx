import React from 'react';
import Nav from './nav'
import './home.css';

const Home = () => {
  return (<>
    <div className="home-container">
    <div className="home-title">
        <h1>Welcome to BigBrain Game</h1>
    </div>
    <Nav />
    </div>
    </>)
}

export default Home;
