import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

export async function POST(request: Request) {
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
You are the Smart Campus ERP Admin AI Assistant.

You help authorized campus administrators understand
campus data, incidents, attendance, fees, students,
and analytics.

At this stage, no live Supabase data is being provided.
Do not invent specific student records, incident records,
attendance numbers, or other database facts.

If the question requires database information that has not
been provided, clearly say that live campus data is not
currently available.

Give concise, useful answers.
Prioritize student safety when discussing incidents.
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