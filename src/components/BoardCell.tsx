import { cn } from "@/lib/utils";

interface BoardCellProps {
  cellId: string;
  progress: number;
  onClick: () => void;
}

const BoardCell = ({ progress, onClick }: BoardCellProps) => {
  const getProgressLevel = (progress: number): number => {
    if (progress === 0) return 0;
    if (progress <= 20) return 1;
    if (progress <= 40) return 2;
    if (progress <= 60) return 3;
    if (progress <= 80) return 4;
    return 5;
  };

  const progressLevel = getProgressLevel(progress);

  return (
    <button
      onClick={onClick}
      className={cn(
        "aspect-square rounded-lg border-2 transition-all duration-300",
        "hover:scale-105 hover:shadow-md cursor-pointer",
        "flex items-center justify-center text-xs font-semibold",
        progressLevel === 0 && "bg-progress-0 border-border hover:border-primary/30",
        progressLevel === 1 && "bg-progress-1 border-primary/30 text-foreground",
        progressLevel === 2 && "bg-progress-2 border-primary/50 text-foreground",
        progressLevel === 3 && "bg-progress-3 border-primary/70 text-white",
        progressLevel === 4 && "bg-progress-4 border-primary text-white",
        progressLevel === 5 && "bg-progress-5 border-primary text-white shadow-soft"
      )}
    >
      {progress > 0 && `${progress}%`}
    </button>
  );
};

export default BoardCell;
