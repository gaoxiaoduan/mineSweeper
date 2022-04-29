export interface BlockState {
  x: number;
  y: number;
  revealed: boolean; // 是否翻转
  mine?: boolean; // 是否是雷
  flagged?: boolean; // 是否标记
  adjacentMines: number; // 周围雷的数量
}

export type gameStatus = 'ready' | 'playing' | 'win' | 'lose';
export interface GameState {
  block: BlockState[][];
  width: number;
  height: number;
  mines: number;
  mineGenerated?: boolean;
  gameStatus?: gameStatus;
  dev?: boolean;
}
