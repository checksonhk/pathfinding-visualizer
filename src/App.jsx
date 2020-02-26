import React from 'react';
import PathfindingVisualizer from './components/PathfindingVisualizer';
// import bootstrap css
// import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.scss';
import './App.scss';

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
