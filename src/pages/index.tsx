import { IcBaselineAcUnit, IcFlag } from '@/components/icons';
import { Game,winRitual } from '@/composables';
import type { BlockState, GameState } from '@/types';
import { useLocalStorageState } from 'ahooks';
import React, { memo } from 'react';
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

let game = new Game(9, 9, 10);
const index = memo(() => {
  const [state, setState] = useLocalStorageState<GameState>('mineSweeper', {
    defaultValue: game.state,
  });

  const onclick = (block: BlockState) => {
    winRitual();
    game.handleBlockClick(block);
    setState({ ...game.state });
  };

  const onContextMenu = (e: React.MouseEvent, block: BlockState) => {
    e.preventDefault();
    game.handleContextMenu(block);
    setState({ ...game.state });
  };

  const onDoubleClick = (block: BlockState) => {
    game.autoExpand(block);
    setState({ ...game.state });
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
    return block.mine ? 'bg-red-600/30' : numberColor[block.adjacentMines];
  };

  const setBlockButtons = (block: BlockState) => {
    return (
      <button
        key={block.x}
        className={`flex justify-center items-center w-9 h-9 m-0.5 border text-center border-gray-400/30 
        ${setClassName(block)} `}
        onClick={() => onclick(block)}
        onContextMenu={(e) => onContextMenu(e, block)}
        onDoubleClick={() => onDoubleClick(block)}
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
        game.reset(9, 9, 10);
        break;
      case 'medium':
        game.reset(16, 16, 40);
        break;
      case 'hard':
        game.reset(30, 16, 99);
        break;
      default:
        game.reset();
        break;
    }
    setState({ ...game.state });
  };

  return (
    <main className="h-screen overflow-auto bg-light dark:bg-dark font-sans p-8 text-center text-white">
      <h1 className="text-4xl font-bold">mine-sweeper</h1>
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

      <div className="flex justify-center">
        <div className="flex justify-center items-center gap-2 text-3xl">
          <IcBaselineAcUnit /> {game.mineReset()}
        </div>
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
