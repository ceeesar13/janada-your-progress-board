import { Goal, Activity } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import HaradaGrid from "./HaradaGrid";

interface BoardProps {
  goal: Goal;
  activities: Activity[];
  onAddActivity: () => void;
  onCellClick: (cellId: string, cellType: "goal" | "area" | "task") => void;
}

const Board = ({ goal, activities, onAddActivity, onCellClick }: BoardProps) => {
  // Calculate progress for each task based on activities
  const getTaskProgress = (taskId: string): number => {
    const taskActivities = activities.filter(a => a.affectedTasks.includes(taskId));
    const totalImpact = taskActivities.reduce((sum, a) => sum + a.impact, 0);
    return Math.min(totalImpact * 20, 100);
  };

  const getAreaProgress = (areaId: string): number => {
    const area = goal.keyAreas.find(a => a.id === areaId);
    if (!area || area.tasks.length === 0) return 0;
    
    const totalProgress = area.tasks.reduce((sum, task) => sum + getTaskProgress(task.id), 0);
    return Math.round(totalProgress / area.tasks.length);
  };

  const getTotalProgress = (): number => {
    if (goal.keyAreas.length === 0) return 0;
    const totalProgress = goal.keyAreas.reduce((sum, area) => sum + getAreaProgress(area.id), 0);
    return Math.round(totalProgress / goal.keyAreas.length);
  };

  const totalTasks = goal.keyAreas.reduce((sum, area) => sum + area.tasks.length, 0);
  const completedTasks = goal.keyAreas.reduce((sum, area) => 
    sum + area.tasks.filter(task => getTaskProgress(task.id) >= 100).length, 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-medium">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-bold mb-1">{goal.title}</CardTitle>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Progreso total: <span className="text-primary font-semibold">{getTotalProgress()}%</span></span>
                    <span>Tareas: <span className="font-semibold">{completedTasks}/{totalTasks}</span></span>
                  </div>
                </div>
              </div>
              <Button onClick={onAddActivity} className="gap-2">
                <Plus className="w-4 h-4" />
                Registrar actividad
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Harada Grid 9x9 */}
        <Card className="shadow-soft overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Método Harada - Grid 9×9</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Centro: Objetivo principal • 8 áreas clave alrededor • 64 tareas distribuidas (8 por área)
            </p>
          </CardHeader>
          <CardContent className="p-2">
            <HaradaGrid goal={goal} activities={activities} onCellClick={onCellClick} />
          </CardContent>
        </Card>

        {/* Progress by Area */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Progreso por Área Clave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {goal.keyAreas.map((area) => {
                const progress = getAreaProgress(area.id);
                const completedInArea = area.tasks.filter(t => getTaskProgress(t.id) >= 100).length;
                
                return (
                  <div key={area.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{area.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {completedInArea}/{area.tasks.length} tareas
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-primary h-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-right text-muted-foreground">{progress}%</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Board;
