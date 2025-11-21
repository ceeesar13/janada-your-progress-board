import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goal } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating pillar suggestions for goal:", goal);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "Eres un asistente experto en planificación y desarrollo personal. Tu tarea es sugerir 8 pilares fundamentales que ayuden a alcanzar un objetivo específico. Los pilares deben ser concretos, accionables y complementarios entre sí. Responde ÚNICAMENTE con un array JSON de 8 strings, sin texto adicional.",
          },
          {
            role: "user",
            content: `Objetivo: "${goal}"\n\nSugiere 8 pilares fundamentales para lograr este objetivo. Cada pilar debe ser una categoría específica de acciones o aprendizajes. Responde solo con el array JSON, por ejemplo: ["Pilar 1", "Pilar 2", ...]`,
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de solicitudes excedido. Intenta nuevamente en unos minutos." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Se requiere pago. Agrega créditos a tu workspace de Lovable AI." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Error al generar sugerencias" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log("AI response:", content);

    // Parse the JSON array from the response
    let pillars: string[];
    try {
      // Try to extract JSON array from the response
      const jsonMatch = content.match(/\[.*\]/s);
      if (jsonMatch) {
        pillars = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: split by lines and clean up
        pillars = content
          .split("\n")
          .filter((line: string) => line.trim())
          .map((line: string) => line.replace(/^[-*\d.]\s*["']?|["']?\s*,?\s*$/g, ""))
          .filter((line: string) => line.length > 0)
          .slice(0, 8);
      }

      // Ensure we have exactly 8 pillars
      while (pillars.length < 8) {
        pillars.push(`Pilar ${pillars.length + 1}`);
      }
      pillars = pillars.slice(0, 8);

      console.log("Parsed pillars:", pillars);

      return new Response(JSON.stringify({ pillars }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return new Response(
        JSON.stringify({ error: "Error procesando las sugerencias de IA" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error in suggest-pillars function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
