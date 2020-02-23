import React from 'react';
import './App.css';
import PathfindingVisualizer from './components/PathfindingVisualizer';
// import bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';
const App = function() {
  return (
    <div className='App'>
      <PathfindingVisualizer></PathfindingVisualizer>
    </div>
  );
};

export default App;
