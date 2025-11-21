import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

interface GoalFormProps {
  onGoalCreated: (goalTitle: string, pillars: string[]) => void;
}

const GoalForm = ({ onGoalCreated }: GoalFormProps) => {
  const [goalTitle, setGoalTitle] = useState("");
  const [pillars, setPillars] = useState<string[]>(["", "", "", "", "", "", "", ""]);

  const handlePillarChange = (index: number, value: string) => {
    const newPillars = [...pillars];
    newPillars[index] = value;
    setPillars(newPillars);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goalTitle.trim() && pillars.every(p => p.trim())) {
      onGoalCreated(goalTitle, pillars);
    }
  };

  const allFilled = goalTitle.trim() && pillars.every(p => p.trim());

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <Card className="w-full max-w-3xl shadow-strong">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <Target className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Crea tu objetivo en Janada</CardTitle>
          <CardDescription className="text-base">
            Define tu goal y los 8 pilares que lo sostienen. Cada pilar tendrá 8 recuadros para trackear tu progreso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="goal" className="text-base font-semibold">
                ¿Cuál es tu objetivo?
              </Label>
              <Input
                id="goal"
                placeholder="Ej: Ser desarrollador full-stack en 6 meses"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="text-lg h-12"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Define tus 8 pilares
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pillars.map((pillar, index) => (
                  <Input
                    key={index}
                    placeholder={`Pilar ${index + 1}`}
                    value={pillar}
                    onChange={(e) => handlePillarChange(index, e.target.value)}
                    className="h-11"
                  />
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold"
              disabled={!allFilled}
            >
              Crear tablero
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalForm;
