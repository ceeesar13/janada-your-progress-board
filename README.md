# Janada — una meta en una cuadrícula de 9×9

Tablero de progreso basado en el **método Harada**: una meta central, ocho áreas clave alrededor de ella, y ocho tareas concretas por cada área. Una cuadrícula de 9×9, 64 tareas, una sola meta.

Proyecto personal. Construido con Lovable sobre Vite + React + TypeScript, con Supabase para persistencia.

## El problema

Una meta grande escrita en una frase no sirve de nada, porque no te dice qué hacer un martes cualquiera. El método Harada resuelve eso: te obliga a bajar de "quiero X" a 64 acciones específicas. Lo que el método no resuelve en papel es el seguimiento — una vez llenas la cuadrícula, no hay forma de saber si te estás moviendo.

Janada agrega esa capa. Registras actividades con fecha, un impacto del 1 al 5, y las tareas de la cuadrícula a las que afecta cada una. El progreso de cada celda se deriva de ese registro.

## Modelo de datos

| Entidad | Qué representa |
| --- | --- |
| `Goal` | La meta central. Ocupa el centro de la cuadrícula (índice 4 de 9). |
| `KeyArea` | Una de las 8 áreas clave alrededor del centro. Posición 0–7. |
| `Task` | Una de las 8 tareas de un área. Progreso 0–100. |
| `Activity` | Lo que hiciste: mensaje, fecha, impacto 1–5 y las tareas que afecta. |

La decisión de diseño que importa: **el progreso es derivado, no editado**. Una tarea avanza porque registraste actividades que la afectan, no porque arrastraste una barra hasta donde te hacía sentir bien.

## Estructura

| Archivo | Responsabilidad |
| --- | --- |
| `src/types/index.ts` | Modelo de dominio y helpers de posición de la cuadrícula. |
| `src/components/HaradaGrid.tsx` | La cuadrícula 9×9 y el posicionamiento de áreas y tareas. |
| `src/components/Board.tsx` | Composición del tablero. |
| `src/components/GoalForm.tsx` | Creación y edición de la meta y sus áreas clave. |
| `src/components/ActivityForm.tsx` | Registro de actividades con impacto y tareas afectadas. |
| `src/components/ActivityList.tsx` | Historial de actividades. |
| `src/integrations/supabase` | Cliente y tipos generados de Supabase. |

## Cómo correrlo

Necesitas Node.js y npm. Instala dependencias con `npm i` y levanta el servidor de desarrollo con `npm run dev`.

## Estado

Base funcional, sin pulir. La cuadrícula, el modelo de dominio y el registro de actividades funcionan. Lo que falta: autenticación por usuario, visualización del progreso en el tiempo y export de la cuadrícula. Lo voy a retomar.
