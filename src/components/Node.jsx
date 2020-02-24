import React from 'react';
import './Node.css';

function Node(props) {
  console.log('RENDERING NODE');
  const { row, col, isFinish, isStart, isWall, onMouseDown, onMouseEnter, onMouseUp, distance, hdistance, tdistance } = props;
  const extraClassName = isFinish ? 'node-finish' : isStart ? 'node-start' : isWall ? 'node-wall' : '';

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}>
      {/* <span>{distance !== Infinity ? props.distance + '||' : ''}</span>
      <span>{hdistance !== Infinity ? props.hdistance : ''}</span>
      <p>{tdistance !== Infinity ? props.tdistance : ''}</p> */}
    </div>
  );
}

export default React.memo(Node);
