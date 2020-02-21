const getAllNodes = function(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
};

export function dfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const unvisitedNodes = getAllNodes(grid);

  startNode.distance = 0;
  while (!!unvisitedNodes.length) {
    const currentNode = unvisitedNodes.pop();

    if (currentNode.isWall) continue;
    if (currentNode.distance === Infinity) return visitedNodesInOrder.reverse();
    currentNode.isVisited = true;
    if (currentNode === finishNode) return visitedNodesInOrder.reverse();

    visitedNodesInOrder.push(currentNode);
    updateUnvisitedNeighbors(currentNode, grid);
  }
}

const updateUnvisitedNeighbors = function(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  // console.log(unvisitedNeighbors);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
};

const getUnvisitedNeighbors = function(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.unshift(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.unshift(grid[row + 1][col]);
  if (col > 0) neighbors.unshift(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.unshift(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
};
