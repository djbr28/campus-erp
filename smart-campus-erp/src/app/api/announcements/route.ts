// ============================================================
// Smart Campus ERP — Announcements API (Server-Side Authorization)
//
// POST /api/announcements → create an announcement (ADMIN, FACULTY)
//
// Matches the existing RLS policy ("Allow insert announcements"),
// which permits ADMIN and FACULTY. Reads stay on the client —
// every authenticated role may SELECT announcements.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer, requireRole } from "@/lib/supabase/server";

// Mirrors the CHECK constraints on public.announcements.
const VALID_PRIORITIES = ["low", "medium", "high", "critical"] as const;
const VALID_TARGETS = ["ALL", "STUDENT", "FACULTY", "PARENT", "ADMIN", "SECURITY"] as const;

type Priority = (typeof VALID_PRIORITIES)[number];
type Target = (typeof VALID_TARGETS)[number];

/** announcements.id is a TEXT primary key with no default (ANN-001, ANN-002, …). */
async function nextAnnouncementId(
  supabase: Awaited<ReturnType<typeof getSupabaseServer>>,
  attempt: number
): Promise<string> {
  const { count } = await supabase
    .from("announcements")
    .select("id", { count: "exact", head: true });

  const next = (count ?? 0) + 1 + attempt;
  return `ANN-${String(next).padStart(3, "0")}`;
}

export async function POST(req: NextRequest) {
  const check = await requireRole(["ADMIN", "FACULTY"]);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const rawPriority = typeof body.priority === "string" ? body.priority.toLowerCase() : "medium";
  const rawTarget = typeof body.target_role === "string" ? body.target_role.toUpperCase() : "ALL";

  if (!title || !description) {
    return NextResponse.json(
      { error: "A title and description are both required." },
      { status: 400 }
    );
  }

  const priority: Priority = (VALID_PRIORITIES as readonly string[]).includes(rawPriority)
    ? (rawPriority as Priority)
    : "medium";

  const target_role: Target = (VALID_TARGETS as readonly string[]).includes(rawTarget)
    ? (rawTarget as Target)
    : "ALL";

  const supabase = await getSupabaseServer();

  let lastError: { code?: string; message: string } | null = null;

  for (let attempt = 0; attempt < 5; attempt++) {
    const id = await nextAnnouncementId(supabase, attempt);

    const { data, error } = await supabase
      .from("announcements")
      .insert({
        id,
        title,
        description,
        priority,
        target_role,
        created_by: check.profile.id,
        date: new Date().toISOString().slice(0, 10),
      })
      .select()
      .single();

    if (!error && data) {
      return NextResponse.json({ success: true, announcement: data });
    }

    lastError = error;

    if (error?.code !== "23505") break;
  }

  console.error("[Announcements API] Insert failed:", lastError);
  return NextResponse.json(
    { error: lastError?.message || "Failed to publish the announcement." },
    { status: 500 }
  );
}
