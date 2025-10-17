# Development Guide

This guide provides detailed information for developers who want to contribute to or modify the Cat Minesweeper game.

## 🏗️ Architecture Overview

### Component Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components (Shadcn/ui)
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── dialog.jsx
│   │   ├── progress.jsx
│   │   └── ...
│   ├── ConfirmationDialog.jsx # Beginner mode confirmation
│   ├── GameBoard.jsx          # Main game grid component
│   ├── GameHeader.jsx         # Timer, counter, reset button
│   ├── GameInstructions.jsx   # Collapsible instructions panel
│   ├── GameSettings.jsx       # Emoji customization panel
│   ├── ProgressIndicator.jsx  # Real-time progress tracking
│   └── VictoryModal.jsx       # Victory celebration modal
├── hooks/
│   └── useMinesweeper.js      # Core game logic hook
├── App.jsx                    # Main application component
├── App.css                    # Custom styles and animations
└── main.jsx                   # Application entry point
```

### Game Logic Flow

1. **Initialization** (`useMinesweeper.js`)
   - Generate mine positions
   - Create empty board state
   - Set game to READY state

2. **First Click** 
   - Ensure first click is never a mine
   - Start timer
   - Set game to PLAYING state

3. **Cell Revelation**
   - Flood-fill algorithm for empty cells
   - Update revealed cells set
   - Check win/lose conditions

4. **Victory Detection**
   - Compare revealed cells count to safe cells total
   - Trigger victory modal and celebration

## 🎮 Game States

```javascript
const GAME_STATES = {
  READY: 'ready',     // Initial state, waiting for first click
  PLAYING: 'playing', // Game in progress
  WON: 'won',         // All safe cells revealed
  LOST: 'lost'        // Mine clicked, game over
};
```

## 🧩 Key Algorithms

### Mine Generation
```javascript
const generateMines = (rows, cols, mineCount, firstClickRow, firstClickCol) => {
  const mines = new Set();
  const excludePositions = getAdjacentPositions(firstClickRow, firstClickCol, rows, cols);
  
  while (mines.size < mineCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    const key = `${row}-${col}`;
    
    if (!excludePositions.has(key)) {
      mines.add(key);
    }
  }
  
  return mines;
};
```

### Flood Fill Algorithm
```javascript
const revealCell = (row, col) => {
  if (gameState !== GAME_STATES.PLAYING) return;
  
  const key = `${row}-${col}`;
  if (revealedCells.has(key) || flaggedCells.has(key)) return;
  
  const newRevealed = new Set(revealedCells);
  const queue = [[row, col]];
  
  while (queue.length > 0) {
    const [currentRow, currentCol] = queue.shift();
    const currentKey = `${currentRow}-${currentCol}`;
    
    if (newRevealed.has(currentKey)) continue;
    newRevealed.add(currentKey);
    
    const adjacentMines = countAdjacentMines(currentRow, currentCol);
    if (adjacentMines === 0) {
      // Add adjacent cells to queue for revelation
      getAdjacentPositions(currentRow, currentCol, config.rows, config.cols)
        .forEach(adjKey => {
          const [adjRow, adjCol] = adjKey.split('-').map(Number);
          if (!newRevealed.has(adjKey) && !flaggedCells.has(adjKey)) {
            queue.push([adjRow, adjCol]);
          }
        });
    }
  }
  
  setRevealedCells(newRevealed);
};
```

### Victory Condition
```javascript
const checkWinCondition = () => {
  const totalCells = config.rows * config.cols;
  const safeCells = totalCells - config.mines;
  return revealedCells.size === safeCells;
};
```

## 🎨 Styling System

### Tailwind CSS Classes
The game uses a comprehensive Tailwind CSS setup with custom animations:

```css
/* Custom animations in App.css */
@keyframes celebration {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.celebration {
  animation: celebration 0.6s ease-in-out infinite;
}

/* Cell hover effects */
.cell-hover:hover {
  @apply bg-gray-100 border-gray-400 transform scale-105 transition-all duration-150;
}

/* Mine reveal animation */
.mine-reveal {
  @apply bg-red-500 animate-pulse;
}
```

### Component Styling Patterns
- **Cards**: `bg-white rounded-lg shadow-sm border`
- **Buttons**: `px-4 py-2 rounded-md font-medium transition-colors`
- **Grid cells**: `w-8 h-8 border border-gray-300 flex items-center justify-center`
- **Progress indicators**: `bg-gradient-to-r from-blue-500 to-green-500`

## 🔧 Configuration

### Difficulty Settings
```javascript
const DIFFICULTY_CONFIGS = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 }
};
```

### Emoji Presets
```javascript
const EMOJI_PRESETS = [
  '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', 
  '🐯', '🦁', '🐸', '🐵', '🐔', '🐧', '🦆'
];
```

## 🧪 Testing Strategy

### Manual Testing Checklist
- [ ] All difficulty levels work correctly
- [ ] Emoji customization functions properly
- [ ] Progress indicator updates in real-time
- [ ] Victory modal appears with correct statistics
- [ ] Beginner confirmation dialog works
- [ ] Right-click flagging functions
- [ ] Timer starts and stops correctly
- [ ] Mine counter updates with flags
- [ ] Responsive design on mobile devices

### Key Test Scenarios
1. **First Click Safety**: Ensure first click never hits a mine
2. **Flood Fill**: Test empty area revelation
3. **Victory Condition**: Complete games at each difficulty
4. **Edge Cases**: Corner and edge cell interactions
5. **State Management**: Game reset and state transitions

## 🚀 Performance Considerations

### Optimization Techniques
- **Memoization**: Use React.memo for expensive components
- **State Updates**: Batch state updates where possible
- **Event Handling**: Debounce rapid click events
- **Rendering**: Virtualize large grids for expert mode

### Memory Management
- Clean up timers on component unmount
- Use Sets for efficient cell tracking
- Minimize re-renders with proper dependency arrays

## 🔄 State Management

### Hook Dependencies
```javascript
// useMinesweeper.js dependencies
useEffect(() => {
  // Initialize game when difficulty changes
}, [difficulty]);

useEffect(() => {
  // Check win condition when revealed cells change
}, [revealedCells, config]);

useEffect(() => {
  // Update timer every second during play
}, [gameState]);
```

### Component Communication
- **Props down**: Configuration and state
- **Callbacks up**: User actions and events
- **Context**: Could be added for global game settings

## 📱 Responsive Design

### Breakpoints
- **Mobile**: `< 640px` - Single column layout
- **Tablet**: `640px - 1024px` - Adjusted grid sizing
- **Desktop**: `> 1024px` - Full layout with sidebars

### Mobile Optimizations
- Touch-friendly cell sizes (minimum 44px)
- Simplified right-click (long press)
- Collapsible instruction panels
- Optimized modal sizing

## 🔧 Build Configuration

### Vite Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-progress']
        }
      }
    }
  }
});
```

### Deployment Considerations
- Static site generation
- Asset optimization
- Browser compatibility
- CDN configuration

## 🐛 Common Issues & Solutions

### Performance Issues
- **Large grids**: Consider virtualization for expert mode
- **Memory leaks**: Ensure proper cleanup of timers and events
- **Re-renders**: Use React DevTools to identify unnecessary renders

### Browser Compatibility
- **Right-click handling**: Different browsers handle context menus differently
- **Touch events**: Mobile devices need special touch handling
- **CSS Grid**: Ensure fallbacks for older browsers

### State Synchronization
- **Race conditions**: Ensure state updates are properly sequenced
- **Stale closures**: Use functional state updates where needed
- **Effect dependencies**: Keep dependency arrays accurate

## 📚 Further Reading

- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Minesweeper Algorithm Analysis](https://en.wikipedia.org/wiki/Minesweeper_(video_game))

---

Happy coding! 🎮✨
