# Game Description
This is a modern React-based implementation of the classic Tetris game, featuring dynamic gameplay, colorful tetrominoes, and responsive controls. The goal of the game is to stack and clear rows of blocks, strategically fitting tetromino shapes as they descend onto the game board.
## Features
-Colorful Tetromino Shapes: Seven distinct shapes (T, O, I, Z, S, L, and J) are represented with vibrant colors to enhance the gaming experience.
-Dynamic Gameplay:
    -Blocks automatically move down the board at a set speed.
    -Players can accelerate their descent or drop them instantly for faster-paced gameplay.
-Responsive Controls:
    -Arrow Keys: Move tetrominoes left, right, or rotate them.
-Line Clearing: Complete horizontal rows are cleared from the board, awarding points and freeing up space for new blocks.
-Score Tracking: Players earn points for clearing rows, with higher scores for multiple rows cleared simultaneously.
-Game Over Detection: The game ends if the tetrominoes stack above the top of the board.
-Restart Option: Players can restart the game at any time, resetting the board and score.

## Technical Details
-The game board is a 10x20 grid, with each cell representing a block.
-Tetromino collision detection ensures that shapes land properly and do not overlap.
-Rows that are completely filled are removed, and the board adjusts accordingly to make room for more shapes.
-The game state is managed using React hooks, with a combination of useState and useEffect for reactivity.
-The game logic ensures smooth animation, row-clearing mechanics, and intuitive gameplay.

## How To Play:
  -Start the game to spawn the first tetromino at the top of the grid.
  -Use the arrow keys to position and rotate the tetrominoes as they descend.
  -Clear rows by filling them completely with blocks.
  -Earn points and aim for a high score before the grid fills up.






