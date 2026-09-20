import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";
import { requireRole } from "@/lib/supabase/server";

const incidentSchema = z.object({
  category: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  recommendation: z.string(),
  analysis: z.string(),
});

export async function POST(request: Request) {
  // Any signed-in campus user may use incident analysis; signed-out callers get
  // 401 before any Groq quota is spent.
  const check = await requireRole(["STUDENT", "FACULTY", "PARENT", "ADMIN", "SECURITY"]);
  if (!check.ok) {
    return Response.json({ error: check.error }, { status: check.status });
  }

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
      system: `
You are an AI safety assistant for a college campus.

Analyze campus incidents and provide a concise,
safety-focused assessment.

Classify the incident accurately.
Prioritize immediate safety concerns.
Do not invent facts that are not present in the incident.
      `,
      prompt: `
Analyze this campus incident:

${incident}
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