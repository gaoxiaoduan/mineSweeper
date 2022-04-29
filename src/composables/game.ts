import type { BlockState, GameState } from '@/types';

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

export class Game {
  state: GameState = {
    width: 0,
    height: 0,
    block: [],
    fistClick: true, //标记是否为第一次点击
    dev: false, //开发者模式
  };

  constructor(width: number, height: number) {
    this.reset(width, height);
  }

  reset(width = this.state.width, height = this.state.height) {
    this.state = {
      width,
      height,
      fistClick: true,
      dev: true, // 开发者模式
      block: Array.from({ length: height }, (_, y) =>
        Array.from(
          { length: width },
          (_, x): BlockState => ({
            x,
            y,
            adjacentMines: 0,
            revealed: false,
          }),
        ),
      ),
    };
  }

  // 生成炸弹
  generateMines = (initialBlock: BlockState): void => {
    for (const row of this.state.block) {
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

    this.updateAdjacentMines();
    this.state.fistClick = false;
  };

  // 生成周围雷的数量
  updateAdjacentMines = (): void => {
    this.state.block.forEach((row, y) => {
      row.forEach((block, x) => {
        if (block.mine) return;
        this.getSiblings(block).forEach((item) => {
          if (item.mine) {
            block.adjacentMines += 1;
          }
        });
      });
    });
  };

  // 翻开为0的方块
  revealEmptyBlocks = (block: BlockState): void => {
    if (block.adjacentMines) return;
    this.getSiblings(block).forEach((item) => {
      if (item.revealed) return;
      item.revealed = true;
      this.revealEmptyBlocks(item);
    });
  };

  // 获取边界
  getSiblings = (block: BlockState) => {
    return direction
      .map(([dx, dy]) => {
        const x2 = block.x + dx;
        const y2 = block.y + dy;
        if (
          x2 >= 0 &&
          x2 < this.state.width &&
          y2 >= 0 &&
          y2 < this.state.height
        ) {
          return this.state.block[y2][x2];
        }
        return undefined;
      })
      .filter(Boolean) as BlockState[];
  };

  checkGameState = () => {
    const flats = this.state.block.flat();

    if (!flats.some((block) => !block.mine && !block.revealed)) {
      setTimeout(() => {
        alert('游戏胜利');
      });
    }
  };
}
