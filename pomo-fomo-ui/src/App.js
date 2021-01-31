import React, { useState } from 'react';
import './App.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import background from './enchanting_room.svg';

const App = () => {
  return (
    <div className="app" style={{ backgroundImage: `url(${background})` }}>
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
};

export default App;
