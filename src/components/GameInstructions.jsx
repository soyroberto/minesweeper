import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const GameInstructions = ({ customEmoji, difficulty }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              How to Play Cat Minesweeper
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mt-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{customEmoji}</span>
                Game Rules
              </CardTitle>
              <CardDescription>
                The goal is to reveal all cells without clicking on any cats ({customEmoji})!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">🖱️ Controls</h4>
                  <ul className="text-sm space-y-1">
                    <li><strong>Left Click:</strong> Reveal a cell</li>
                    <li><strong>Right Click:</strong> Flag/unflag a suspected cat</li>
                    <li><strong>Reset Button:</strong> Start a new game</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">🔢 Numbers</h4>
                  <ul className="text-sm space-y-1">
                    <li>Numbers show how many cats are in adjacent cells</li>
                    <li>Use these clues to deduce where cats are hiding</li>
                    <li>Empty cells automatically reveal connected areas</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">🚩 Flags</h4>
                  <ul className="text-sm space-y-1">
                    <li>Right-click to place flags on suspected cats</li>
                    <li>Flags prevent accidental clicks</li>
                    <li>The counter shows remaining unflagged cats</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">🏆 Winning</h4>
                  <ul className="text-sm space-y-1">
                    <li>Reveal all non-cat cells to win</li>
                    <li>Your time will be recorded</li>
                    <li>Try different difficulties for more challenge</li>
                  </ul>
                </div>
              </div>
              
              {difficulty === 'beginner' && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">🔰 Beginner Mode Special Feature</h4>
                  <p className="text-sm text-blue-700">
                    In beginner mode, you'll get a confirmation dialog before clicking on cats. 
                    This helps prevent accidental game-ending clicks while you're learning!
                  </p>
                </div>
              )}
              
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">🏆 How to Win</h4>
                <div className="text-sm text-green-700 space-y-2">
                  <p className="font-medium">
                    <strong>Goal:</strong> Reveal ALL safe cells without clicking any {customEmoji}s
                  </p>
                  <ul className="space-y-1 ml-4">
                    <li>• <strong>Beginner:</strong> Reveal 71 out of 81 cells (avoid 10 {customEmoji}s)</li>
                    <li>• <strong>Intermediate:</strong> Reveal 216 out of 256 cells (avoid 40 {customEmoji}s)</li>
                    <li>• <strong>Expert:</strong> Reveal 381 out of 480 cells (avoid 99 {customEmoji}s)</li>
                  </ul>
                  <p className="text-xs italic">
                    💡 Watch the progress bar - when it reaches 100%, you win!
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">💡 Pro Tips</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Start by clicking corners and edges - they're usually safer</li>
                  <li>• Look for patterns: if a "1" touches only one unrevealed cell, that's a cat!</li>
                  <li>• Use flags liberally to mark confirmed cats</li>
                  <li>• Take your time - rushing leads to mistakes</li>
                  <li>• <strong>Remember:</strong> You don't need to flag all cats - just avoid clicking them!</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default GameInstructions;
