import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, name, email, password, ...details } = body;

    if (!role || !name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields (role, name, email, password)." }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // 1. Create User in Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role,
      },
    });

    if (authError || !authData.user) {
      console.error("[CreateUser] Auth Error:", authError);
      return NextResponse.json({ error: authError?.message || "Failed to create user in Auth" }, { status: 500 });
    }

    const userId = authData.user.id;

    // 2. The profile is likely created automatically by a trigger, but if not, we can insert it.
    // Let's attempt to insert it, and if it fails due to unique constraint, we can assume trigger handled it.
    // Actually, checking schema, there's no trigger listed in the snippet, so we should insert explicitly.
    const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
      id: userId,
      name,
      email,
      role,
      department: details.department || null,
    }, { onConflict: 'id' });

    if (profileError) {
      console.error("[CreateUser] Profile Insert Error:", profileError);
      // Try to clean up auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 });
    }

    // 3. Insert into Role-Specific Table
    let roleInsertError = null;

    if (role === "STUDENT") {
      const studentId = details.registerNumber || `STU-${Date.now().toString().slice(-6)}`;
      const { error } = await supabaseAdmin.from("students").insert({
        id: studentId,
        profile_id: userId,
        register_number: details.registerNumber,
        name,
        email,
        department: details.department || "Computer Science",
        program: details.program || "B.Tech Computer Science",
        year: parseInt(details.year) || 1,
        semester: parseInt(details.semester) || 1,
        phone: details.phone || null,
        status: "Active"
      });
      roleInsertError = error;
    } else if (role === "FACULTY") {
      const facultyId = `FAC-${Date.now().toString().slice(-6)}`;
      const { error } = await supabaseAdmin.from("faculty").insert({
        id: facultyId,
        profile_id: userId,
        name,
        email,
        department: details.department || "Computer Science",
        designation: details.designation || "Assistant Professor",
        phone: details.phone || null,
      });
      roleInsertError = error;
    } else if (role === "PARENT") {
      const parentId = `PAR-${Date.now().toString().slice(-6)}`;
      const { error } = await supabaseAdmin.from("parents").insert({
        id: parentId,
        profile_id: userId,
        name,
        email,
        phone: details.phone || null,
        child_id: details.childId || null,
      });
      roleInsertError = error;
      
      // If a child ID is provided, optionally update the student's parent_id
      if (!error && details.childId) {
        await supabaseAdmin.from("students").update({ parent_id: userId }).eq("id", details.childId);
      }
    }

    if (roleInsertError) {
      console.error("[CreateUser] Role Table Insert Error:", roleInsertError);
      // Try to clean up
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: "Failed to insert into role table" }, { status: 500 });
    }

    return NextResponse.json({ success: true, userId, message: "User created successfully" });

  } catch (error: any) {
    console.error("[CreateUser] Exception:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
