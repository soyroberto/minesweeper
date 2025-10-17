import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GAME_STATES } from '../hooks/useMinesweeper';

const GameHeader = ({ 
  gameState, 
  getRemainingMines, 
  getElapsedTime, 
  onReset,
  customEmoji 
}) => {
  const [displayTime, setDisplayTime] = useState(0);

  // Update timer display
  useEffect(() => {
    let interval;
    if (gameState === GAME_STATES.PLAYING) {
      interval = setInterval(() => {
        setDisplayTime(getElapsedTime());
      }, 1000);
    } else {
      setDisplayTime(getElapsedTime());
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, getElapsedTime]);

  const getFaceEmoji = () => {
    switch (gameState) {
      case GAME_STATES.WON:
        return '😎';
      case GAME_STATES.LOST:
        return '😵';
      case GAME_STATES.PLAYING:
        return '😮';
      default:
        return '🙂';
    }
  };

  const formatTime = (seconds) => {
    return seconds.toString().padStart(3, '0');
  };

  const formatMineCount = (count) => {
    return Math.max(0, count).toString().padStart(3, '0');
  };

  return (
    <div className="game-header flex items-center justify-between p-4 mb-4">
      {/* Mine Counter */}
      <div className="flex items-center space-x-2">
        <span className="text-lg">{customEmoji}</span>
        <div className="digital-display px-2 py-1 text-lg font-bold min-w-[3rem] text-center">
          {formatMineCount(getRemainingMines())}
        </div>
      </div>

      {/* Reset Button */}
      <Button
        onClick={onReset}
        className="text-2xl p-2 bg-gray-200 hover:bg-gray-100 border-2 border-gray-400"
        variant="outline"
      >
        {getFaceEmoji()}
      </Button>

      {/* Timer */}
      <div className="flex items-center space-x-2">
        <span className="text-lg">⏱️</span>
        <div className="digital-display px-2 py-1 text-lg font-bold min-w-[3rem] text-center">
          {formatTime(displayTime)}
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
