const getUnvisitedNeighbors = function(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  // console.log(neighbors.filter(neighbor => !neighbor.isVisited));
  return neighbors.filter(neighbor => !neighbor.isVisited);
};

export function getBiDirectionalShortestPath(middleNode) {
  const fromStart = [];
  const fromFinish = [];

  let toStart = middleNode;
  let toEnd = middleNode.biPreviousNode;
  while (toStart !== null) {
    fromStart.push(toStart);
    toStart = toStart.previousNode;
  }
  while (toEnd !== null) {
    fromFinish.push(toEnd);
    toEnd = toEnd.biPreviousNode;
  }
  const shortestPath = fromStart.reverse().concat(fromFinish);
  return shortestPath;
}

export function bi_bfs(grid, startNode, finishNode) {
  const [middleNode, visitedNodesInOrder] = _bi_bfs(grid, startNode, finishNode);
  return [visitedNodesInOrder, middleNode];
}

function _bi_bfs(grid, startNode, finishNode) {
  const unvisitedNodesStart = [startNode];
  const unvisitedNodesFinish = [finishNode];
  const visitedNodesInOrder = [];
  const exploredNodesStart = {};
  const exploredNodesFinish = {};
  startNode.distance = 0;
  finishNode.biDistance = 0;

  while (unvisitedNodesStart.length && unvisitedNodesFinish.length) {
    // for (let i = 0; i < 5; i++) {
    let startingCurrentNode = unvisitedNodesStart.shift();
    // FINISH NODE
    let finishCurrentNode = unvisitedNodesFinish.shift();
    // If we encounter a wall, we skip it.

    if (startingCurrentNode.isWall) continue;
    if (finishCurrentNode.isWall) continue;

    // If the current node is a distance of ifinity,
    // we must be trapped and should therefore stop.

    if (startingCurrentNode.distance === Infinity || finishCurrentNode.biDistance === Infinity) return visitedNodesInOrder;

    // visited node
    if (!startingCurrentNode.isStart && !finishCurrentNode.isFinish) {
      if (exploredNodesFinish[startingCurrentNode.id]) {
        // console.log('EXPLOREDNODE', exploredNodes);
        console.log('VISITED NODES', visitedNodesInOrder);
        console.log('startingNode', startingCurrentNode);
        return [startingCurrentNode, visitedNodesInOrder];
      } else if (exploredNodesStart[finishCurrentNode.id]) {
        console.log('EndingNode', finishCurrentNode);
        return [finishCurrentNode, visitedNodesInOrder];
      } else if (startingCurrentNode.id === finishCurrentNode.id) {
        console.log('THEY MATCH');
        return visitedNodesInOrder;
      }
    }

    startingCurrentNode.isVisited = true;
    finishCurrentNode.isVisited = true;

    exploredNodesStart[startingCurrentNode.id] = true;
    exploredNodesFinish[finishCurrentNode.id] = true;
    visitedNodesInOrder.push(startingCurrentNode);
    visitedNodesInOrder.push(finishCurrentNode);

    const currentNeighborsStart = getUnvisitedNeighbors(startingCurrentNode, grid);
    currentNeighborsStart.forEach(neighbor => {
      // if (!exploredNodes[neighbor.id]) {
      neighbor.distance = startingCurrentNode.distance + 1;
      neighbor.previousNode = startingCurrentNode;
      if (neighbor.id === '9-16') {
        console.log('here');
      }
      unvisitedNodesStart.push(neighbor);
      // }
    });

    const currentNeighborsFinish = getUnvisitedNeighbors(finishCurrentNode, grid);
    currentNeighborsFinish.forEach(neighbor => {
      // if (!exploredNodes[neighbor.id]) {
      neighbor.biDistance = finishCurrentNode.biDistance + 1;
      neighbor.biPreviousNode = finishCurrentNode;
      unvisitedNodesFinish.push(neighbor);
      // }
    });
  }
  return -1;
}
