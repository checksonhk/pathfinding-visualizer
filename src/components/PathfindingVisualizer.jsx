import React, { useState, useEffect, useContext } from 'react';
import Node from './Node';
import NavBar from './NavBar';
import Legend from './Legend';
import { dijkstra, getNodesInShortestPathOrder, dfs, bfs, bestfs, astar, getBiDirectionalShortestPath, bi_bfs } from '../algorithms/index';
import { pathfindingContext } from '../context/pathfindingContext';
import { basicRandom, recursiveDivision, recursiveVertical, recursiveHorizontal } from '../maze-algorithms/index';

import './PathfindingVisualizer.scss';

const nodesToUpdate = [];

const createNode = function(col, row, startNode, finishNode) {
  return {
    id: `${row}-${col}`,
    col,
    row,
    isStart: row === startNode.row && col === startNode.col,
    isFinish: row === finishNode.row && col === finishNode.col,
    distance: Infinity,
    biDistance: Infinity,
    totalDistance: Infinity,
    heuristicDistance: null,
    isVisited: false,
    isWall: false,
    previousNode: null,
    biPreviousNode: null,
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
  // best size is row 31 col 78
  for (let row = 0; row < 31; row++) {
    const currentRow = [];
    for (let col = 0; col < 78; col++) {
      currentRow.push(createNode(col, row, startNode, finishNode));
    }
    grid.push(currentRow);
  }
  return grid;
};

// const getNewGridWithWallToggled = function(grid, row, col) {
//   /* preformance issues - too many rerenders*/
//   // const newGrid = grid.slice();
//   // const node = newGrid[row][col];
//   // const newNode = {
//   //   ...node,
//   //   isWall: !node.isWall,
//   // };
//   // // update the newNode
//   // newGrid[row][col] = newNode;
//   // return newGrid;
// };

const dragEnterNode = function(grid, row, col, type, array = null) {
  const node = grid[row][col];
  switch (type) {
    case 'START':
      document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start';
      break;
    case 'END':
      document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish';
      break;
    case 'WALL':
      /* Hacky Solution for now */
      // const newNode = {
      //   ...node,
      //   isWall: !node.isWall,
      // };
      // grid[row][col] = newNode;

      if (node.isStart || node.isFinish) return;
      /* changed to batch update wall Nodes */
      const newNode = { ...node, isWall: !node.isWall };
      array.push(newNode);

      document.getElementById(`node-${node.row}-${node.col}`).className = node.isWall ? 'node' : 'node-wall';
      break;
    default:
      console.log('not a predefined case');
      return;
  }
};

const dragLeaveNode = function(grid, row, col) {
  const node = grid[row][col];
  if (node.isWall) {
    document.getElementById(`node-${node.row}-${node.col}`).className = 'node-wall';
  } else {
    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node';
  }
};

const setNode = function(grid, row, col, type) {
  const node = grid[row][col];
  let newNode = {};
  switch (type) {
    case 'START':
      newNode = {
        ...node,
        isStart: !node.isStart,
      };
      grid[row][col] = newNode;
      document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start';
      break;
    case 'END':
      newNode = {
        ...node,
        isFinish: !node.isFinish,
      };
      grid[row][col] = newNode;
      document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish';
      break;
    default:
      console.log('not a predefined case');
      return;
  }
};

const updatedGridWithWalls = function(grid, nodesToUpdate) {
  // Manually Batch Update Wall Nodes
  const newGrid = grid.slice();
  nodesToUpdate.forEach(node => {
    newGrid[node.row][node.col] = node;
  });
  return newGrid;
};

export default function PathfindingVisualizer(props) {
  console.log('RENDERING GRID');
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const { state, dispatch } = useContext(pathfindingContext);

  const START_NODE = state.startNode;
  const END_NODE = state.endNode;

  useEffect(() => {
    const grid = getInitialGrid(START_NODE, END_NODE);
    setGrid(grid);
  }, []);

  return (
    <div id='pathfinding-visualizer'>
      <NavBar visualizeClick={visualizePath} mazeClick={visualizeMaze} resetClick={resetGrid} clearClick={clearPath} />
      <Legend />
      <div className='grid'>{renderGrid(grid)}</div>
    </div>
  );

  function renderGrid(grid) {
    return grid.map((row, rowIdx) => {
      return (
        <div key={rowIdx} className='grid-row'>
          {row.map((node, nodeIdx) => {
            const { row, col, isFinish, isStart, isWall, distance, totalDistance } = node;
            return (
              <Node
                key={nodeIdx}
                col={col}
                isFinish={isFinish}
                isStart={isStart}
                isWall={isWall}
                onMouseDown={(row, col) => handleMouseDown(row, col)}
                onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                onMouseLeave={(row, col) => handleMouseLeave(row, col)}
                onMouseUp={(row, col) => handleMouseUp(row, col)}
                row={row}
                showNumbers={state.showNumbers}
                distance={distance}
                totalDistance={totalDistance}></Node>
            );
          })}
        </div>
      );
    });
  }

  function handleMouseDown(row, col) {
    if (grid[row][col].isStart) {
      // setMovingStart(true);
      setMouseIsPressed('START');
      dragEnterNode(grid, row, col, 'START');
    } else if (grid[row][col].isFinish) {
      // setMovingEnd(true);
      setMouseIsPressed('END');
      dragEnterNode(grid, row, col, 'END');
    } else {
      // setMouseIsPressed(true);
      setMouseIsPressed('WALL');
      dragEnterNode(grid, row, col, 'WALL', nodesToUpdate);
    }
  }

  function handleMouseEnter(row, col) {
    if (mouseIsPressed === 'START') dragEnterNode(grid, row, col, 'START');
    if (mouseIsPressed === 'END') dragEnterNode(grid, row, col, 'END');
    if (mouseIsPressed === 'WALL') dragEnterNode(grid, row, col, 'WALL', nodesToUpdate);
  }

  function handleMouseLeave(row, col) {
    if (mouseIsPressed === 'START' || mouseIsPressed === 'END') {
      dragLeaveNode(grid, row, col);
    }
  }

  function handleMouseUp(row, col) {
    if (mouseIsPressed === 'START') {
      setNode(grid, row, col, 'START');
      dispatch({ type: 'SET_START_NODE', payload: { row, col } });
    }

    if (mouseIsPressed === 'END') {
      setNode(grid, row, col, 'END');
      dispatch({ type: 'SET_END_NODE', payload: { row, col } });
    }

    if (mouseIsPressed === 'WALL') {
      // ensures render of grid
      const newGrid = updatedGridWithWalls(grid, nodesToUpdate);
      // clear queue
      nodesToUpdate.length = 0;
      setGrid(newGrid);
    }

    setMouseIsPressed(false);
    // setMovingStart(false);
    // setMovingEnd(false);
  }

  function animatePath(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, state.speed.visited * i);
        // optimal 10
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        // hacky solution to minimize rerenders
        // TODO: look into useRef to achieve similar result
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
      }, state.speed.visited * i);
      // optimal 10
    }
  }

  function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i <= nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
      }, state.speed.shortestPath * i);
      // optimal 50
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

  function visualizePath() {
    const startNode = grid[state.startNode.row][state.startNode.col];
    const endNode = grid[state.endNode.row][state.endNode.col];
    let visitedNodesInOrder;
    let middleNode;
    let nodesInShortestPathOrder;
    if (state.currentAlgorithm === 'BI_DIRECTIONAL_BFS') {
      [visitedNodesInOrder, middleNode] = setAlgorithm(state.currentAlgorithm, grid, startNode, endNode);
      nodesInShortestPathOrder = getBiDirectionalShortestPath(middleNode);
    } else {
      visitedNodesInOrder = setAlgorithm(state.currentAlgorithm, grid, startNode, endNode);
      nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode);
    }
    animatePath(visitedNodesInOrder, nodesInShortestPathOrder);
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
      case 'RECURSIVE_VERTICAL':
        wallNodesInOrder = recursiveVertical(grid);
        break;
      case 'RECURSIVE_HORIZONTAL':
        wallNodesInOrder = recursiveHorizontal(grid);
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
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node-wall';
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

  function clearPath() {
    const newGrid = grid.slice();
    for (let row = 0; row < newGrid.length; row++) {
      for (let col = 0; col < newGrid[row].length; col++) {
        const node = grid[row][col];
        let newNode = resetNode(node);
        if (node.isWall) {
          newNode = { ...newNode, isWall: true };
        }
        grid[row][col] = newNode;
        if (newNode.isStart) {
          document.getElementById(`node-${row}-${col}`).className = 'node node-start';
          continue;
        } else if (newNode.isFinish) {
          document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
          continue;
        } else if (newNode.isWall) {
          document.getElementById(`node-${row}-${col}`).className = 'node-wall';
        } else {
          document.getElementById(`node-${row}-${col}`).className = 'node';
        }
      }
    }
    setGrid(newGrid);
  }
}
