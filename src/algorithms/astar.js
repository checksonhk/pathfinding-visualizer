const sortNodesByDistance = function(unvisitedNodes) {
  // sort by total distance first, if they are the same, sortby heuristicdistance
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.totalDistance - nodeB.totalDistance || nodeA.heuristicDistance - nodeB.heuristicDistance);
};

const updateUnvisitedNeighbors = function(node, grid, startNode, finishNode) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    updateNode(node, neighbor, startNode, finishNode);
  }
};

const updateNode = function(node, neighbor, startNode, finishNode) {
  const distance = distanceFromNeighbor(node, neighbor);
  // set heuristic distance if there isnt one
  if (!neighbor.heuristicDistance) neighbor.heuristicDistance = manhattanDistance(neighbor, finishNode);
  const distanceToCompare = neighbor.weight + distance + node.distance;

  if (distanceToCompare < neighbor.distance) {
    neighbor.distance = distanceToCompare;
    neighbor.totalDistance = neighbor.distance + neighbor.heuristicDistance;
    neighbor.previousNode = node;
  }
};

function distanceFromNeighbor(node, neighbor) {
  if (node.row === neighbor.row - 1 && node.col === neighbor.col) {
    // console.log('LEFT');
    return 1;
  }
  if (node.row === neighbor.row + 1 && node.col === neighbor.col) {
    // console.log('RIGHT');
    return 1;
  }
  if (node.col === neighbor.col + 1 && node.row === neighbor.row) {
    // console.log('UP');
    return 1;
  }
  if (node.col === neighbor.col - 1 && node.row === neighbor.row) {
    // console.log('DOWN');
    return 1;
  }
}

function manhattanDistance(node, targetNode) {
  let yChange = Math.abs(node.row - targetNode.row);
  let xChange = Math.abs(node.col - targetNode.col);
  return xChange + yChange;
}

const getUnvisitedNeighbors = function(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
};

// split into utility function
const getAllNodes = function(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
};

// Backtracks from the finishNode to find the shortest path.
export function getNodesInShortestPathOrder(finishNode) {
  const getNodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    getNodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  return getNodesInShortestPathOrder;
}

export function astar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];

  startNode.distance = 0;
  startNode.totalDistance = 0;
  const unvisitedNodes = getAllNodes(grid);

  // use !! to force boolean conversion
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    // console.log(unvisitedNodes);
    const closestNode = unvisitedNodes.shift(); // Get the first Node

    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;

    // If the closest node is a distance of ifinity,
    // we must be trapped and should therefore stop.
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    visitedNodesInOrder.push(closestNode);

    closestNode.isVisited = true;

    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid, startNode, finishNode);
  }
}
