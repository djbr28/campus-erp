// ============================================================
// Smart Campus ERP — Incidents API (Server-Side Authorization)
//
// POST   /api/incidents   → create an incident  (STUDENT, FACULTY only)
// PATCH  /api/incidents   → update the status   (SECURITY only)
//
// Both handlers act as the signed-in user, so Supabase RLS is a
// second line of defence behind the explicit role check here.
// Reads stay on the client (all authenticated roles may SELECT).
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer, requireRole } from "@/lib/supabase/server";

// Mirrors the CHECK constraints on public.incidents.
const VALID_PRIORITIES = ["low", "medium", "high", "critical"] as const;
const VALID_STATUSES = ["Open", "In Progress", "Resolved"] as const;

type Priority = (typeof VALID_PRIORITIES)[number];
type Status = (typeof VALID_STATUSES)[number];

/**
 * Builds the next human-readable incident id (INC-006, INC-007, …).
 * incidents.id is a TEXT primary key with no default, so the app owns it.
 */
async function nextIncidentId(
  supabase: Awaited<ReturnType<typeof getSupabaseServer>>,
  attempt: number
): Promise<string> {
  const { count } = await supabase
    .from("incidents")
    .select("id", { count: "exact", head: true });

  const next = (count ?? 0) + 1 + attempt;
  return `INC-${String(next).padStart(3, "0")}`;
}

export async function POST(req: NextRequest) {
  // ── 1. Authenticate + authorize (STUDENT and FACULTY may report) ──
  const check = await requireRole(["STUDENT", "FACULTY"]);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const category = typeof body.category === "string" ? body.category.trim() : "";
  const location = typeof body.location === "string" ? body.location.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const rawSeverity = typeof body.severity === "string" ? body.severity.toLowerCase() : "medium";

  if (!category || !location || !description) {
    return NextResponse.json(
      { error: "Category, location, and description are all required." },
      { status: 400 }
    );
  }

  // ── 2. Map the form's "severity" onto the actual DB column: priority ──
  const priority: Priority = (VALID_PRIORITIES as readonly string[]).includes(rawSeverity)
    ? (rawSeverity as Priority)
    : "medium";

  const title =
    typeof body.title === "string" && body.title.trim()
      ? body.title.trim()
      : `${category} reported at ${location.slice(0, 40)}`;

  const supabase = await getSupabaseServer();

  // ── 3. Insert, retrying on primary-key collision ──
  let lastError: { code?: string; message: string } | null = null;

  for (let attempt = 0; attempt < 5; attempt++) {
    const id = await nextIncidentId(supabase, attempt);

    const { data, error } = await supabase
      .from("incidents")
      .insert({
        id,
        reported_by: check.profile.id,
        title,
        description,
        location,
        category,
        priority,
        status: "Open" satisfies Status,
      })
      .select()
      .single();

    if (!error && data) {
      return NextResponse.json({ success: true, incident: data });
    }

    lastError = error;

    // 23505 = unique_violation → another report took this id, try the next one.
    if (error?.code !== "23505") break;
  }

  console.error("[Incidents API] Insert failed:", lastError);
  return NextResponse.json(
    { error: lastError?.message || "Failed to save the incident report." },
    { status: 500 }
  );
}

export async function PATCH(req: NextRequest) {
  // ── 1. Only SECURITY may change an incident's status ──
  const check = await requireRole(["SECURITY"]);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  const status = typeof body.status === "string" ? body.status : "";

  if (!id) {
    return NextResponse.json({ error: "An incident id is required." }, { status: 400 });
  }

  if (!(VALID_STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json(
      { error: `Status must be one of: ${VALID_STATUSES.join(", ")}.` },
      { status: 400 }
    );
  }

  const supabase = await getSupabaseServer();

  // resolved_at exists on public.incidents — stamp it on resolve, clear on re-open.
  const { data, error } = await supabase
    .from("incidents")
    .update({
      status,
      resolved_at: status === "Resolved" ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[Incidents API] Update failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update the incident." },
      { status: 500 }
    );
  }

  // RLS returns zero rows rather than an error when an update is disallowed.
  if (!data) {
    return NextResponse.json(
      { error: `Incident ${id} was not updated. It may not exist, or the database rejected the change.` },
      { status: 403 }
    );
  }

  return NextResponse.json({ success: true, incident: data });
}
