import { Goal, Activity, GRID_SIZE, CENTER_POSITION, KEY_AREA_POSITIONS, getTaskPositions } from "@/types";
import { cn } from "@/lib/utils";

interface HaradaGridProps {
  goal: Goal;
  activities: Activity[];
  onCellClick: (cellId: string, cellType: "goal" | "area" | "task") => void;
}

const HaradaGrid = ({ goal, activities, onCellClick }: HaradaGridProps) => {
  // Calculate progress for each task based on activities
  const getTaskProgress = (taskId: string): number => {
    const taskActivities = activities.filter(a => a.affectedTasks.includes(taskId));
    const totalImpact = taskActivities.reduce((sum, a) => sum + a.impact, 0);
    return Math.min(totalImpact * 20, 100);
  };

  const getProgressLevel = (progress: number): number => {
    if (progress === 0) return 0;
    if (progress <= 20) return 1;
    if (progress <= 40) return 2;
    if (progress <= 60) return 3;
    if (progress <= 80) return 4;
    return 5;
  };

  // Build the 9x9 grid data structure
  const buildGrid = () => {
    const grid: Array<Array<{
      type: "goal" | "area" | "task" | "empty";
      id?: string;
      content?: string;
      progress?: number;
      areaColor?: string;
    }>> = Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill(null).map(() => ({ type: "empty" as const }))
    );

    // Place goal in center
    grid[CENTER_POSITION][CENTER_POSITION] = {
      type: "goal",
      id: goal.id,
      content: goal.title,
    };

    // Area colors
    const areaColors = [
      "border-blue-500",
      "border-purple-500", 
      "border-pink-500",
      "border-red-500",
      "border-orange-500",
      "border-yellow-500",
      "border-green-500",
      "border-cyan-500",
    ];

    // Place key areas
    goal.keyAreas.forEach((area, index) => {
      const pos = KEY_AREA_POSITIONS[index];
      grid[pos.row][pos.col] = {
        type: "area",
        id: area.id,
        content: area.name,
        areaColor: areaColors[index],
      };

      // Place tasks for this area
      const taskPositions = getTaskPositions(pos.row, pos.col);
      area.tasks.forEach((task, taskIndex) => {
        const taskPos = taskPositions[taskIndex];
        if (taskPos && taskPos.row >= 0 && taskPos.row < GRID_SIZE && 
            taskPos.col >= 0 && taskPos.col < GRID_SIZE) {
          const progress = getTaskProgress(task.id);
          grid[taskPos.row][taskPos.col] = {
            type: "task",
            id: task.id,
            content: task.description,
            progress,
            areaColor: areaColors[index],
          };
        }
      });
    });

    return grid;
  };

  const grid = buildGrid();

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-grid gap-1 p-4" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(80px, 1fr))` }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const key = `${rowIndex}-${colIndex}`;
            
            if (cell.type === "empty") {
              return (
                <div
                  key={key}
                  className="aspect-square bg-muted/30 rounded border border-border/50"
                />
              );
            }

            if (cell.type === "goal") {
              return (
                <button
                  key={key}
                  onClick={() => onCellClick(cell.id!, "goal")}
                  className="aspect-square rounded-lg border-4 border-primary bg-gradient-primary p-2 flex items-center justify-center text-center hover:scale-105 transition-transform shadow-strong"
                >
                  <span className="text-sm font-bold text-white leading-tight line-clamp-3">
                    {cell.content}
                  </span>
                </button>
              );
            }

            if (cell.type === "area") {
              return (
                <button
                  key={key}
                  onClick={() => onCellClick(cell.id!, "area")}
                  className={cn(
                    "aspect-square rounded-lg border-3 bg-card p-2 flex items-center justify-center text-center hover:scale-105 transition-transform shadow-medium",
                    cell.areaColor
                  )}
                >
                  <span className="text-xs font-semibold leading-tight line-clamp-3">
                    {cell.content}
                  </span>
                </button>
              );
            }

            // Task cell
            const progressLevel = getProgressLevel(cell.progress || 0);
            return (
              <button
                key={key}
                onClick={() => onCellClick(cell.id!, "task")}
                className={cn(
                  "aspect-square rounded border-2 transition-all duration-300 p-1",
                  "hover:scale-105 hover:shadow-md cursor-pointer",
                  "flex flex-col items-center justify-center text-center gap-0.5",
                  progressLevel === 0 && "bg-progress-0 border-border hover:border-primary/30",
                  progressLevel === 1 && `bg-progress-1 ${cell.areaColor}`,
                  progressLevel === 2 && `bg-progress-2 ${cell.areaColor}`,
                  progressLevel === 3 && `bg-progress-3 ${cell.areaColor} text-white`,
                  progressLevel === 4 && `bg-progress-4 ${cell.areaColor} text-white`,
                  progressLevel === 5 && `bg-progress-5 ${cell.areaColor} text-white shadow-soft`
                )}
              >
                <span className="text-[10px] leading-tight line-clamp-2">
                  {cell.content}
                </span>
                {(cell.progress || 0) > 0 && (
                  <span className="text-[9px] font-bold">
                    {cell.progress}%
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HaradaGrid;
