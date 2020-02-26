import React, { useContext } from 'react';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { pathfindingContext } from '../context/pathfindingContext';

export default function NavBar(props) {
  console.log('RENDERING NAVBAR');
  const { state, dispatch } = useContext(pathfindingContext);

  const pathfindingAlgorithms = {
    'Depth First Search': 'DEPTH_FIRST_SEARCH',
    'Breadth First Search': 'BREADTH_FIRST_SEARCH',
    'Greedy Best Search': 'BEST_FIRST_SEARCH',
    Djisktra: 'DJISKTRA',
    'A*': 'A_STAR',
  };

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
  return (
    <Navbar>
      <Navbar.Brand>PathFinding Visualizer</Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='mr-auto'>
          <NavDropdown title='Algorithms' id='basic-nav-dropdown'>
            {Object.keys(pathfindingAlgorithms).map(algorithm => (
              <NavDropdown.Item key={algorithm} onClick={e => handleAlgorithm(pathfindingAlgorithms[algorithm])}>
                {algorithm}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
          <NavDropdown title='Maze & Patterns' id='basic-nav-dropdown'>
            {Object.keys(mazeAlgorithms).map(maze => (
              <NavDropdown.Item key={maze} onClick={() => handleMaze(mazeAlgorithms[maze])}>
                {maze}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
          <Nav.Item>
            <Navbar.Text>Add Bomb</Navbar.Text>
          </Nav.Item>
          <Nav.Item>
            <Button onClick={props.visualizeClick}>Visualize {state.currentAlgorithm}</Button>
          </Nav.Item>
          <Nav.Item>
            <Button onClick={props.resetClick}>Clear Board</Button>
          </Nav.Item>
          <Nav.Item>
            <Button onClick={props.clearClick}>Clear Path</Button>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
      {/* <li>Clear Walls & Weights</li>
      <li>Clear Path</li>
      <li>Speed</li> */}
    </Navbar>
  );
}
