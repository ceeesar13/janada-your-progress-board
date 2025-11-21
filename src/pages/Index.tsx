import { useState } from "react";
import { Goal, Activity, Pillar, Cell } from "@/types";
import GoalForm from "@/components/GoalForm";
import Board from "@/components/Board";
import ActivityForm from "@/components/ActivityForm";
import ActivityList from "@/components/ActivityList";
import { toast } from "sonner";

const Index = () => {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isActivityFormOpen, setIsActivityFormOpen] = useState(false);

  const handleGoalCreated = (goalTitle: string, pillarNames: string[]) => {
    const pillars: Pillar[] = pillarNames.map((name, index) => ({
      id: `pillar-${index}`,
      name,
      order: index,
      cells: Array.from({ length: 8 }, (_, cellIndex) => ({
        id: `pillar-${index}-cell-${cellIndex}`,
        pillarId: `pillar-${index}`,
        order: cellIndex,
        progress: 0,
      })),
    }));

    const newGoal: Goal = {
      id: "goal-1",
      title: goalTitle,
      createdAt: new Date(),
      pillars,
    };

    setGoal(newGoal);
    toast.success("¡Tablero creado exitosamente!");
  };

  const handleActivitySubmit = (activityData: {
    message: string;
    date: Date;
    impact: number;
    affectedCells: string[];
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

  if (!goal) {
    return <GoalForm onGoalCreated={handleGoalCreated} />;
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 p-4 md:p-6">
      <div className="lg:col-span-2">
        <Board
          goal={goal}
          activities={activities}
          onAddActivity={() => setIsActivityFormOpen(true)}
          onCellClick={(cellId) => {
            console.log("Cell clicked:", cellId);
          }}
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
