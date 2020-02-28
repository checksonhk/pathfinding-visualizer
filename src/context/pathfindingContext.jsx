import React, { createContext, useReducer } from 'react';
export const pathfindingContext = createContext();

const speed = {
  Fast: { visited: 10, shortestPath: 50 },
  Average: { visited: 40, shortestPath: 75 },
  Slow: { visited: 70, shortestPath: 100 },
};

const pathfindingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ALGORITHM':
      return { ...state, currentAlgorithm: action.payload };
    case 'SET_MAZE':
      return { ...state, currentMaze: action.payload };
    case 'SET_START_NODE':
      return { ...state, startNode: action.payload };
    case 'SET_END_NODE':
      return { ...state, endNode: action.payload };
    case 'SET_SPEED':
      return { ...state, speed: action.payload };
    case 'TOGGLE_NUMBERS':
      return { ...state, showNumbers: !state.showNumbers };
    default:
      return state;
  }
};
const initialState = {
  startNode: { row: 10, col: 15 },
  endNode: { row: 10, col: 55 },
  currentAlgorithm: 'DEPTH_FIRST_SEARCH',
  currentMaze: 'RECURSIVE_DIVISION',
  speed: speed.Fast,
  showNumbers: false,
};

export default function PathfindingContextProvider(props) {
  const [state, dispatch] = useReducer(pathfindingReducer, initialState);

  return <pathfindingContext.Provider value={{ state, dispatch }}>{props.children}</pathfindingContext.Provider>;
}
