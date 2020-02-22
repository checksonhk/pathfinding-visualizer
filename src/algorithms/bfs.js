export function bfs(grid, startNode, finishNode) {
  const unvisitedNodes = [startNode];
  let exploredNodes = { [startNode.id]: true };
  const visitedNodesInOrder = [];
  startNode.distance = 0;

  while (unvisitedNodes.length) {
    let currentNode = unvisitedNodes.shift();
    // If we encounter a wall, we skip it.
    if (currentNode.isWall) continue;

    // If the closest node is a distance of ifinity,
    // we must be trapped and should therefore stop.

    if (currentNode.distance === Infinity) return visitedNodesInOrder;

    if (currentNode === finishNode) return visitedNodesInOrder;
    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);
    const currentNeighbors = getUnvisitedNeighbors(currentNode, grid);
    currentNeighbors.forEach(neighbor => {
      if (!exploredNodes[neighbor.id]) {
        exploredNodes[neighbor.id] = true;
        neighbor.distance = currentNode.distance + 1;
        neighbor.previousNode = currentNode;
        unvisitedNodes.push(neighbor);
      }
    });
  }
  return -1;
}

const getUnvisitedNeighbors = function(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
};
