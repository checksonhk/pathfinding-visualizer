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

  function handleClick(value) {
    dispatch({ type: 'SET_ALGORITHM', payload: value });
  }
  return (
    <Navbar>
      <Navbar.Brand>PathFinding Visualizer</Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='mr-auto'>
          <NavDropdown title='Algorithms' id='basic-nav-dropdown'>
            {Object.keys(pathfindingAlgorithms).map(algorithm => (
              <NavDropdown.Item key={algorithm} onClick={e => handleClick(pathfindingAlgorithms[algorithm])}>
                {algorithm}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
          <NavDropdown title='Maze & Patterns' id='basic-nav-dropdown'>
            <NavDropdown.Item href='#action/3.1'>Action</NavDropdown.Item>
            <NavDropdown.Item href='#action/3.2'>Another action</NavDropdown.Item>
            <NavDropdown.Item href='#action/3.3'>Something</NavDropdown.Item>
          </NavDropdown>
          <Nav.Item>
            <Navbar.Text>Add Bomb</Navbar.Text>
          </Nav.Item>
          <Nav.Item>
            <Button onClick={props.visualizeClick}>Visualize</Button>
          </Nav.Item>
          <Nav.Item>
            <Button onClick={props.resetClick}>Clear Board</Button>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
      {/* <li>Clear Walls & Weights</li>
      <li>Clear Path</li>
      <li>Speed</li> */}
    </Navbar>
  );
}
