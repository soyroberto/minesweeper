import { useState, useCallback, useEffect } from 'react';

// Game difficulty configurations
export const DIFFICULTIES = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 }
};

// Cell states
export const CELL_STATES = {
  HIDDEN: 'hidden',
  REVEALED: 'revealed',
  FLAGGED: 'flagged'
};

// Game states
export const GAME_STATES = {
  READY: 'ready',
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost'
};

export const useMinesweeper = (difficulty = 'beginner', customEmoji = '🐱') => {
  const config = DIFFICULTIES[difficulty];
  const [gameState, setGameState] = useState(GAME_STATES.READY);
  const [board, setBoard] = useState([]);
  const [mineLocations, setMineLocations] = useState(new Set());
  const [flaggedCells, setFlaggedCells] = useState(new Set());
  const [revealedCells, setRevealedCells] = useState(new Set());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [firstClick, setFirstClick] = useState(true);

  // Initialize empty board
  const initializeBoard = useCallback(() => {
    const newBoard = [];
    for (let row = 0; row < config.rows; row++) {
      const boardRow = [];
      for (let col = 0; col < config.cols; col++) {
        boardRow.push({
          row,
          col,
          isMine: false,
          neighborCount: 0,
          state: CELL_STATES.HIDDEN
        });
      }
      newBoard.push(boardRow);
    }
    return newBoard;
  }, [config.rows, config.cols]);

  // Generate random mine positions, avoiding the first clicked cell
  const generateMines = useCallback((excludeRow, excludeCol) => {
    const mines = new Set();
    const totalCells = config.rows * config.cols;
    
    while (mines.size < config.mines) {
      const randomIndex = Math.floor(Math.random() * totalCells);
      const row = Math.floor(randomIndex / config.cols);
      const col = randomIndex % config.cols;
      
      // Don't place mine on first clicked cell or its neighbors
      if (Math.abs(row - excludeRow) <= 1 && Math.abs(col - excludeCol) <= 1) {
        continue;
      }
      
      mines.add(`${row}-${col}`);
    }
    
    return mines;
  }, [config.rows, config.cols, config.mines]);

  // Calculate neighbor mine counts
  const calculateNeighborCounts = useCallback((board, mines) => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        if (mines.has(`${row}-${col}`)) {
          newBoard[row][col].isMine = true;
        } else {
          let count = 0;
          // Check all 8 neighbors
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const newRow = row + dr;
              const newCol = col + dc;
              if (
                newRow >= 0 && newRow < config.rows &&
                newCol >= 0 && newCol < config.cols &&
                mines.has(`${newRow}-${newCol}`)
              ) {
                count++;
              }
            }
          }
          newBoard[row][col].neighborCount = count;
        }
      }
    }
    
    return newBoard;
  }, [config.rows, config.cols]);

  // Flood fill algorithm for revealing empty cells
  const floodFill = useCallback((board, startRow, startCol, revealed) => {
    const stack = [[startRow, startCol]];
    const newRevealed = new Set(revealed);
    
    while (stack.length > 0) {
      const [row, col] = stack.pop();
      const cellKey = `${row}-${col}`;
      
      if (
        row < 0 || row >= config.rows ||
        col < 0 || col >= config.cols ||
        newRevealed.has(cellKey) ||
        board[row][col].isMine
      ) {
        continue;
      }
      
      newRevealed.add(cellKey);
      
      // If this cell has no neighboring mines, add its neighbors to the stack
      if (board[row][col].neighborCount === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            stack.push([row + dr, col + dc]);
          }
        }
      }
    }
    
    return newRevealed;
  }, [config.rows, config.cols]);

  // Initialize game
  const initializeGame = useCallback(() => {
    const newBoard = initializeBoard();
    setBoard(newBoard);
    setMineLocations(new Set());
    setFlaggedCells(new Set());
    setRevealedCells(new Set());
    setGameState(GAME_STATES.READY);
    setStartTime(null);
    setEndTime(null);
    setFirstClick(true);
  }, [initializeBoard]);

  // Handle cell click
  const handleCellClick = useCallback((row, col) => {
    if (gameState === GAME_STATES.WON || gameState === GAME_STATES.LOST) {
      return;
    }

    const cellKey = `${row}-${col}`;
    
    // Can't click on flagged cells
    if (flaggedCells.has(cellKey)) {
      return;
    }

    // Can't click on already revealed cells
    if (revealedCells.has(cellKey)) {
      return;
    }

    // First click - generate mines and start timer
    if (firstClick) {
      const mines = generateMines(row, col);
      const newBoard = calculateNeighborCounts(board, mines);
      setBoard(newBoard);
      setMineLocations(mines);
      setFirstClick(false);
      setGameState(GAME_STATES.PLAYING);
      setStartTime(Date.now());
      
      // Reveal the clicked cell and any connected empty cells
      const newRevealed = floodFill(newBoard, row, col, new Set());
      setRevealedCells(newRevealed);
      return;
    }

    // Check if clicked on a mine
    if (mineLocations.has(cellKey)) {
      setGameState(GAME_STATES.LOST);
      setEndTime(Date.now());
      // Reveal all mines
      setRevealedCells(new Set([...revealedCells, ...mineLocations]));
      return;
    }

    // Reveal cell and connected empty cells
    const newRevealed = floodFill(board, row, col, revealedCells);
    setRevealedCells(newRevealed);

    // Check win condition
    const totalCells = config.rows * config.cols;
    if (newRevealed.size === totalCells - config.mines) {
      setGameState(GAME_STATES.WON);
      setEndTime(Date.now());
    }
  }, [
    gameState, flaggedCells, revealedCells, firstClick, board, mineLocations,
    generateMines, calculateNeighborCounts, floodFill, config.rows, config.cols, config.mines
  ]);

  // Handle right click (flag/unflag)
  const handleCellRightClick = useCallback((row, col) => {
    if (gameState === GAME_STATES.WON || gameState === GAME_STATES.LOST) {
      return;
    }

    const cellKey = `${row}-${col}`;
    
    // Can't flag revealed cells
    if (revealedCells.has(cellKey)) {
      return;
    }

    const newFlagged = new Set(flaggedCells);
    if (flaggedCells.has(cellKey)) {
      newFlagged.delete(cellKey);
    } else {
      newFlagged.add(cellKey);
    }
    setFlaggedCells(newFlagged);
  }, [gameState, revealedCells, flaggedCells]);

  // Get remaining mine count
  const getRemainingMines = useCallback(() => {
    return config.mines - flaggedCells.size;
  }, [config.mines, flaggedCells.size]);

  // Get elapsed time
  const getElapsedTime = useCallback(() => {
    if (!startTime) return 0;
    const endTimeToUse = endTime || Date.now();
    return Math.floor((endTimeToUse - startTime) / 1000);
  }, [startTime, endTime]);

  // Initialize game on mount or difficulty change
  useEffect(() => {
    initializeGame();
  }, [initializeGame, difficulty]);

  return {
    board,
    gameState,
    mineLocations,
    flaggedCells,
    revealedCells,
    handleCellClick,
    handleCellRightClick,
    initializeGame,
    getRemainingMines,
    getElapsedTime,
    config,
    customEmoji
  };
};
