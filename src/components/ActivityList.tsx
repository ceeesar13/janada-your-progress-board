import { Activity, Goal } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ActivityListProps {
  activities: Activity[];
  goal: Goal;
}

const ActivityList = ({ activities, goal }: ActivityListProps) => {
  const getImpactColor = (impact: number) => {
    if (impact <= 2) return "bg-muted text-muted-foreground";
    if (impact <= 3) return "bg-accent/20 text-accent-foreground";
    return "bg-primary/20 text-primary";
  };

  const getCellName = (cellId: string): string => {
    for (const pillar of goal.pillars) {
      const cellIndex = pillar.cells.findIndex(c => c.id === cellId);
      if (cellIndex !== -1) {
        return `${pillar.name} #${cellIndex + 1}`;
      }
    }
    return cellId;
  };

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Historial de actividades
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aún no hay actividades registradas</p>
              <p className="text-sm mt-2">Comienza a trackear tu progreso</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="border rounded-lg p-4 space-y-2 hover:shadow-soft transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium flex-1">{activity.message}</p>
                    <Badge className={getImpactColor(activity.impact)}>
                      {activity.impact}★
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {format(activity.date, "PPP", { locale: es })}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {activity.affectedCells.map((cellId) => (
                      <Badge key={cellId} variant="outline" className="text-xs">
                        {getCellName(cellId)}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityList;
