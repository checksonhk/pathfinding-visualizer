import React from 'react';
import './Node.css';

export default function Node(props) {
  console.log('RENDERING NODE');
  const { row, col, isFinish, isStart, isWall, onMouseDown, onMouseEnter, onMouseUp } = props;
  const extraClassName = isFinish ? 'node-finish' : isStart ? 'node-start' : isWall ? 'node-wall' : '';

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}></div>
  );
}
