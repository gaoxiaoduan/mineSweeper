import { IcBaselineAcUnit } from '@/components/icons/IcBaselineAcUnit';
import React, { memo, useState } from 'react';
import Footer from '../components/Footer';
export interface BlockState {
  x: number;
  y: number;
  revealed: boolean; // 是否翻转
  mine?: boolean; // 是否是雷
  flagged?: boolean; // 是否标记
  adjacentMines: number; // 周围雷的数量
}

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

const direction = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const dev = true;
let fistClick = true; // 标记是否为第一次点击

const index = memo(() => {
  const WIGHT = 10;
  const HEIGHT = 10;
  const [state, setState] = useState(
    Array.from({ length: HEIGHT }, (_, y) =>
      Array.from(
        { length: WIGHT },
        (_, x): BlockState => ({
          x,
          y,
          revealed: false,
          adjacentMines: 0,
        }),
      ),
    ),
  );

  // 生成炸弹
  const generateMines = (initialBlock: BlockState): void => {
    for (const row of state) {
      for (const block of row) {
        if (
          Math.abs(initialBlock.y - block.y) < 1 &&
          Math.abs(initialBlock.x - block.x) < 1
        ) {
          // 保证首次点击不会点中炸弹
          continue;
        }
        block.mine = Math.random() < 0.1;
      }
    }

    updateAdjacentMines();
    fistClick = false;
  };

  // 生成周围雷的数量
  const updateAdjacentMines = (): void => {
    state.forEach((row, y) => {
      row.forEach((block, x) => {
        if (block.mine) return;
        getSiblings(block).forEach((item) => {
          if (item.mine) {
            block.adjacentMines += 1;
          }
        });
      });
    });
    setState([...state]);
  };

  // 翻开为0的方块
  const revealEmptyBlocks = (block: BlockState): void => {
    if (block.adjacentMines) return;
    getSiblings(block).forEach((item) => {
      if (item.revealed) return;
      item.revealed = true;
      revealEmptyBlocks(item);
    });
  };

  // 获取边界
  const getSiblings = (block: BlockState) => {
    return direction
      .map(([dx, dy]) => {
        const x2 = block.x + dx;
        const y2 = block.y + dy;
        if (x2 >= 0 && x2 < WIGHT && y2 >= 0 && y2 < HEIGHT) {
          return state[y2][x2];
        }
        return undefined;
      })
      .filter(Boolean) as BlockState[];
  };

  const setClassName = (block: BlockState) => {
    if (!block.revealed) {
      return 'bg-gray-400/30';
    }
    return block.mine ? 'bg-red-300/80' : numberColor[block.adjacentMines];
  };

  const handleBlockClick = (block: BlockState) => {
    if (fistClick) {
      generateMines(block);
    }

    if (!block.revealed) {
      state[block.y][block.x].revealed = true;
      revealEmptyBlocks(block);
      setState([...state]);
    }
  };

  const setBlockButtons = (block: BlockState) => {
    return (
      <button
        key={block.x}
        className={`flex justify-center items-center w-9 h-9 m-0.5 border text-center hover:bg-gray-400/50 dark:border-gray-400/30 
        ${setClassName(block)} `}
        onClick={() => handleBlockClick(block)}
      >
        {(block.revealed || dev) &&
          (block.mine ? <IcBaselineAcUnit /> : block.adjacentMines)}
      </button>
    );
  };

  return (
    <main className="h-[100vh] bg-white dark:bg-black font-sans p-8 text-center text-gray-700 dark:text-white">
      <h1 className="text-3xl font-bold">mine-sweeper</h1>
      <div className="p-5">
        {state.map((row, y) => (
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
