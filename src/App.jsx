import React, { useState, useEffect } from 'react';
import { useMinesweeper, GAME_STATES } from './hooks/useMinesweeper';
import GameHeader from './components/GameHeader';
import GameBoard from './components/GameBoard';
import GameSettings from './components/GameSettings';
import GameInstructions from './components/GameInstructions';
import ConfirmationDialog from './components/ConfirmationDialog';
import VictoryModal from './components/VictoryModal';
import ProgressIndicator from './components/ProgressIndicator';
import './App.css';

function App() {
  const [difficulty, setDifficulty] = useState('beginner');
  const [customEmoji, setCustomEmoji] = useState('🐱');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingCatClick, setPendingCatClick] = useState(null);
  const [showVictoryModal, setShowVictoryModal] = useState(false);

  const {
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
    config
  } = useMinesweeper(difficulty, customEmoji);

  // Show victory modal when game is won
  useEffect(() => {
    if (gameState === GAME_STATES.WON) {
      setShowVictoryModal(true);
    }
  }, [gameState]);

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  const handleEmojiChange = (newEmoji) => {
    setCustomEmoji(newEmoji);
  };

  const handleCatClick = (clickAction) => {
    setPendingCatClick(() => clickAction);
    setShowConfirmation(true);
  };

  const handleConfirmCatClick = () => {
    if (pendingCatClick) {
      pendingCatClick();
      setPendingCatClick(null);
    }
  };

  const handleCancelCatClick = () => {
    setPendingCatClick(null);
    setShowConfirmation(false);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Cat Minesweeper {customEmoji}
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Reveal all safe cells without clicking any {customEmoji}s to win!
          </p>
          <p className="text-sm text-gray-500">
            💡 Watch the progress bar to see how close you are to victory
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <GameSettings
            difficulty={difficulty}
            onDifficultyChange={handleDifficultyChange}
            customEmoji={customEmoji}
            onEmojiChange={handleEmojiChange}
            onNewGame={initializeGame}
          />

          <GameInstructions
            customEmoji={customEmoji}
            difficulty={difficulty}
          />

          <div className="flex flex-col items-center">
            <GameHeader
              gameState={gameState}
              getRemainingMines={getRemainingMines}
              getElapsedTime={getElapsedTime}
              onReset={initializeGame}
              customEmoji={customEmoji}
            />

            <ProgressIndicator
              gameState={gameState}
              revealedCells={revealedCells}
              config={config}
              customEmoji={customEmoji}
            />

            <div className="mb-6">
              <GameBoard
                board={board}
                gameState={gameState}
                mineLocations={mineLocations}
                flaggedCells={flaggedCells}
                revealedCells={revealedCells}
                handleCellClick={handleCellClick}
                handleCellRightClick={handleCellRightClick}
                customEmoji={customEmoji}
                difficulty={difficulty}
                onCatClick={handleCatClick}
              />
            </div>

            <div className="text-center text-sm text-gray-500 max-w-md">
              <p className="mb-2">
                <strong>How to play:</strong> Left-click to reveal cells, right-click to flag {customEmoji}s.
              </p>
              <p>
                Numbers show how many {customEmoji}s are adjacent to that cell.
                {difficulty === 'beginner' && ' In beginner mode, you\'ll get a confirmation before clicking cats!'}
              </p>
            </div>
          </div>
        </div>

        <ConfirmationDialog
          isOpen={showConfirmation}
          onClose={handleCancelCatClick}
          onConfirm={handleConfirmCatClick}
          customEmoji={customEmoji}
        />

        <VictoryModal
          isOpen={showVictoryModal}
          onClose={() => setShowVictoryModal(false)}
          onNewGame={initializeGame}
          elapsedTime={getElapsedTime()}
          difficulty={difficulty}
          customEmoji={customEmoji}
        />
      </div>
    </div>
  );
}

export default App;
