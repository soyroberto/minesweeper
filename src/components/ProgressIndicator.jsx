import React from 'react';
import { Progress } from '@/components/ui/progress';
import { GAME_STATES } from '../hooks/useMinesweeper';

const ProgressIndicator = ({ 
  gameState, 
  revealedCells, 
  config, 
  customEmoji 
}) => {
  const totalSafeCells = (config.rows * config.cols) - config.mines;
  const revealedSafeCells = revealedCells.size;
  const progressPercentage = totalSafeCells > 0 ? (revealedSafeCells / totalSafeCells) * 100 : 0;
  
  const getProgressColor = () => {
    if (gameState === GAME_STATES.WON) return 'bg-green-500';
    if (gameState === GAME_STATES.LOST) return 'bg-red-500';
    if (progressPercentage < 25) return 'bg-blue-500';
    if (progressPercentage < 50) return 'bg-yellow-500';
    if (progressPercentage < 75) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStatusMessage = () => {
    if (gameState === GAME_STATES.READY) {
      return `Click any cell to start! Find all ${config.mines} ${customEmoji}s.`;
    }
    if (gameState === GAME_STATES.WON) {
      return `🎉 Perfect! All ${totalSafeCells} safe cells revealed!`;
    }
    if (gameState === GAME_STATES.LOST) {
      return `💥 Game Over! You found a ${customEmoji}. Try again!`;
    }
    
    const remaining = totalSafeCells - revealedSafeCells;
    if (remaining === 0) {
      return `🎯 Victory! All safe cells revealed!`;
    }
    if (remaining <= 5) {
      return `🔥 Almost there! Only ${remaining} cells left to reveal!`;
    }
    if (remaining <= 15) {
      return `⚡ Getting close! ${remaining} cells remaining.`;
    }
    
    return `🎮 Progress: ${revealedSafeCells}/${totalSafeCells} safe cells revealed (${remaining} to go)`;
  };

  const getProgressIcon = () => {
    if (gameState === GAME_STATES.WON) return '🏆';
    if (gameState === GAME_STATES.LOST) return '💥';
    if (progressPercentage >= 90) return '🔥';
    if (progressPercentage >= 75) return '⚡';
    if (progressPercentage >= 50) return '🎯';
    if (progressPercentage >= 25) return '🎮';
    return '🚀';
  };

  if (gameState === GAME_STATES.READY) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-medium text-blue-800 mb-2">
            🎮 Ready to Play!
          </div>
          <div className="text-sm text-blue-600">
            {getStatusMessage()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{getProgressIcon()}</span>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">
              Game Progress
            </span>
            <span className="text-sm font-bold text-gray-900">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2"
          />
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-sm font-medium text-gray-800">
          {getStatusMessage()}
        </div>
        
        {gameState === GAME_STATES.PLAYING && (
          <div className="text-xs text-gray-500 mt-1">
            💡 Tip: Reveal all {totalSafeCells} safe cells without clicking any {customEmoji}s to win!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressIndicator;
