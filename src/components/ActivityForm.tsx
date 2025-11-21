import { useState } from "react";
import { Goal } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    affectedCells: string[];
  }) => void;
}

const ActivityForm = ({ open, onClose, goal, onSubmit }: ActivityFormProps) => {
  const [message, setMessage] = useState("");
  const [impact, setImpact] = useState<string>("3");
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());

  const handleCellToggle = (cellId: string) => {
    const newSelected = new Set(selectedCells);
    if (newSelected.has(cellId)) {
      newSelected.delete(cellId);
    } else {
      newSelected.add(cellId);
    }
    setSelectedCells(newSelected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && selectedCells.size > 0) {
      onSubmit({
        message,
        date: new Date(),
        impact: parseInt(impact),
        affectedCells: Array.from(selectedCells),
      });
      setMessage("");
      setImpact("3");
      setSelectedCells(new Set());
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Registrar nueva actividad</DialogTitle>
          <DialogDescription>
            Describe lo que hiciste y selecciona los recuadros impactados
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
            <Label>Recuadros impactados ({selectedCells.size} seleccionados)</Label>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="space-y-4">
                {goal.pillars.map((pillar) => (
                  <div key={pillar.id} className="space-y-2">
                    <p className="font-semibold text-sm">{pillar.name}</p>
                    <div className="grid grid-cols-4 gap-2">
                      {pillar.cells.map((cell, idx) => (
                        <div key={cell.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={cell.id}
                            checked={selectedCells.has(cell.id)}
                            onCheckedChange={() => handleCellToggle(cell.id)}
                          />
                          <label
                            htmlFor={cell.id}
                            className="text-sm cursor-pointer"
                          >
                            #{idx + 1}
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
            <Button type="submit" disabled={!message.trim() || selectedCells.size === 0}>
              Registrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityForm;
