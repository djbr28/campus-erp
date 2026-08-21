import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testUser(role, email, password) {
  console.log("\n====================================");
  console.log(`TESTING ${role}`);
  console.log(`EMAIL: ${email}`);
  console.log("====================================");

  // 1. Login
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError) {
    console.log("❌ LOGIN ERROR:");
    console.log(authError);
    return;
  }

  console.log("✅ Login successful");
  console.log("Auth user ID:", authData.user.id);

  // 2. Check current authenticated session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  console.log("\n--- SESSION ---");
  console.log("Session exists:", !!session);
  console.log("Session error:", sessionError?.message ?? "none");

  if (session) {
    console.log("Session user ID:", session.user.id);
  }

  // 3. Check students table
  console.log("\n--- STUDENTS QUERY ---");

  const studentResult = await supabase
    .from("students")
    .select("id, profile_id, student_number, class_name")
    .eq("profile_id", authData.user.id);

  console.log("Data:", studentResult.data);
  console.log("Error:", studentResult.error);

  // 4. Check parents table
  console.log("\n--- PARENTS QUERY ---");

  const parentResult = await supabase
    .from("parents")
    .select("id, profile_id, student_id, relationship, phone")
    .eq("profile_id", authData.user.id);

  console.log("Data:", parentResult.data);
  console.log("Error:", parentResult.error);

  // 5. Check profiles table
  console.log("\n--- PROFILES QUERY ---");

  const profileResult = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", authData.user.id);

  console.log("Data:", profileResult.data);
  console.log("Error:", profileResult.error);

  // 6. Sign out
  await supabase.auth.signOut();

  console.log("\n✅ Signed out");
}

// Student
await testUser(
  "STUDENT",
  "student.test@smartcampus.test",
  process.env.PASSWORD_STUDENT
);

// Parent
await testUser(
  "PARENT",
  "parent.test@smartcampus.test",
  process.env.PASSWORD_PARENT
);