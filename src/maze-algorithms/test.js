function recursiveDivisionMaze(board, rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls, type) {
  if (rowEnd < rowStart || colEnd < colStart) {
    return;
  }
  // create outer walls
  if (!surroundingWalls) {
    let relevantIds = [board.start, board.target];
    if (board.object) relevantIds.push(board.object);
    Object.keys(board.nodes).forEach(node => {
      if (!relevantIds.includes(node)) {
        let r = parseInt(node.split('-')[0]);
        let c = parseInt(node.split('-')[1]);
        if (r === 0 || c === 0 || r === board.height - 1 || c === board.width - 1) {
          let currentHTMLNode = document.getElementById(node);
          board.wallsToAnimate.push(currentHTMLNode);
          if (type === 'wall') {
            board.nodes[node].status = 'wall';
            board.nodes[node].weight = 0;
          } else if (type === 'weight') {
            board.nodes[node].status = 'unvisited';
            board.nodes[node].weight = 15;
          }
        }
      }
    });
    surroundingWalls = true;
  }

  // create inner walls
  if (orientation === 'horizontal') {
    let possibleRows = [];
    for (let number = rowStart; number <= rowEnd; number += 2) {
      possibleRows.push(number);
    }
    let possibleCols = [];
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      possibleCols.push(number);
    }

    // select random row & column
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let currentRow = possibleRows[randomRowIndex];
    let colRandom = possibleCols[randomColIndex];

    // for every node in the grid
    Object.keys(board.nodes).forEach(node => {
      let r = parseInt(node.split('-')[0]);
      let c = parseInt(node.split('-')[1]);

      // if the row is the current row and not the current column && c > col start and < col end
      if (r === currentRow && c !== colRandom && c >= colStart - 1 && c <= colEnd + 1) {
        // get the node
        let currentHTMLNode = document.getElementById(node);

        // sure the node is not the start / target
        if (currentHTMLNode.className !== 'start' && currentHTMLNode.className !== 'target' && currentHTMLNode.className !== 'object') {
          // push to walls to animate
          board.wallsToAnimate.push(currentHTMLNode);
          if (type === 'wall') {
            // make node a wall
            board.nodes[node].status = 'wall';
            board.nodes[node].weight = 0;
          } else if (type === 'weight') {
            board.nodes[node].status = 'unvisited';
            board.nodes[node].weight = 15;
          }
        }
      }
    });

    // if current row - 2 - row start > colend- col start
    // if ther are more rows from the current row to the start than cols
    if (currentRow - 2 - rowStart > colEnd - colStart) {
      // repeat with horizontal but with the current row - 2
      recursiveDivisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, orientation, surroundingWalls, type);
    } else {
      // repeat with vertical division
      recursiveDivisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, 'vertical', surroundingWalls, type);
    }

    // if  there are more rows from rowEnd to current row to columns
    if (rowEnd - (currentRow + 2) > colEnd - colStart) {
      // repeat with current row + 2
      recursiveDivisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, orientation, surroundingWalls, type);
    } else {
      // repeat with current row + 2 but vertical orienttation
      recursiveDivisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, 'vertical', surroundingWalls, type);
    }
  } else {
    // repeat for vertical
    let possibleCols = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      possibleCols.push(number);
    }
    let possibleRows = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      possibleRows.push(number);
    }
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let currentCol = possibleCols[randomColIndex];
    let rowRandom = possibleRows[randomRowIndex];
    Object.keys(board.nodes).forEach(node => {
      let r = parseInt(node.split('-')[0]);
      let c = parseInt(node.split('-')[1]);
      if (c === currentCol && r !== rowRandom && r >= rowStart - 1 && r <= rowEnd + 1) {
        let currentHTMLNode = document.getElementById(node);
        if (currentHTMLNode.className !== 'start' && currentHTMLNode.className !== 'target' && currentHTMLNode.className !== 'object') {
          board.wallsToAnimate.push(currentHTMLNode);
          if (type === 'wall') {
            board.nodes[node].status = 'wall';
            board.nodes[node].weight = 0;
          } else if (type === 'weight') {
            board.nodes[node].status = 'unvisited';
            board.nodes[node].weight = 15;
          }
        }
      }
    });
    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      recursiveDivisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, 'horizontal', surroundingWalls, type);
    } else {
      recursiveDivisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, orientation, surroundingWalls, type);
    }
    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      recursiveDivisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, 'horizontal', surroundingWalls, type);
    } else {
      recursiveDivisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, orientation, surroundingWalls, type);
    }
  }
}
