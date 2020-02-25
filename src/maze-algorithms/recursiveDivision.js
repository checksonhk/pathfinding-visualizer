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

// function addInnerWalls(horizontal, minX, maxX, minY, maxY, grid, startNode, array) {
//   if (horizontal) {
//     // base case
//     if (maxX - minX < 2) {
//       return;
//     }
//     const y = Math.floor(randomNumber(minY, maxY) / 2) * 2;
//     addHWall(minX, maxX, y, grid, array);
//     addInnerWalls(!horizontal, minX, maxX, minY, y - 1, grid, startNode, array);
//     addInnerWalls(!horizontal, minX, maxX, y + 1, maxY, grid, startNode, array);
//   } else {
//     if (maxY - minY < 2) {
//       return;
//     }
//     const x = Math.floor(randomNumber(minX, maxX) / 2) * 2;
//     addVWall(minY, maxY, x, grid, array);
//     addInnerWalls(!horizontal, minX, x - 1, minY, maxY, startNode, array);
//     addInnerWalls(!horizontal, x + 1, maxX, minY, maxY, startNode, array);
//   }
// }
// function addHWall(minX, maxX, y, grid, array) {
//   const hole = Math.floor(randomNumber(minX, maxX) / 2) * 2 + 1;

//   for (let i = minX; i <= maxX; i++) {
//     if (i == hole) grid[y][i].isWall = false;
//     else {
//       const node = grid[y][i];
//       console.log(node);
//       node.isWall = true;
//       array.push(node);
//     }
//   }
// }

// function addVWall(minY, maxY, x, grid, array) {
//   const hole = Math.floor(randomNumber(minY, maxY) / 2) * 2 + 1;
//   console.log('VWALLHOLE', hole);

//   for (let i = minY; i <= maxY; i++) {
//     if (i == hole) grid[i][x].isWall = false;
//     else {
//       const node = grid[i][x];
//       console.log(node);
//       node.isWall = true;
//       array.push(node);
//     }
//   }
// }

// export function recursiveDivision(grid, startNode) {
//   const wallsToAnimate = [];
//   addOuterWalls(grid, wallsToAnimate);
//   addInnerWalls(true, 1, grid[0].length - 2, 1, grid.length - 2, grid, startNode, wallsToAnimate);
//   return wallsToAnimate;
// }

export function recursiveDivision(grid) {
  const wallsToAnimate = [];
  addOuterWalls(grid, wallsToAnimate);
  console.log('ROW', grid.length);
  console.log('COL', grid[0].length);
  addInnerWalls(grid, 1, grid.length - 1, 1, grid[0].length - 1, 'horizontal', wallsToAnimate);
  return wallsToAnimate;
}

function addInnerWalls(grid, rowStart, rowEnd, colStart, colEnd, orientation, array) {
  if (orientation === 'horizontal') {
    if (rowEnd - rowStart < 2) {
      return;
    }
    const randomRowIdx = randomNumber(rowStart, rowEnd);
    const randomColIdx = randomNumber(colStart, colEnd);
    const currentRow = randomRowIdx;
    const currentCol = randomColIdx;

    for (let row = rowStart; row < rowEnd; row++) {
      for (let col = colStart; col <= colEnd; col++) {
        debugger;
        if ((row === currentRow) & (col !== currentCol)) {
          const node = grid[row][col];
          if (!node.isStart && !node.isFinish) {
            node.isWall = true;
            array.push(node);
          }
        }
      }
    }
    if (currentRow - 2 - rowStart > colEnd - colStart) {
      addInnerWalls(grid, rowStart, currentRow - 2, colStart, colEnd, 'horizontal', array);
    } else {
      addInnerWalls(grid, rowStart, currentRow - 2, colStart, colEnd, 'vertical', array);
    }

    if (rowEnd - (currentRow + 2) > colEnd - colStart) {
      addInnerWalls(grid, currentRow + 2, rowEnd, colStart, colEnd, 'horizontal', array);
    } else {
      addInnerWalls(grid, currentRow + 2, rowEnd, colStart, colEnd, 'vertical', array);
    }
  } else if (orientation === 'vertical') {
    if (colEnd - colStart < 2) {
      return;
    }

    const randomRowIdx = randomNumber(rowStart, rowEnd);
    const randomColIdx = randomNumber(colStart, colEnd);
    const currentRow = randomRowIdx;
    const currentCol = randomColIdx;

    for (let row = rowStart; row <= rowEnd; row++) {
      for (let col = colStart; col <= colEnd; col++) {
        if ((col === currentCol) & (row !== currentRow)) {
          const node = grid[row][col];
          if (!node.isStart && !node.isFinish) {
            node.isWall = true;
            array.push(node);
          }
        }
      }
    }
    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      addInnerWalls(grid, rowStart, rowEnd, colStart, currentCol - 2, 'horizontal', array);
    } else {
      addInnerWalls(grid, rowStart, rowEnd, colStart, currentCol - 2, 'vertical', array);
    }
    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      addInnerWalls(grid, rowStart, rowEnd, currentCol + 2, colEnd, 'horizontal', array);
    } else {
      addInnerWalls(grid, rowStart, rowEnd, currentCol + 2, colEnd, 'veritcal', array);
    }
  }
}
