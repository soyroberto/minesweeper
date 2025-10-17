import React from 'react';
import { CELL_STATES, GAME_STATES } from '../hooks/useMinesweeper';

const GameBoard = ({ 
  board, 
  gameState, 
  mineLocations, 
  flaggedCells, 
  revealedCells, 
  handleCellClick, 
  handleCellRightClick,
  customEmoji,
  difficulty,
  onCatClick
}) => {
  const getCellContent = (cell) => {
    const cellKey = `${cell.row}-${cell.col}`;
    
    // Show flag if flagged
    if (flaggedCells.has(cellKey)) {
      return '🚩';
    }
    
    // Show content if revealed
    if (revealedCells.has(cellKey)) {
      if (cell.isMine) {
        return customEmoji;
      }
      if (cell.neighborCount > 0) {
        return cell.neighborCount;
      }
      return '';
    }
    
    // Hidden cell
    return '';
  };

  const getCellClasses = (cell) => {
    const cellKey = `${cell.row}-${cell.col}`;
    const baseClasses = 'game-cell w-8 h-8 border border-gray-400 flex items-center justify-center text-sm font-bold cursor-pointer';
    
    if (revealedCells.has(cellKey)) {
      if (cell.isMine) {
        return `${baseClasses} mine bg-red-500 text-white`;
      }
      return `${baseClasses} revealed bg-gray-200 text-gray-800`;
    }
    
    if (flaggedCells.has(cellKey)) {
      return `${baseClasses} flagged bg-yellow-200`;
    }
    
    return `${baseClasses} bg-gray-100`;
  };

  const getNumberColor = (count) => {
    const colors = {
      1: 'text-blue-600',
      2: 'text-green-600', 
      3: 'text-red-600',
      4: 'text-purple-600',
      5: 'text-yellow-600',
      6: 'text-pink-600',
      7: 'text-black',
      8: 'text-gray-600'
    };
    return colors[count] || 'text-black';
  };

  const handleClick = (cell) => {
    const cellKey = `${cell.row}-${cell.col}`;
    
    // Check if clicking on a cat in beginner mode
    if (difficulty === 'beginner' && mineLocations.has(cellKey) && !flaggedCells.has(cellKey)) {
      onCatClick(() => handleCellClick(cell.row, cell.col));
      return;
    }
    
    handleCellClick(cell.row, cell.col);
  };

  const handleRightClick = (e, cell) => {
    e.preventDefault();
    handleCellRightClick(cell.row, cell.col);
  };

  return (
    <div className="game-board inline-block">
      <div 
        className="grid gap-0"
        style={{ 
          gridTemplateColumns: `repeat(${board[0]?.length || 0}, 1fr)`,
          gridTemplateRows: `repeat(${board.length}, 1fr)`
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const cellKey = `${cell.row}-${cell.col}`;
            const content = getCellContent(cell);
            const isNumber = typeof content === 'number';
            
            return (
              <div
                key={cellKey}
                className={`${getCellClasses(cell)} ${isNumber ? getNumberColor(content) : ''}`}
                onClick={() => handleClick(cell)}
                onContextMenu={(e) => handleRightClick(e, cell)}
                style={{ 
                  minWidth: '32px', 
                  minHeight: '32px',
                  fontSize: isNumber ? '14px' : '16px'
                }}
              >
                {content}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GameBoard;
