import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

const incidentSchema = z.object({
  category: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  recommendation: z.string(),
  analysis: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const incident = body.incident;

    if (!incident || typeof incident !== "string") {
      return Response.json(
        { error: "Incident description is required." },
        { status: 400 }
      );
    }

    const result = await generateObject({
      model: groq("openai/gpt-oss-20b"),
      schema: incidentSchema,
      prompt: `
You are an AI safety assistant for a college campus.

Analyze the following campus incident.

Incident:
${incident}

Return:
- category
- priority
- recommendation
- analysis

Prioritize student safety.
Be concise.
      `,
    });

    return Response.json(result.object);
  } catch (error) {
    console.error("Groq incident analysis error:", error);

    return Response.json(
      { error: "Failed to analyze incident." },
      { status: 500 }
    );
  }
}