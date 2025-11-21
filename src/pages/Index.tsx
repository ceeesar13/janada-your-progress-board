import { useState } from "react";
import { Goal, Activity, KeyArea, Task } from "@/types";
import GoalForm from "@/components/GoalForm";
import Board from "@/components/Board";
import ActivityForm from "@/components/ActivityForm";
import ActivityList from "@/components/ActivityList";
import { toast } from "sonner";

const Index = () => {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isActivityFormOpen, setIsActivityFormOpen] = useState(false);

  const handleGoalCreated = (goalTitle: string, areaNames: string[]) => {
    // Create 8 key areas, each with 8 tasks
    const keyAreas: KeyArea[] = areaNames.map((name, index) => {
      const tasks: Task[] = Array.from({ length: 8 }, (_, taskIndex) => ({
        id: `area-${index}-task-${taskIndex}`,
        areaId: `area-${index}`,
        description: `Tarea ${taskIndex + 1}`,
        position: taskIndex,
        progress: 0,
      }));

      return {
        id: `area-${index}`,
        name,
        position: index,
        tasks,
      };
    });

    const newGoal: Goal = {
      id: "goal-1",
      title: goalTitle,
      createdAt: new Date(),
      keyAreas,
    };

    setGoal(newGoal);
    toast.success("¡Objetivo y grid Harada creados! Ahora define tus 64 tareas");
  };

  const handleActivitySubmit = (activityData: {
    message: string;
    date: Date;
    impact: number;
    affectedTasks: string[];
  }) => {
    if (!goal) return;

    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      goalId: goal.id,
      ...activityData,
    };

    setActivities((prev) => [newActivity, ...prev]);
    toast.success("Actividad registrada");
  };

  const handleCellClick = (cellId: string, cellType: "goal" | "area" | "task") => {
    console.log(`Clicked ${cellType}:`, cellId);
    // Future: Could open edit modal based on cell type
  };

  if (!goal) {
    return <GoalForm onGoalCreated={handleGoalCreated} />;
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 p-4 md:p-6 bg-background">
      <div className="lg:col-span-2">
        <Board
          goal={goal}
          activities={activities}
          onAddActivity={() => setIsActivityFormOpen(true)}
          onCellClick={handleCellClick}
        />
      </div>
      
      <div className="lg:col-span-1">
        <ActivityList activities={activities} goal={goal} />
      </div>

      <ActivityForm
        open={isActivityFormOpen}
        onClose={() => setIsActivityFormOpen(false)}
        goal={goal}
        onSubmit={handleActivitySubmit}
      />
    </div>
  );
};

export default Index;
