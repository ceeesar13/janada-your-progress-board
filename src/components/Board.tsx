import { Goal, Activity } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BoardCell from "./BoardCell";

interface BoardProps {
  goal: Goal;
  activities: Activity[];
  onAddActivity: () => void;
  onCellClick: (cellId: string) => void;
}

const Board = ({ goal, activities, onAddActivity, onCellClick }: BoardProps) => {
  // Calculate progress for each cell based on activities
  const getCellProgress = (cellId: string): number => {
    const cellActivities = activities.filter(a => a.affectedCells.includes(cellId));
    const totalImpact = cellActivities.reduce((sum, a) => sum + a.impact, 0);
    return Math.min(totalImpact * 20, 100); // Each impact point = 20% progress, max 100%
  };

  const getPillarProgress = (pillarId: string): number => {
    const pillar = goal.pillars.find(p => p.id === pillarId);
    if (!pillar) return 0;
    
    const totalProgress = pillar.cells.reduce((sum, cell) => sum + getCellProgress(cell.id), 0);
    return Math.round(totalProgress / pillar.cells.length);
  };

  const getTotalProgress = (): number => {
    const totalProgress = goal.pillars.reduce((sum, pillar) => sum + getPillarProgress(pillar.id), 0);
    return Math.round(totalProgress / goal.pillars.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-medium">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold mb-2">{goal.title}</CardTitle>
                <p className="text-muted-foreground">
                  Progreso total: <span className="text-primary font-semibold">{getTotalProgress()}%</span>
                </p>
              </div>
              <Button onClick={onAddActivity} className="gap-2">
                <Plus className="w-4 h-4" />
                Registrar actividad
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Board Grid */}
        <div className="grid gap-6">
          {goal.pillars.map((pillar) => (
            <Card key={pillar.id} className="shadow-soft">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">{pillar.name}</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {getPillarProgress(pillar.id)}% completado
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {pillar.cells.map((cell) => (
                    <BoardCell
                      key={cell.id}
                      cellId={cell.id}
                      progress={getCellProgress(cell.id)}
                      onClick={() => onCellClick(cell.id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
