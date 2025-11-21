import { useState } from "react";
import { Goal } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActivityFormProps {
  open: boolean;
  onClose: () => void;
  goal: Goal;
  onSubmit: (activity: {
    message: string;
    date: Date;
    impact: number;
    affectedTasks: string[];
  }) => void;
}

const ActivityForm = ({ open, onClose, goal, onSubmit }: ActivityFormProps) => {
  const [message, setMessage] = useState("");
  const [impact, setImpact] = useState<string>("3");
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  const handleTaskToggle = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && selectedTasks.size > 0) {
      onSubmit({
        message,
        date: new Date(),
        impact: parseInt(impact),
        affectedTasks: Array.from(selectedTasks),
      });
      setMessage("");
      setImpact("3");
      setSelectedTasks(new Set());
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Registrar nueva actividad</DialogTitle>
          <DialogDescription>
            Describe lo que hiciste y selecciona las tareas impactadas
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Mensaje del commit</Label>
            <Textarea
              id="message"
              placeholder="Ej: Completé el módulo de React Hooks"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="impact">Nivel de impacto</Label>
            <Select value={impact} onValueChange={setImpact}>
              <SelectTrigger id="impact">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">⭐ Mínimo (1)</SelectItem>
                <SelectItem value="2">⭐⭐ Bajo (2)</SelectItem>
                <SelectItem value="3">⭐⭐⭐ Medio (3)</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ Alto (4)</SelectItem>
                <SelectItem value="5">⭐⭐⭐⭐⭐ Máximo (5)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tareas impactadas ({selectedTasks.size} seleccionadas)</Label>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="space-y-4">
                {goal.keyAreas.map((area) => (
                  <div key={area.id} className="space-y-2">
                    <p className="font-semibold text-sm">{area.name}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {area.tasks.map((task, idx) => (
                        <div key={task.id} className="flex items-start space-x-2">
                          <Checkbox
                            id={task.id}
                            checked={selectedTasks.has(task.id)}
                            onCheckedChange={() => handleTaskToggle(task.id)}
                          />
                          <label
                            htmlFor={task.id}
                            className="text-sm cursor-pointer leading-tight"
                          >
                            #{idx + 1}: {task.description}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!message.trim() || selectedTasks.size === 0}>
              Registrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityForm;
