import { IcBaselineAcUnit, IcFlag } from '@/components/icons';
import { Game } from '@/composables';
import type { BlockState, GameState } from '@/types';
import React, { memo, useState } from 'react';
import Footer from '../components/Footer';

const numberColor = [
  'text-transparent',
  'text-green-300',
  'text-blue-400',
  'text-amber-400',
  'text-violet-400',
  'text-red-600',
  'text-purple-600',
  'text-orange-900',
];

let game = new Game(6, 6);
const index = memo(() => {
  const [state, setState] = useState<GameState>(game.state);

  const handleBlockClick = (block: BlockState) => {
    if (block.flagged) return;

    if (game.state.fistClick) {
      game.generateMines(block);
    }

    if (!block.revealed) {
      state.block[block.y][block.x].revealed = true;
      game.revealEmptyBlocks(block);
      setState({ ...state });
    }

    game.checkGameState();

    if (block.mine) {
      setTimeout(() => {
        alert('游戏结束');
      });
      return;
    }
  };

  const handleContextMenu = (e: React.MouseEvent, block: BlockState) => {
    e.preventDefault();
    state.block[block.y][block.x].flagged = !block.flagged;
    setState({ ...state });
    game.checkGameState();
  };

  const handleContent = (block: BlockState): React.ReactNode => {
    if (block.flagged) {
      return <IcFlag />;
    }
    if (block.revealed || state.dev) {
      return block.mine ? <IcBaselineAcUnit /> : block.adjacentMines;
    }
  };

  const setClassName = (block: BlockState) => {
    if (block.flagged) {
      return 'bg-red-400/30';
    }
    if (!block.revealed) {
      return 'bg-gray-400/30 hover:bg-gray-400/50';
    }
    return block.mine ? 'bg-red-400/30' : numberColor[block.adjacentMines];
  };

  const setBlockButtons = (block: BlockState) => {
    return (
      <button
        key={block.x}
        className={`flex justify-center items-center w-9 h-9 m-0.5 border text-center  dark:border-gray-400/30 
        ${setClassName(block)} `}
        onClick={() => handleBlockClick(block)}
        onContextMenu={(e) => handleContextMenu(e, block)}
      >
        {handleContent(block)}
      </button>
    );
  };

  // 调整等级
  const adjustmentLevel = (level: 'reset' | 'easy' | 'medium' | 'hard') => {
    switch (level) {
      case 'reset':
        game.reset();
        break;
      case 'easy':
        game.reset(9, 9);
        break;
      case 'medium':
        game.reset(16, 16);
        break;
      case 'hard':
        game.reset(30, 16);
        break;
      default:
        game.reset();
        break;
    }
    setState(game.state);
  };

  return (
    <main className="h-screen overflow-auto bg-white dark:bg-black font-sans p-8 text-center text-gray-700 dark:text-white">
      <h1 className="text-4xl font-bold">mine-sweeper</h1>
      {console.log('render')}
      <div className="flex justify-center gap-1 p-3">
        <button className="btn" onClick={() => adjustmentLevel('reset')}>
          New Game
        </button>
        <button className="btn" onClick={() => adjustmentLevel('easy')}>
          Easy
        </button>
        <button className="btn" onClick={() => adjustmentLevel('medium')}>
          Medium
        </button>
        <button className="btn" onClick={() => adjustmentLevel('hard')}>
          Hard
        </button>
      </div>

      <div className="p-5">
        {state.block.map((row, y) => (
          <div key={y} className="flex justify-center">
            {row.map((item, x) => setBlockButtons(item))}
          </div>
        ))}
      </div>
      <Footer />
    </main>
  );
});

export default index;
