import React from 'react';
import './Node.scss';

function Node(props) {
  console.log('RENDERING NODE');
  const { row, col, isFinish, isStart, isWall, onMouseDown, onMouseEnter, onMouseLeave, onMouseUp, distance, hdistance, tdistance } = props;
  const extraClassName = isFinish ? 'node-finish' : isStart ? 'node-start' : isWall ? 'node-wall' : '';

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseLeave={() => onMouseLeave(row, col)}
      onMouseUp={() => onMouseUp(row, col)}>
      {/* <span>{distance !== Infinity ? props.distance + '||' : ''}</span>
      <span>{hdistance !== Infinity ? props.hdistance : ''}</span>
      <p>{tdistance !== Infinity ? props.tdistance : ''}</p> */}
    </div>
  );
}

export default Node;
// export default React.memo(Node);
