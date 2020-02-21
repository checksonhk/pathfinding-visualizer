import React, { useState, useEffect, useRef } from 'react';
import Node from './Node';
import './PathfindingVisualizer.css';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijsktra';
import { dfs } from '../algorithms/dfs';
import NavBar from './NavBar';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const END_NODE_ROW = 10;
const END_NODE_COL = 35;

const createNode = function(col, row) {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === END_NODE_ROW && col === END_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
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
  // create copy of grid
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  // update the newNode
  newGrid[row][col] = newNode;
  return newGrid;
};

export default function PathfindingVisualizer(props) {
  console.log('RENDERING GRID');
  const [state, setState] = useState({ grid: [], mouseIsPressed: false });

  useEffect(() => {
    const grid = getInitialGrid();
    setState(state => ({ ...state, grid: grid }));
  }, []);

  return (
    <div id='pathfinding-visualizer'>
      <NavBar visualizeClick={visualizeDijkstra} resetClick={resetGrid} />
      <div className='grid'>
        {state.grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx} className='grid-row'>
              {row.map((node, nodeIdx) => {
                const { row, col, isFinish, isStart, isWall } = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    mouseIsPressed={state.mouseIsPressed}
                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                    onMouseUp={() => handleMouseUp()}
                    row={row}></Node>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );

  function handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(state.grid, row, col);
    setState({ grid: newGrid, mouseIsPressed: true });
  }

  function handleMouseEnter(row, col) {
    if (!state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(state.grid, row, col);
    setState(state => ({ ...state, grid: newGrid }));
  }

  function handleMouseUp() {
    setState(state => ({ ...state, mouseIsPressed: false }));
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
    const { grid } = state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const endNode = grid[END_NODE_ROW][END_NODE_COL];
    // const visitedNodesInOrder = dijkstra(grid, startNode, endNode);
    const visitedNodesInOrder = dfs(grid, startNode, endNode);
    console.log(visitedNodesInOrder);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  function resetGrid() {
    for (let row = 0; row < state.grid.length; row++) {
      for (let col = 0; col < state.grid[row].length; col++) {
        if (state.grid[row][col].isStart) {
          document.getElementById(`node-${row}-${col}`).className = 'node node-start';
        }
        if (state.grid[row][col].isFinish) {
          document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
        }

        document.getElementById(`node-${row}-${col}`).className = 'node';
      }
    }
  }
}
