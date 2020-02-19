import React from 'react';
import { render } from 'react-dom';

export default function NavBar(props) {
  return (
    <nav>
      <ul>
        <li>PathFinding Visualizer</li>
        <li>Algorithms</li>
        <li>Mazes & Patterns</li>
        <li>Add Bomb</li>
        <li>Visualize</li>
        <li>Clear Board</li>
        <li>Clear Walls & Weights</li>
        <li>Clear Path</li>
        <li>Speed</li>
      </ul>
    </nav>
  );
}
