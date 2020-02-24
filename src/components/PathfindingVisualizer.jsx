import React, { useState, useEffect, useRef } from 'react';
import Node from './Node';
import './PathfindingVisualizer.css';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijsktra';
import { dfs } from '../algorithms/dfs';
import { bfs } from '../algorithms/bfs';
import { bi_bfs } from '../algorithms/bi-directional-bfs';
import { bestfs } from '../algorithms/best-first-search';
import { astar } from '../algorithms/astar';
import NavBar from './NavBar';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const END_NODE_ROW = 10;
const END_NODE_COL = 25;

const createNode = function(col, row) {
  return {
    id: `${row}-${col}`,
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === END_NODE_ROW && col === END_NODE_COL,
    distance: Infinity,
    totalDistance: Infinity,
    heuristicDistance: null,
    isVisited: false,
    isWall: false,
    previousNode: null,
    weight: 0,
  };
};

const getInitialGrid = function() {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const getNewGridWithWallToggled = function(grid, row, col) {
  /* preformance issues */
  // const newGrid = grid.slice();
  // const node = newGrid[row][col];
  // const newNode = {
  //   ...node,
  //   isWall: !node.isWall,
  // };
  // // update the newNode
  // newGrid[row][col] = newNode;
  // return newGrid;

  /* Hacky Solution for now */
  const node = grid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  grid[row][col] = newNode;
  document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall';
};

export default function PathfindingVisualizer(props) {
  console.log('RENDERING GRID');
  // const [state, setState] = useState({ grid: [], mouseIsPressed: false });
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

  useEffect(() => {
    const grid = getInitialGrid();
    setGrid(grid);
  }, []);

  return (
    <div id='pathfinding-visualizer'>
      <NavBar visualizeClick={visualizeDijkstra} resetClick={resetGrid} />
      <div className='grid'>
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx} className='grid-row'>
              {row.map((node, nodeIdx) => {
                const { row, col, isFinish, isStart, isWall, distance, totalDistance, heuristicDistance } = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    mouseIsPressed={mouseIsPressed}
                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                    onMouseUp={() => handleMouseUp()}
                    row={row}
                    distance={distance}
                    // hdistance={heuristicDistance}
                    // tdistance={totalDistance}
                  ></Node>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );

  function handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    // setGrid(newGrid);
    setMouseIsPressed(true);
  }

  function handleMouseEnter(row, col) {
    if (!mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    // setGrid(newGrid);
  }

  function handleMouseUp() {
    setMouseIsPressed(false);
  }

  function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        // hacky solution to minimize rerenders
        // TODO: look into useRef to achieve similar result
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
      }, 10 * i);
    }
  }

  function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i <= nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
      }, 50 * i);
    }
  }

  function visualizeDijkstra() {
    // const { grid } = state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const endNode = grid[END_NODE_ROW][END_NODE_COL];
    // const visitedNodesInOrder = dijkstra(grid, startNode, endNode);
    const visitedNodesInOrder = astar(grid, startNode, endNode);
    // console.log(visitedNodesInOrder);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  function resetGrid() {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col].isStart) {
          document.getElementById(`node-${row}-${col}`).className = 'node node-start';
        }
        if (grid[row][col].isFinish) {
          document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
        }

        document.getElementById(`node-${row}-${col}`).className = 'node';
      }
    }
  }
}
