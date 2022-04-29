import type { BlockState, GameState, gameStatus } from '@/types';
import { generateConfig, loseSnow, winRitual } from './confetti';
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
    width: 9,
    height: 9,
    mines: 10,
    block: [],
  };

  constructor(width: number, height: number, mines: number) {
    this.reset(width, height, mines);
  }

  get blocks() {
    return this.state.block.flat();
  }

  reset(
    width = this.state.width,
    height = this.state.height,
    mines = this.state.mines,
  ) {
    this.state = {
      width,
      height,
      mines,
      mineGenerated: false,
      gameStatus: 'ready', //游戏状态
      dev: false, // 开发者模式
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

  // 点击事件
  handleBlockClick = (block: BlockState) => {
    if (this.state.gameStatus === 'ready') {
      this.state.gameStatus = 'playing';
    }

    if (this.state.gameStatus !== 'playing' || block.flagged) return;

    if (!this.state.mineGenerated) {
      this.generateMines(block);
      this.state.mineGenerated = true;
    }

    if (!block.revealed) {
      this.state.block[block.y][block.x].revealed = true;
    }

    this.checkGameState();

    if (block.mine) {
      this.gameOver('lose');
      return;
    }

    this.revealEmptyBlocks(block);
  };

  // 鼠标右键点击事件
  handleContextMenu = (block: BlockState) => {
    if (this.state.gameStatus !== 'playing') return;
    this.state.block[block.y][block.x].flagged = !block.flagged;
    this.checkGameState();
  };

  mineReset = () => {
    if (!this.state.mineGenerated) {
      return this.state.mines;
    }
    return this.blocks.reduce(
      (a, b) => a - (b.flagged ? 1 : 0),
      this.state.mines,
    );
  };

  // 双击自动展开
  autoExpand = (block: BlockState) => {
    if (this.state.gameStatus !== 'playing' || block.flagged) return;

    const siblings = this.getSiblings(block);
    const flags = siblings.reduce((a, b) => a + (b.flagged ? 1 : 0), 0);
    const notRevealed = siblings.reduce(
      (a, b) => a + (!b.revealed && !b.flagged ? 1 : 0),
      0,
    );
    if (flags === block.adjacentMines) {
      siblings.forEach((i) => {
        if (i.revealed || i.flagged) return;
        i.revealed = true;
        this.revealEmptyBlocks(i);
        if (i.mine) this.gameOver('lose');
      });
    }
    const missingFlags = block.adjacentMines - flags;
    if (notRevealed === missingFlags) {
      siblings.forEach((i) => {
        if (!i.revealed && !i.flagged) i.flagged = true;
      });
    }
  };

  // 生成范围
  generateRangeInt(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min);
  }

  // 生成炸弹
  generateMines = (initialBlock: BlockState): void => {
    const randomGenerator = () => {
      const x = this.generateRangeInt(0, this.state.width - 1);
      const y = this.generateRangeInt(0, this.state.height - 1);
      const block = this.state.block[y][x];
      if (
        Math.abs(initialBlock.y - block.y) < 1 &&
        Math.abs(initialBlock.x - block.x) < 1
      ) {
        return false;
      }
      if (block.mine) return false;
      block.mine = true;
      return true;
    };

    // 生成炸弹
    new Array(this.state.mines).fill(0).forEach(() => {
      while (!randomGenerator()) {}
    });

    this.updateAdjacentMines();
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
    if (this.state.gameStatus !== 'playing') return;
    if (block.adjacentMines) return;
    this.getSiblings(block).forEach((item) => {
      if (item.revealed) return;
      if (item.flagged) return;
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
    // const flats = this.state.block.flat();
    if (!this.blocks.some((block) => !block.mine && !block.revealed)) {
      this.gameOver('win');
    }
  };

  showAllMines = () => {
    this.blocks.forEach((block) => {
      if (block.mine) {
        block.revealed = true;
      }
    });
  };

  gameOver = (status: gameStatus) => {
    this.state.gameStatus = status;
    if (status === 'lose') {
      this.showAllMines();
      generateConfig();
      loseSnow();
      setTimeout(() => {
        alert('游戏结束');
      }, 500);
    } else if (status === 'win') {
      this.state.gameStatus = 'win';
      winRitual();
      setTimeout(() => {
        alert('游戏胜利');
      });
    }
  };
}
