// Game configuration
const config = {
  rows: 32,
  cols: 32,
  cellSize: 15,
  speed: 100, // Update interval in milliseconds
  minSize: 16, // Minimum grid size (2^4)
  maxSize: 128, // Maximum grid size (2^7)
};

// Game state
let grid = [];
let running = false;
let gameInterval = null;

// Initialize the game
function initGame() {
  const gameContainer = document.createElement("div");
  gameContainer.id = "game-container";
  gameContainer.style.display = "flex";
  gameContainer.style.flexDirection = "column";
  gameContainer.style.alignItems = "center";
  gameContainer.style.gap = "10px";
  gameContainer.style.padding = "20px";

  // Create grid
  const gridElement = document.createElement("div");
  gridElement.id = "grid";
  gridElement.style.display = "grid";
  gridElement.style.gridTemplateColumns = `repeat(${config.cols}, ${config.cellSize}px)`;
  gridElement.style.gap = "1px";
  gridElement.style.backgroundColor = "#ccc";
  gridElement.style.border = "1px solid #ccc";

  // Create cells
  createCells(gridElement);

  // Create controls
  const controls = document.createElement("div");
  controls.style.display = "flex";
  controls.style.gap = "10px";

  // Start/Stop button
  const startStopBtn = document.createElement("button");
  startStopBtn.textContent = "Start";
  startStopBtn.addEventListener("click", () => {
    if (running) {
      stopGame();
      startStopBtn.textContent = "Start";
    } else {
      startGame();
      startStopBtn.textContent = "Stop";
    }
  });

  // Reset button
  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Reset";
  resetBtn.addEventListener("click", () => {
    stopGame();
    startStopBtn.textContent = "Start";
    clearGrid();
  });

  // Random button
  const randomBtn = document.createElement("button");
  randomBtn.textContent = "Random";
  randomBtn.addEventListener("click", () => {
    if (!running) {
      randomizeGrid();
    }
  });

  // Glider button
  const gliderBtn = document.createElement("button");
  gliderBtn.textContent = "Add Glider";
  gliderBtn.addEventListener("click", () => {
    if (!running) {
      addGlider();
    }
  });

  controls.appendChild(startStopBtn);
  controls.appendChild(resetBtn);
  controls.appendChild(randomBtn);
  controls.appendChild(gliderBtn);

  // Create size controls
  const sizeControls = document.createElement("div");
  sizeControls.style.display = "flex";
  sizeControls.style.gap = "10px";
  sizeControls.style.marginBottom = "10px";
  sizeControls.style.alignItems = "center";

  // Size indicator
  const sizeIndicator = document.createElement("span");
  sizeIndicator.textContent = `Grid Size: ${config.rows}x${config.cols}`;
  sizeIndicator.style.marginRight = "10px";
  sizeIndicator.style.fontWeight = "bold";
  sizeIndicator.style.minWidth = "120px";

  // Increase grid button
  const increaseBtn = document.createElement("button");
  increaseBtn.textContent = "Double Size";
  increaseBtn.addEventListener("click", () => {
    if (!running && config.rows * 2 <= config.maxSize) {
      config.rows *= 2;
      config.cols *= 2;
      rebuildGrid();
      sizeIndicator.textContent = `Grid Size: ${config.rows}x${config.cols}`;
    }
  });

  // Decrease grid button
  const decreaseBtn = document.createElement("button");
  decreaseBtn.textContent = "Half Size";
  decreaseBtn.addEventListener("click", () => {
    if (!running && config.rows / 2 >= config.minSize) {
      config.rows /= 2;
      config.cols /= 2;
      rebuildGrid();
      sizeIndicator.textContent = `Grid Size: ${config.rows}x${config.cols}`;
    }
  });

  sizeControls.appendChild(sizeIndicator);
  sizeControls.appendChild(decreaseBtn);
  sizeControls.appendChild(increaseBtn);

  // Create speed control slider
  const speedControl = document.createElement("div");
  speedControl.style.display = "flex";
  speedControl.style.alignItems = "center";
  speedControl.style.gap = "10px";
  speedControl.style.marginBottom = "10px";

  const speedLabel = document.createElement("label");
  speedLabel.textContent = "Speed:";
  speedLabel.style.fontWeight = "bold";

  const speedSlider = document.createElement("input");
  speedSlider.type = "range";
  speedSlider.min = "10"; // Fastest: 10ms between updates
  speedSlider.max = "500"; // Slowest: 500ms between updates
  speedSlider.value = config.speed;
  speedSlider.style.width = "150px";

  const speedValue = document.createElement("span");
  speedValue.textContent = `${config.speed}ms`;
  speedValue.style.minWidth = "60px";

  speedSlider.addEventListener("input", () => {
    config.speed = parseInt(speedSlider.value);
    speedValue.textContent = `${config.speed}ms`;

    // Update the game interval if running
    if (running) {
      clearInterval(gameInterval);
      gameInterval = setInterval(updateGame, config.speed);
    }
  });

  speedControl.appendChild(speedLabel);
  speedControl.appendChild(speedSlider);
  speedControl.appendChild(speedValue);

  // Container for controls
  const controlsContainer = document.createElement("div");
  controlsContainer.style.display = "flex";
  controlsContainer.style.flexDirection = "column";
  controlsContainer.style.gap = "10px";
  controlsContainer.style.width = "100%";

  // Add elements to container
  controlsContainer.appendChild(sizeControls);
  controlsContainer.appendChild(speedControl);
  controlsContainer.appendChild(controls);
  gameContainer.appendChild(gridElement);
  gameContainer.appendChild(controlsContainer);

  // Add to the game root container
  document.getElementById("game-root").appendChild(gameContainer);

  // Add CSS
  const style = document.createElement("style");
  style.textContent = `
        button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            background-color: #4CAF50;
            color: white;
            cursor: pointer;
            font-size: 14px;
        }
        button:hover {
            background-color: #45a049;
        }
        .cell {
            transition: background-color 0.1s;
        }
    `;
  document.head.appendChild(style);
}

// Start the game simulation
function startGame() {
  if (!running) {
    running = true;
    gameInterval = setInterval(updateGame, config.speed);
  }
}

// Stop the game simulation
function stopGame() {
  if (running) {
    running = false;
    clearInterval(gameInterval);
  }
}

// Clear the grid
function clearGrid() {
  grid = Array(config.rows)
    .fill()
    .map(() => Array(config.cols).fill(false));
  updateGridDisplay();
}

// Randomize the grid
function randomizeGrid() {
  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.cols; col++) {
      grid[row][col] = Math.random() > 0.7;
    }
  }
  updateGridDisplay();
}

// Add a glider pattern
function addGlider() {
  // Place a glider in the top-left area if there's space
  if (config.rows > 3 && config.cols > 3) {
    const startRow = 1;
    const startCol = 1;

    // Clear the area first
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (startRow + r < config.rows && startCol + c < config.cols) {
          grid[startRow + r][startCol + c] = false;
        }
      }
    }

    // Add glider pattern
    // Bottom-left to top-right diagonal
    grid[startRow][startCol + 1] = true;
    grid[startRow + 1][startCol + 2] = true;
    grid[startRow + 2][startCol] = true;
    grid[startRow + 2][startCol + 1] = true;
    grid[startRow + 2][startCol + 2] = true;

    updateGridDisplay();
  }
}

// Count live neighbors for a cell
function countNeighbors(row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;

      // Handle wrapping around edges (toroidal grid)
      const r = (row + i + config.rows) % config.rows;
      const c = (col + j + config.cols) % config.cols;

      if (grid[r][c]) count++;
    }
  }
  return count;
}

// Update the game state for one generation
function updateGame() {
  const newGrid = Array(config.rows)
    .fill()
    .map(() => Array(config.cols).fill(false));

  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.cols; col++) {
      const neighbors = countNeighbors(row, col);
      const cell = grid[row][col];

      // Apply Conway's Game of Life rules
      // 1. Any live cell with fewer than two live neighbors dies (underpopulation)
      // 2. Any live cell with two or three live neighbors lives on
      // 3. Any live cell with more than three live neighbors dies (overpopulation)
      // 4. Any dead cell with exactly three live neighbors becomes a live cell (reproduction)

      if (cell) {
        // Rules 1-3 for live cells
        newGrid[row][col] = neighbors === 2 || neighbors === 3;
      } else {
        // Rule 4 for dead cells
        newGrid[row][col] = neighbors === 3;
      }
    }
  }

  grid = newGrid;
  updateGridDisplay();
}

// Create cells for the grid
function createCells(gridElement) {
  grid = Array(config.rows)
    .fill()
    .map(() => Array(config.cols).fill(false));

  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.cols; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.style.width = `${config.cellSize}px`;
      cell.style.height = `${config.cellSize}px`;
      cell.style.backgroundColor = "white";

      // Toggle cell state on click
      cell.addEventListener("click", () => {
        if (!running) {
          const r = parseInt(cell.dataset.row);
          const c = parseInt(cell.dataset.col);
          grid[r][c] = !grid[r][c];
          cell.style.backgroundColor = grid[r][c] ? "black" : "white";
        }
      });

      gridElement.appendChild(cell);
    }
  }
}

// Rebuild the grid when size changes
function rebuildGrid() {
  // Stop the game if it's running
  if (running) {
    stopGame();
    document.querySelector("button").textContent = "Start";
  }

  // Clear the existing grid
  const oldGrid = document.getElementById("grid");
  oldGrid.innerHTML = "";

  // Update grid template
  oldGrid.style.gridTemplateColumns = `repeat(${config.cols}, ${config.cellSize}px)`;

  // Create new cells
  createCells(oldGrid);
}

// Update the visual display of the grid
function updateGridDisplay() {
  const gridElement = document.getElementById("grid");
  const cells = gridElement.querySelectorAll(".cell");

  cells.forEach((cell) => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    cell.style.backgroundColor = grid[row][col] ? "black" : "white";
  });
}

// Initialize when the page loads
window.onload = initGame;
