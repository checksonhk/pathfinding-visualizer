function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function addOuterWalls(grid, array) {
  const width = grid[0].length - 1;
  const height = grid.length - 1;
  for (let row = 0; row < grid.length; row++) {
    if (row === 0 || row === height) {
      for (let col = 0; col <= width; col++) {
        const node = grid[row][col];
        node.isWall = true;
        array.push(node);
      }
    } else {
      grid[row][0].isWall = true;
      array.push(grid[row][0]);
      grid[row][width].isWall = true;
      array.push(grid[row][width]);
    }
  }
  return array;
}

function addInnerWalls(h, minX, maxX, minY, maxY, grid, startNode, array) {
  if (h) {
    // base case
    if (maxX - minX < 2) {
      return;
    }
    const y = Math.floor(randomNumber(minY, maxY) / 2) * 2;
    addHWall(minX, maxX, y, grid, array);
    addInnerWalls(!h, minX, maxX, minY, y - 1, grid, startNode, array);
    addInnerWalls(!h, minX, maxX, y + 1, maxY, grid, startNode, array);
  } else {
    if (maxY - minY < 2) {
      return;
    }
    const x = Math.floor(randomNumber(minX, maxX) / 2) * 2;
    addVWall(minY, maxY, x, grid, array);
    addInnerWalls(!h, minX, x - 1, minY, maxY, startNode, array);
    addInnerWalls(!h, x + 1, maxX, minY, maxY, startNode, array);
  }
}
function addHWall(minX, maxX, y, grid, array) {
  const hole = Math.floor(randomNumber(minX, maxX) / 2) * 2 + 1;
  console.log('HWALLHOLE', hole);

  for (let i = minX; i <= maxX; i++) {
    if (i === hole) grid[y][i].isWall = false;
    else {
      // console.log('HWALL', grid[y][i]);
      grid[y][i].isWall = true;
      array.push(grid[y][i]);
    }
  }
}

function addVWall(minY, maxY, x, grid, array) {
  const hole = Math.floor(randomNumber(minY, maxY) / 2) * 2 + 1;
  console.log('VWALLHOLE', hole);

  for (let i = minY; i <= maxY; i++) {
    if (i === hole) grid[i][x].isWall = false;
    else {
      // console.log('VWALL', grid[i][x]);
      grid[i][x].isWall = true;
      array.push(grid[i][x]);
    }
  }
}

export function recursiveDivision(grid, startNode) {
  const wallsToAnimate = [];
  addOuterWalls(grid, wallsToAnimate);
  addInnerWalls(true, 1, grid[0].length - 2, 1, grid.length - 2, grid, startNode, wallsToAnimate);
  return wallsToAnimate;
}
