import React from 'react';
import StartImg from '../imgs/start.png';
import EndImg from '../imgs/end.png';

import './Legend.scss';
export default function Legend(props) {
  return (
    <div id='pathfinding-legend'>
      <ul className='legend-container'>
        <li>
          <img src={StartImg} alt='start node'></img>
          <span className='legend-text'>Start Node</span>
        </li>
        <li>
          <img src={EndImg} alt='target node'></img>
          <span className='legend-text'>Target Node</span>
        </li>
        <li>
          <div className='legend-unvisited'></div>
          <span className='legend-text'>Unvisited Node</span>
        </li>
        <li>
          <div className='legend-visited'></div>
          <span className='legend-text'>Visited Node</span>
        </li>
        <li>
          <div className='legend-shortest-path'></div>
          <span className='legend-text'>Shortest Path</span>
        </li>
        <li>
          <div className='legend-wall'></div>
          <span className='legend-text'>Wall</span>
        </li>
      </ul>
      <div className='legend-msg'>Visualize an algorithm!</div>
    </div>
  );
}
