import React, { useEffect, useState } from 'react';
import './App.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { subscribeToTimer } from './socketHandler';

const App = () => {

  const [timestamp, setTimestamp] = useState('No timestamp yet');

  useEffect(() => {
    subscribeToTimer((err, newTimestamp) => {
      setTimestamp(newTimestamp);
    })
  }, []);

  return (
    <div className="app">
      <Navbar />
      <Home />
      <Footer />
      This is the timer value: {timestamp}
    </div>
  );
};

export default App;
