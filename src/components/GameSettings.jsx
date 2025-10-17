import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DIFFICULTIES } from '../hooks/useMinesweeper';

const GameSettings = ({ 
  difficulty, 
  onDifficultyChange, 
  customEmoji, 
  onEmojiChange,
  onNewGame 
}) => {
  const [tempEmoji, setTempEmoji] = useState(customEmoji);
  const [showSettings, setShowSettings] = useState(false);

  const handleEmojiSubmit = () => {
    if (tempEmoji.trim()) {
      onEmojiChange(tempEmoji.trim());
    }
  };

  const handleDifficultySelect = (newDifficulty) => {
    onDifficultyChange(newDifficulty);
    onNewGame();
  };

  const presetEmojis = ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸', '🐵', '🐧', '🦉'];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={difficulty === 'beginner' ? 'default' : 'outline'}
          onClick={() => handleDifficultySelect('beginner')}
          className="text-sm"
        >
          Beginner (9×9, 10 {customEmoji})
        </Button>
        <Button
          variant={difficulty === 'intermediate' ? 'default' : 'outline'}
          onClick={() => handleDifficultySelect('intermediate')}
          className="text-sm"
        >
          Intermediate (16×16, 40 {customEmoji})
        </Button>
        <Button
          variant={difficulty === 'expert' ? 'default' : 'outline'}
          onClick={() => handleDifficultySelect('expert')}
          className="text-sm"
        >
          Expert (16×30, 99 {customEmoji})
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowSettings(!showSettings)}
          className="text-sm"
        >
          ⚙️ Settings
        </Button>
      </div>

      {showSettings && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Game Settings</CardTitle>
            <CardDescription>
              Customize your game experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="emoji-input" className="text-sm font-medium">
                Custom Emoji (Current: {customEmoji})
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="emoji-input"
                  value={tempEmoji}
                  onChange={(e) => setTempEmoji(e.target.value)}
                  placeholder="Enter emoji(s)"
                  className="flex-1"
                  maxLength={10}
                />
                <Button onClick={handleEmojiSubmit} size="sm">
                  Apply
                </Button>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Quick Emoji Selection
              </Label>
              <div className="grid grid-cols-5 gap-2">
                {presetEmojis.map((emoji) => (
                  <Button
                    key={emoji}
                    variant={customEmoji === emoji ? 'default' : 'outline'}
                    onClick={() => {
                      setTempEmoji(emoji);
                      onEmojiChange(emoji);
                    }}
                    className="text-lg p-2 h-10"
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button 
                onClick={onNewGame}
                className="w-full"
                variant="default"
              >
                Start New Game
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GameSettings;
