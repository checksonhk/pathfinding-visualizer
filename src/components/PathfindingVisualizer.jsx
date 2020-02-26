import React, { useState, useEffect, useContext } from 'react';
import Node from './Node';
import './PathfindingVisualizer.css';
import { dijkstra, getNodesInShortestPathOrder, dfs, bfs, bestfs, astar } from '../algorithms/index';
import NavBar from './NavBar';
import { pathfindingContext } from '../context/pathfindingContext';
import { basicRandom, recursiveDivision } from '../maze-algorithms/index';
import { bi_bfs } from '../algorithms/bi-directional-bfs';

const createNode = function(col, row, startNode, finishNode) {
  return {
    id: `${row}-${col}`,
    col,
    row,
    isStart: row === startNode.row && col === startNode.col,
    isFinish: row === finishNode.row && col === finishNode.col,
    distance: Infinity,
    totalDistance: Infinity,
    heuristicDistance: null,
    isVisited: false,
    isWall: false,
    previousNode: null,
    weight: 0,
  };
};

function resetNode(node) {
  return {
    ...node,
    distance: Infinity,
    totalDistance: Infinity,
    heuristicDistance: null,
    isVisited: false,
    isWall: false,
    previousNode: null,
    weight: 0,
  };
}

const getInitialGrid = function(startNode, finishNode) {
  const grid = [];
  // best size is row 30 col 76
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row, startNode, finishNode));
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

  const node = grid[row][col];

  /* Hacky Solution for now */
  if (node.isStart || node.isFinish) return;
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  grid[row][col] = newNode;
  document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall';
};

const dragEnterStartNode = function(grid, row, col) {
  /* Hacky Solution for now */
  const node = grid[row][col];
  // const newNode = {
  //   ...node,
  //   isStart: !node.isStart,
  // };
  // grid[row][col] = newNode;
  document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start';
};

const dragLeaveStartNode = function(grid, row, col) {
  const node = grid[row][col];
  if (node.isWall) {
    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall';
  } else {
    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node';
  }
};

const setStartNode = function(grid, row, col) {
  const node = grid[row][col];
  const newNode = {
    ...node,
    isStart: !node.isStart,
  };
  grid[row][col] = newNode;
  document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start';
};

export default function PathfindingVisualizer(props) {
  console.log('RENDERING GRID');
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [movingStart, setMovingStart] = useState(false);
  const { state, dispatch } = useContext(pathfindingContext);
  const START_NODE = state.startNode;
  const END_NODE = state.endNode;

  useEffect(() => {
    const grid = getInitialGrid(START_NODE, END_NODE);
    setGrid(grid);
  }, []);

  return (
    <div id='pathfinding-visualizer'>
      <NavBar visualizeClick={visualizeDijkstra} mazeClick={visualizeMaze} resetClick={resetGrid} />
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
                    onMouseLeave={(row, col) => handleMouseLeave(row, col)}
                    onMouseUp={(row, col) => handleMouseUp(row, col)}
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
    if (grid[row][col].isStart) {
      setMovingStart(true);
      dragEnterStartNode(grid, row, col);
      return;
    }
    const newGrid = getNewGridWithWallToggled(grid, row, col);

    // setGrid(newGrid);
    setMouseIsPressed(true);
  }

  function handleMouseEnter(row, col) {
    if (movingStart) {
      dragEnterStartNode(grid, row, col);
    }
    if (!mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    // setGrid(newGrid);
  }

  function handleMouseLeave(row, col) {
    if (!movingStart) return;
    dragLeaveStartNode(grid, row, col);
  }

  function handleMouseUp(row, col) {
    setMouseIsPressed(false);
    if (movingStart) {
      setStartNode(grid, row, col);
    }
    setMovingStart(false);
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
      case 'BI_DIRECTIONAL_BFS':
        return bi_bfs(grid, startNode, endNode);
      default:
        console.log('UNIMPLEMENTED ALGORITHM \n DEFAULT SET TO DJISKTRA');
        return dijkstra(grid, startNode, endNode);
    }
  }

  function visualizeDijkstra() {
    const startNode = grid[state.startNode.row][state.startNode.col];
    const endNode = grid[state.endNode.row][state.endNode.col];
    const visitedNodesInOrder = setAlgorithm(state.currentAlgorithm, grid, startNode, endNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  function visualizeMaze(maze) {
    let wallNodesInOrder;

    switch (maze) {
      case 'RECURSIVE_DIVISION':
        wallNodesInOrder = recursiveDivision(grid);
        break;
      case 'BASIC_RANDOM':
        wallNodesInOrder = basicRandom(grid);
        break;
      default:
        wallNodesInOrder = recursiveDivision(grid);
        break;
    }
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
    const newGrid = grid.slice();
    for (let row = 0; row < newGrid.length; row++) {
      for (let col = 0; col < newGrid[row].length; col++) {
        if (grid[row][col].isStart) {
          const node = grid[row][col];
          const newNode = resetNode(node);
          grid[row][col] = newNode;
          document.getElementById(`node-${row}-${col}`).className = 'node node-start';
          continue;
        }
        if (grid[row][col].isFinish) {
          const node = grid[row][col];
          const newNode = resetNode(node);
          grid[row][col] = newNode;
          document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
          continue;
        }
        const node = grid[row][col];
        const newNode = resetNode(node);
        grid[row][col] = newNode;
        document.getElementById(`node-${row}-${col}`).className = 'node';
      }
    }
    setGrid(newGrid);
  }
}
