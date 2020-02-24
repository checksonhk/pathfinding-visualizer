import React from 'react';
import './App.css';
import PathfindingVisualizer from './components/PathfindingVisualizer';
// import bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';

import PathfindingContextProvider from './context/pathfindingContext';

const App = function() {
  return (
    <div className='App'>
      <PathfindingContextProvider>
        <PathfindingVisualizer></PathfindingVisualizer>
      </PathfindingContextProvider>
    </div>
  );
};

export default App;
