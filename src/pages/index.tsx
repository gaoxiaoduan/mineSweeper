import { IcBaselineAcUnit } from '@/components/icons/IcBaselineAcUnit';
import React, { memo } from 'react';
import Footer from '../components/Footer';
export interface BlockState {
  x: number;
  y: number;
  revealed: boolean;
  mine?: boolean;
  flagged?: boolean;
  adjacentMines: number;
}

const index = memo(() => {
  const WIGHT = 10;
  const HEIGHT = 10;
  let state = Array.from({ length: HEIGHT }, (_, y) =>
    Array.from(
      { length: WIGHT },
      (_, x): BlockState => ({
        x,
        y,
        revealed: false,
        adjacentMines: 0,
      }),
    ),
  );

  // 生成炸弹
  const generateMines = (): void => {
    for (const row of state) {
      for (const block of row) {
        block.mine = Math.random() < 0.1;
      }
    }
  };
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
  // 生成周围雷的数量
  const updateAdjacentMines = (): void => {
    state.forEach((row, y) => {
      row.forEach((block, x) => {
        direction.forEach(([dx, dy]) => {
          const x2 = x + dx;
          const y2 = y + dy;
          if (x2 >= 0 && x2 < WIGHT && y2 >= 0 && y2 < HEIGHT) {
            if (state[y2][x2].mine) {
              block.adjacentMines += 1;
            }
          }
        });
      });
    });
  };
  generateMines();
  updateAdjacentMines();

  const setBlockButtons = (block: BlockState) => {
    return (
      <button
        key={block.x}
        className="flex justify-center items-center w-9 h-9 border text-center hover:bg-gray-50"
      >
        {block.mine ? <IcBaselineAcUnit /> : block.adjacentMines}
      </button>
    );
  };

  return (
    <main className="h-[100vh] bg-white dark:bg-black font-sans p-8 text-center text-gray-700 dark:text-white">
      <h1 className="text-3xl font-bold">mine-sweeper</h1>

      <div>
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
