export interface Goal {
  id: string;
  title: string;
  createdAt: Date;
  keyAreas: KeyArea[];
}

export interface KeyArea {
  id: string;
  name: string;
  position: number; // 0-7 (positions around center in 9x9 grid)
  tasks: Task[];
}

export interface Task {
  id: string;
  areaId: string;
  description: string;
  position: number; // 0-7 (positions around key area)
  progress: number; // 0-100
}

export interface Activity {
  id: string;
  goalId: string;
  message: string;
  date: Date;
  impact: number; // 1-5
  affectedTasks: string[]; // task IDs
}

// Grid position helpers for 9x9 Harada layout
export const GRID_SIZE = 9;
export const CENTER_POSITION = 4; // Center of 9x9 grid (index 4)

// Positions of 8 key areas around center (clockwise from top)
export const KEY_AREA_POSITIONS = [
  { row: 3, col: 4 }, // Top
  { row: 3, col: 5 }, // Top-right
  { row: 4, col: 5 }, // Right
  { row: 5, col: 5 }, // Bottom-right
  { row: 5, col: 4 }, // Bottom
  { row: 5, col: 3 }, // Bottom-left
  { row: 4, col: 3 }, // Left
  { row: 3, col: 3 }, // Top-left
];

// For each key area, the 8 positions of tasks around it (3x3 grid minus center)
export const getTaskPositions = (areaRow: number, areaCol: number) => [
  { row: areaRow - 1, col: areaCol }, // Top
  { row: areaRow - 1, col: areaCol + 1 }, // Top-right
  { row: areaRow, col: areaCol + 1 }, // Right
  { row: areaRow + 1, col: areaCol + 1 }, // Bottom-right
  { row: areaRow + 1, col: areaCol }, // Bottom
  { row: areaRow + 1, col: areaCol - 1 }, // Bottom-left
  { row: areaRow, col: areaCol - 1 }, // Left
  { row: areaRow - 1, col: areaCol - 1 }, // Top-left
];
