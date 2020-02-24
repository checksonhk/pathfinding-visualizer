export function simpleDemonstration(grid) {
  const wallsToAnimate = [];
  let currentIdY = grid[0].length - 10;
  console.log(grid[0].length);
  for (let i = 0; i < 15; i++) {
    for (let counter = 0; counter < 10; counter++) {
      currentIdY = Math.floor(Math.random() * grid[0].length);
      const currentIdXOne = Math.floor(grid.length / 2) - counter;
      const currentIdXTwo = Math.floor(grid.length / 2) + counter;
      const currentNodeOne = grid[currentIdXOne][currentIdY];
      const currentNodeTwo = grid[currentIdXTwo][currentIdY];
      if (currentNodeOne.isStart || currentNodeOne.isFinish) continue;
      if (currentNodeTwo.isStart || currentNodeTwo.isFinish) continue;

      wallsToAnimate.push(currentNodeOne);
      wallsToAnimate.push(currentNodeTwo);
      currentNodeOne.isWall = true;
      currentNodeTwo.isWall = true;
    }
  }
  return wallsToAnimate;
}
