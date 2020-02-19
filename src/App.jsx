import React from 'react';
import './App.css';
import PathfindingVisualizer from './Components/PathfindingVisualizer';
import NavBar from './Components/NavBar';
import { render } from 'react-dom';

const App = function() {
  return (
    <div className='App'>
      <NavBar></NavBar>
      <PathfindingVisualizer></PathfindingVisualizer>
    </div>
  );
};

export default App;
