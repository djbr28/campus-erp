import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { requireRole } from "@/lib/supabase/server";

export async function POST(request: Request) {
  // Any signed-in campus user may use the assistant; signed-out callers get 401
  // before any Groq quota is spent.
  const check = await requireRole(["STUDENT", "FACULTY", "PARENT", "ADMIN", "SECURITY"]);
  if (!check.ok) {
    return Response.json({ error: check.error }, { status: check.status });
  }

  try {
    const body = await request.json();

    const question = body.question;

    if (!question || typeof question !== "string") {
      return Response.json(
        { error: "Question is required." },
        { status: 400 }
      );
    }

    const result = await generateText({
      model: groq("openai/gpt-oss-20b"),
      system: `
You are the Smart Campus ERP Autonomous AI Assistant.
You assist university students, faculty members, parents, campus security officers, and administrators.

Guidelines:
1. Provide clear, empathetic, and professional assistance.
2. For Students: Help explain academic terms, GPA calculations, attendance requirements (minimum 75% threshold), how to report incidents, fee payment procedures, exam schedules, and library services.
3. For Administrators & Faculty: Help summarize institutional operations, attendance compliance, safety incident responses, and course scheduling.
4. For Security: Emphasize swift incident triage and student safety protocols.
5. Format your answers neatly using concise markdown with bullet points where helpful.
6. Keep responses under 4 paragraphs unless deeply requested.
      `,
      prompt: question,
    });

    return Response.json({
      answer: result.text,
    });
  } catch (error) {
    console.error("Groq AI assistant error:", error);

    return Response.json(
      { error: "Failed to get AI response." },
      { status: 500 }
    );
  }
}