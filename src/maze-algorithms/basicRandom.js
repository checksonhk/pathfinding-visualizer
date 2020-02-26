export default function basicRandom(grid) {
  const wallsToAnimate = [];
  let currentY = grid[0].length - 10;
  for (let i = 0; i < 20; i++) {
    for (let counter = 0; counter < 15; counter++) {
      currentY = Math.floor(Math.random() * grid[0].length);
      const currentXOne = Math.floor(grid.length / 2) - counter;
      const currentXTwo = Math.floor(grid.length / 2) + counter;
      const currentNodeOne = grid[currentXOne][currentY];
      const currentNodeTwo = grid[currentXTwo][currentY];
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
