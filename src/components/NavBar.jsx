import React, { useContext, useState } from 'react';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { pathfindingContext } from '../context/pathfindingContext';
import { getNodesInShortestPathOrder } from '../algorithms/astar';

const pathfindingAlgorithms = {
  'Depth First Search': 'DEPTH_FIRST_SEARCH',
  'Breadth First Search': 'BREADTH_FIRST_SEARCH',
  'Greedy Best Search': 'BEST_FIRST_SEARCH',
  Djisktra: 'DJISKTRA',
  'A*': 'A_STAR',
};

const speeds = {
  Fast: { visited: 10, shortestPath: 50 },
  Average: { visited: 40, shortestPath: 75 },
  Slow: { visited: 70, shortestPath: 100 },
};

export default function NavBar(props) {
  console.log('RENDERING NAVBAR');
  const [speed, setSpeed] = useState('');
  const { state, dispatch } = useContext(pathfindingContext);

  const mazeAlgorithms = {
    'Recursive Division': 'RECURSIVE_DIVISION',
    'Basic Random': 'BASIC_RANDOM',
  };

  function handleAlgorithm(value) {
    dispatch({ type: 'SET_ALGORITHM', payload: value });
  }

  function handleMaze(value) {
    props.mazeClick(value);
    // dispatch({ type: 'SET_MAZE', payload: value });
  }

  function handleSpeed(value) {
    setSpeed(value);
    dispatch({ type: 'SET_SPEED', payload: speeds[value] });
  }

  return (
    <Navbar>
      <Navbar.Brand>
        <img src='/logo.png' width='50' height='50' alt='Pathfinding Visualizer Logo'></img>PathFinding Visualizer
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='navbar-nav' />
      <Navbar.Collapse id='navbar-nav'>
        <Nav fill className='mr-auto'>
          <NavDropdown title='Algorithms' id='algorithms-nav-dropdown'>
            {Object.keys(pathfindingAlgorithms).map(algorithm => (
              <NavDropdown.Item key={algorithm} onClick={e => handleAlgorithm(pathfindingAlgorithms[algorithm])}>
                {algorithm}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
          <NavDropdown title='Maze & Patterns' id='maze-nav-dropdown'>
            {Object.keys(mazeAlgorithms).map(maze => (
              <NavDropdown.Item key={maze} onClick={() => handleMaze(mazeAlgorithms[maze])}>
                {maze}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
          <Nav.Item>
            <Button onClick={props.visualizeClick}>Visualize {state.currentAlgorithm}</Button>
          </Nav.Item>
          <Nav.Link onClick={props.resetClick}>Clear Board</Nav.Link>
          <Nav.Link onClick={props.clearClick}>Clear Path</Nav.Link>
        </Nav>
        <NavDropdown title={`Speed${speed ? ': ' + speed : ''}`} id='speed-nav-dropdown'>
          {Object.keys(speeds).map(speed => (
            <NavDropdown.Item key={speed} onClick={() => handleSpeed(speed)}>
              {speed}
            </NavDropdown.Item>
          ))}
        </NavDropdown>
      </Navbar.Collapse>
      {/* <li>Clear Walls & Weights</li>
      <li>Clear Path</li>
      <li>Speed</li> */}
    </Navbar>
  );
}
