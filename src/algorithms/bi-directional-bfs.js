export function bi_bfs(grid, startNode, finishNode) {
  const unvisitedNodesStart = [startNode];
  const visitedNodesInOrderStart = [];
  const unvisitedNodesFinish = [finishNode];
  const visitedNodesInOrderFinish = [];
  let exploredNodes = { [startNode.id]: true, [finishNode.id]: true };
  startNode.distance = 0;

  while (unvisitedNodesStart.length && unvisitedNodesFinish.length) {
    let startingCurrentNode = unvisitedNodesStart.shift();
    // If we encounter a wall, we skip it.
    if (startingCurrentNode.isWall) continue;

    // If the current node is a distance of ifinity,
    // we must be trapped and should therefore stop.

    if (startingCurrentNode.distance === Infinity) return visitedNodesInOrderStart;

    // if current node is already visited then it must be from finish Node
    if (startingCurrentNode.isVisited) {
      return visitedNodesInOrderStart.concat(visitedNodesInOrderFinish);
    }

    startingCurrentNode.isVisited = true;
    visitedNodesInOrderStart.push(startingCurrentNode);
    const currentNeighborsStart = getUnvisitedNeighbors(startingCurrentNode, grid);
    currentNeighborsStart.forEach(neighbor => {
      if (!exploredNodes[neighbor.id]) {
        exploredNodes[neighbor.id] = true;
        neighbor.distance = startingCurrentNode.distance + 1;
        neighbor.previousNode = startingCurrentNode;
        unvisitedNodesStart.push(neighbor);
      }
    });

    // FINISH NODE

    let finishCurrentNode = unvisitedNodesFinish.shift();
    // If we encounter a wall, we skip it.
    if (finishCurrentNode.isWall) continue;

    // If the current node is a distance of ifinity,
    // we must be trapped and should therefore stop.

    if (finishCurrentNode.distance === Infinity) return visitedNodesInOrderFinish;

    // if current node is already visited then it must be from finish Node
    if (finishCurrentNode.isVisited) {
      return visitedNodesInOrderFinish.concat(visitedNodesInOrderStart);
    }

    finishCurrentNode.isVisited = true;
    visitedNodesInOrderFinish.push(finishCurrentNode);
    const currentNeighborsFinish = getUnvisitedNeighbors(finishCurrentNode, grid);
    currentNeighborsFinish.forEach(neighbor => {
      if (!exploredNodes[neighbor.id]) {
        exploredNodes[neighbor.id] = true;
        neighbor.distance = finishCurrentNode.distance + 1;
        neighbor.previousNode = finishCurrentNode;
        unvisitedNodesStart.push(neighbor);
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
