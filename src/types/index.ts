export interface Goal {
  id: string;
  title: string;
  createdAt: Date;
  pillars: Pillar[];
}

export interface Pillar {
  id: string;
  name: string;
  order: number;
  cells: Cell[];
}

export interface Cell {
  id: string;
  pillarId: string;
  order: number;
  progress: number; // 0-100
}

export interface Activity {
  id: string;
  goalId: string;
  message: string;
  date: Date;
  impact: number; // 1-5
  affectedCells: string[]; // cell IDs
}
