function randomNumber(array) {
  return Math.floor(Math.random() * array.length);
}

function randomColNRow(rowStart, rowEnd, colStart, colEnd, orientation) {
  const possibleCols = [];
  const possibleRows = [];
  if (orientation === 'horizontal') {
    // walls on even cells only
    for (let number = rowStart; number <= rowEnd; number += 2) {
      possibleRows.push(number);
    }
    // openings in odd cells only
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      possibleCols.push(number);
    }
  } else {
    for (let number = colStart; number <= colEnd; number += 2) {
      possibleCols.push(number);
    }
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      possibleRows.push(number);
    }
  }
  const randomColIndex = randomNumber(possibleCols);
  const randomRowIndex = randomNumber(possibleRows);
  const colRandom = possibleCols[randomColIndex];
  const rowRandom = possibleRows[randomRowIndex];
  return [colRandom, rowRandom];
}

const getAllNodes = function(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
};

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

function addVerticalWall(grid, colStart, colEnd, colRandom, currentRow, array) {
  getAllNodes(grid).forEach(node => {
    if (node.row === currentRow && node.col !== colRandom && node.col >= colStart - 1 && node.col <= colEnd + 1) {
      if (!node.isStart && !node.isFinish) {
        node.isWall = true;
        array.push(node);
      }
    }
  });
}

function addHorizontalWall(grid, rowStart, rowEnd, rowRandom, currentCol, array) {
  getAllNodes(grid).forEach(node => {
    if (node.col === currentCol && node.row !== rowRandom && node.row >= rowStart - 1 && node.row <= rowEnd + 1) {
      if (!node.isStart && !node.isFinish) {
        node.isWall = true;
        array.push(node);
      }
    }
  });
}

function addInnerWalls(grid, rowStart, rowEnd, colStart, colEnd, orientation, array) {
  if (orientation === 'horizontal') {
    if (rowEnd < rowStart) {
      return;
    }

    const [colRandom, currentRow] = randomColNRow(rowStart, rowEnd, colStart, colEnd, orientation);

    addVerticalWall(grid, colStart, colEnd, colRandom, currentRow, array);

    // check if remaining row from point or column is larger if # of rows from point is larger add another horizontal wall, else vertical wall
    if (currentRow - 2 - rowStart > colEnd - colStart) {
      addInnerWalls(grid, rowStart, currentRow - 2, colStart, colEnd, 'horizontal', array);
    } else {
      addInnerWalls(grid, rowStart, currentRow - 2, colStart, colEnd, 'vertical', array);
    }
    // check if remaining rows or column is larger if # of rows is larger add another horizontal wall, else vertical wall
    if (rowEnd - (currentRow + 2) > colEnd - colStart) {
      addInnerWalls(grid, currentRow + 2, rowEnd, colStart, colEnd, 'vertical', array);
    } else {
      addInnerWalls(grid, currentRow + 2, rowEnd, colStart, colEnd, 'vertical', array);
    }
  } else if (orientation === 'vertical') {
    if (colEnd < colStart) {
      return;
    }

    let [currentCol, rowRandom] = randomColNRow(rowStart, rowEnd, colStart, colEnd, orientation);

    addHorizontalWall(grid, rowStart, rowEnd, rowRandom, currentCol, array);

    // check if remaining if either row or column is larger
    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      addInnerWalls(grid, rowStart, rowEnd, colStart, currentCol - 2, 'vertical', array);
    } else {
      addInnerWalls(grid, rowStart, rowEnd, colStart, currentCol - 2, 'vertical', array);
    }
    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      addInnerWalls(grid, rowStart, rowEnd, currentCol + 2, colEnd, 'horizontal', array);
    } else {
      addInnerWalls(grid, rowStart, rowEnd, currentCol + 2, colEnd, 'vertical', array);
    }
  }
}

export default function recursiveVertical(grid) {
  const wallsToAnimate = [];
  addOuterWalls(grid, wallsToAnimate);
  const row = grid.length;
  const col = grid[0].length;
  addInnerWalls(grid, 2, row - 3, 2, col - 3, 'horizontal', wallsToAnimate);
  return wallsToAnimate;
}
