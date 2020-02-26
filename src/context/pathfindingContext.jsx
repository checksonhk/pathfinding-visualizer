import React, { createContext, useReducer } from 'react';
export const pathfindingContext = createContext();

const pathfindingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ALGORITHM':
      return { ...state, currentAlgorithm: action.payload };
    case 'SET_MAZE':
      return { ...state, currentMaze: action.payload };
    default:
      return state;
  }
};

const initialState = {
  startNode: { row: 10, col: 15 },
  endNode: { row: 10, col: 35 },
  currentAlgorithm: 'DEPTH_FIRST_SEARCH',
  currentMaze: 'RECURSIVE_DIVISION',
};

export default function PathfindingContextProvider(props) {
  const [state, dispatch] = useReducer(pathfindingReducer, initialState);

  return <pathfindingContext.Provider value={{ state, dispatch }}>{props.children}</pathfindingContext.Provider>;
}
