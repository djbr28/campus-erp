import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

const mockData = {
  incidents: [
    {
      id: 1,
      category: "Personal Safety",
      priority: "HIGH",
      description: "Student reported being followed near Block B.",
      status: "Open",
    },
    {
      id: 2,
      category: "Medical",
      priority: "MEDIUM",
      description: "Student reported feeling unwell in the library.",
      status: "Resolved",
    },
    {
      id: 3,
      category: "Security",
      priority: "CRITICAL",
      description: "Unauthorized person reported near the hostel entrance.",
      status: "Open",
    },
    {
      id: 4,
      category: "Maintenance",
      priority: "LOW",
      description: "Broken light reported near Block C.",
      status: "Pending",
    },
  ],

  students: [
    {
      id: 1,
      name: "Student A",
      attendance: 82,
    },
    {
      id: 2,
      name: "Student B",
      attendance: 68,
    },
    {
      id: 3,
      name: "Student C",
      attendance: 91,
    },
    {
      id: 4,
      name: "Student D",
      attendance: 72,
    },
  ],
};

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

      prompt: `
You are an AI assistant for a college campus administrator.

Answer the administrator's question using ONLY the data provided below.

Incident data:
${JSON.stringify(mockData.incidents, null, 2)}

Student attendance data:
${JSON.stringify(mockData.students, null, 2)}

Administrator question:
${question}

Give a clear and concise answer.
Do not invent information that is not present in the data.
`,
    });

    return Response.json({
      answer: result.text,
    });
  } catch (error) {
    console.error("Groq admin assistant error:", error);

    return Response.json(
      { error: "Failed to process admin question." },
      { status: 500 }
    );
  }
}