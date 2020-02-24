import React, { useState, useEffect, useRef, useContext } from 'react';
import Node from './Node';
import './PathfindingVisualizer.css';
import { dijkstra, getNodesInShortestPathOrder, dfs, bfs, bestfs, astar } from '../algorithms/index';
import NavBar from './NavBar';
import { pathfindingContext } from '../context/pathfindingContext';
import { simpleDemonstration } from '../maze-algorithms/basicRandom';
import { recursiveDivision } from '../maze-algorithms/recursiveDivision';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const END_NODE_ROW = 10;
const END_NODE_COL = 35;

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
  /* preformance issues - too many rerenders*/
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
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const { state, dispatch } = useContext(pathfindingContext);

  useEffect(() => {
    const grid = getInitialGrid();
    setGrid(grid);
  }, []);

  return (
    <div id='pathfinding-visualizer'>
      <NavBar visualizeClick={visualizeDijkstra} generateClick={visualizeMaze} resetClick={resetGrid} />
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

  function setAlgorithm(algorithm, grid, startNode, endNode) {
    switch (algorithm) {
      case 'DJISKTRA':
        return dijkstra(grid, startNode, endNode);
      case 'BREADTH_FIRST_SEARCH':
        return bfs(grid, startNode, endNode);
      case 'DEPTH_FIRST_SEARCH':
        return dfs(grid, startNode, endNode);
      case 'BEST_FIRST_SEARCH':
        return bestfs(grid, startNode, endNode);
      case 'A_STAR':
        return astar(grid, startNode, endNode);
      default:
        console.log('UNIMPLEMENTED ALGORITHM \n DEFAULT SET TO DJISKTRA');
        return dijkstra(grid, startNode, endNode);
    }
  }

  function visualizeDijkstra() {
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const endNode = grid[END_NODE_ROW][END_NODE_COL];
    const visitedNodesInOrder = setAlgorithm(state.currentAlgorithm, grid, startNode, endNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  function visualizeMaze() {
    const wallNodesInOrder = recursiveDivision(grid);
    animateMaze(wallNodesInOrder);
  }

  function animateMaze(visitedNodesInOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        // hacky solution to minimize rerenders
        // TODO: look into useRef to achieve similar result
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall';
      }, 10 * i);
    }
  }

  function resetGrid() {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col].isStart) {
          document.getElementById(`node-${row}-${col}`).className = 'node node-start';
          continue;
        }
        if (grid[row][col].isFinish) {
          document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
          continue;
        }
        document.getElementById(`node-${row}-${col}`).className = 'node';
      }
    }
    const newGrid = getInitialGrid();
    setGrid(newGrid);
  }
}
