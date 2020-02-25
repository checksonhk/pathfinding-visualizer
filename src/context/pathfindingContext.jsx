import React, { createContext, useReducer } from 'react';
export const pathfindingContext = createContext();

const pathfindingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ALGORITHM':
      return { ...state, currentAlgorithm: action.payload };
    default:
      return state;
  }
};

const initialState = {
  currentAlgorithm: 'BI_DIRECTIONAL_BFS',
};

export default function PathfindingContextProvider(props) {
  const [state, dispatch] = useReducer(pathfindingReducer, initialState);

  return <pathfindingContext.Provider value={{ state, dispatch }}>{props.children}</pathfindingContext.Provider>;
}
