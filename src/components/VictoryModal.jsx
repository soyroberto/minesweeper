import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trophy, Star, Clock, Target } from 'lucide-react';

const VictoryModal = ({ 
  isOpen, 
  onClose, 
  onNewGame,
  elapsedTime,
  difficulty,
  customEmoji 
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Auto-hide confetti after animation
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getDifficultyStats = () => {
    const stats = {
      beginner: { cells: 81, mines: 10, name: 'Beginner' },
      intermediate: { cells: 256, mines: 40, name: 'Intermediate' },
      expert: { cells: 480, mines: 99, name: 'Expert' }
    };
    return stats[difficulty] || stats.beginner;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getPerformanceMessage = () => {
    const { mines } = getDifficultyStats();
    if (elapsedTime < mines * 2) return "Lightning fast! ⚡";
    if (elapsedTime < mines * 4) return "Great speed! 🚀";
    if (elapsedTime < mines * 8) return "Well done! 👍";
    return "Victory achieved! 🎯";
  };

  const stats = getDifficultyStats();

  return (
    <>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                fontSize: `${12 + Math.random() * 8}px`,
                transform: `translateY(${100 + Math.random() * 200}vh) rotate(${Math.random() * 360}deg)`
              }}
            >
              {['🎉', '🎊', '⭐', '🏆', '🎈', customEmoji][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] text-center">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Trophy className="h-16 w-16 text-yellow-500 animate-pulse" />
                <Star className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-spin" />
              </div>
            </div>
            <DialogTitle className="text-3xl font-bold text-green-600 mb-2">
              🎉 VICTORY! 🎉
            </DialogTitle>
            <DialogDescription className="text-lg space-y-2">
              <div className="text-2xl font-bold text-gray-800">
                You found all the {customEmoji}s!
              </div>
              <div className="text-base text-gray-600">
                {getPerformanceMessage()}
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                🏆 Game Statistics
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-600">Time</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatTime(elapsedTime)}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-600">Difficulty</span>
                  </div>
                  <div className="text-lg font-bold text-purple-600">
                    {stats.name}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-600 mb-2">Challenge Completed</div>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-gray-200 rounded border"></span>
                    {stats.cells - stats.mines} cells revealed
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-lg">{customEmoji}</span>
                    {stats.mines} found safely
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Continue Playing
            </Button>
            <Button
              onClick={() => {
                onNewGame();
                onClose();
              }}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              🎮 New Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VictoryModal;
