import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  customEmoji 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{customEmoji}</span>
            Careful! That's a cat!
          </DialogTitle>
          <DialogDescription className="text-base">
            You're about to click on a cat! In beginner mode, we want to make sure this is intentional. 
            Clicking on a cat will end the game.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <div className="text-6xl animate-bounce">
            {customEmoji}
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel - Keep Playing
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1"
          >
            Yes, Click the Cat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
