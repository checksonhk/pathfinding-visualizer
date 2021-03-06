export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];

  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  // use !! to force boolean conversion
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift(); // Get the first Node

    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;

    // If the closest node is a distance of ifinity,
    // we must be trapped and should therefore stop.

    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid);
  }
}

const sortNodesByDistance = function(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
};

const updateUnvisitedNeighbors = function(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
};

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
// Only works when called *after* the dijkstra method above
export function getNodesInShortestPathOrder(finishNode) {
  const getNodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    getNodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  return getNodesInShortestPathOrder;
}
