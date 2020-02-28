import React, { useContext, useState } from 'react';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { pathfindingContext } from '../context/pathfindingContext';
import { getNodesInShortestPathOrder } from '../algorithms/astar';

import './NavBar.scss';

const pathfindingAlgorithms = {
  'Depth First Search': 'DEPTH_FIRST_SEARCH',
  'Breadth First Search': 'BREADTH_FIRST_SEARCH',
  'Greedy Best Search': 'BEST_FIRST_SEARCH',
  Djisktra: 'DJISKTRA',
  'A*': 'A_STAR',
  // 'Bi Directional BFS': 'BI_DIRECTIONAL_BFS',
};

const mazeAlgorithms = {
  'Recursive Division': 'RECURSIVE_DIVISION',
  'Basic Random': 'BASIC_RANDOM',
  'Recursive Vertical Bias': 'RECURSIVE_VERTICAL',
  'Recursive Horizontal Bias': 'RECURSIVE_HORIZONTAL',
};

const speeds = {
  Fast: { visited: 10, shortestPath: 50 },
  Average: { visited: 40, shortestPath: 75 },
  Slow: { visited: 70, shortestPath: 100 },
};

export default function NavBar(props) {
  console.log('RENDERING NAVBAR');
  const [algorithm, setAlgorithm] = useState('Depth First Search');
  const [speed, setSpeed] = useState('');
  const { state, dispatch } = useContext(pathfindingContext);

  function handleAlgorithm(value) {
    setAlgorithm(value);
    dispatch({ type: 'SET_ALGORITHM', payload: pathfindingAlgorithms[value] });
  }

  function handleMaze(value) {
    props.mazeClick(value);
    // dispatch({ type: 'SET_MAZE', payload: value });
  }

  function handleSpeed(value) {
    setSpeed(value);
    dispatch({ type: 'SET_SPEED', payload: speeds[value] });
  }

  function handleToggle(value) {
    dispatch({ type: 'TOGGLE_NUMBERS' });
  }

  return (
    <Navbar bg='dark' variant='dark'>
      <Navbar.Brand>
        <img src='/logo.svg' width='35' height='35' alt='Pathfinding Visualizer Logo'></img>
        <span className='navbar-brand-text'>PathFinding Visualizer</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='navbar-nav' />
      <Navbar.Collapse id='navbar-nav'>
        <Nav fill className='mr-auto'>
          <NavDropdown title='Algorithms' id='algorithms-nav-dropdown'>
            {Object.keys(pathfindingAlgorithms).map(algorithm => (
              <NavDropdown.Item key={algorithm} onClick={e => handleAlgorithm(algorithm)}>
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
            <Button variant='primary' onClick={props.visualizeClick}>
              Visualize {algorithm}
            </Button>
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
        <Nav.Link onClick={handleToggle}>Show Numbers</Nav.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
