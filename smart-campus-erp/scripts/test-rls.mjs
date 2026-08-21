import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Explicitly load .env.local
dotenv.config({ path: ".env.local" });

console.log(
  "DEBUG URL:",
  !!process.env.NEXT_PUBLIC_SUPABASE_URL
);
console.log(
  "DEBUG KEY:",
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase environment variables.");
  console.error(
    "Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const users = [
  {
    role: "STUDENT",
    email: "student.test@smartcampus.test",
    password: process.env.PASSWORD_STUDENT,
  },
  {
    role: "PARENT",
    email: "parent.test@smartcampus.test",
    password: process.env.PASSWORD_PARENT,
  },
  {
    role: "FACULTY",
    email: "faculty.test@smartcampus.test",
    password: process.env.PASSWORD_FACULTY,
  },
  {
    role: "ADMIN",
    email: "admin.test@smartcampus.test",
    password: process.env.PASSWORD_ADMIN,
  },
  {
    role: "SECURITY",
    email: "security.test@smartcampus.test",
    password: process.env.PASSWORD_SECURITY,
  },
];

async function login(email, password) {
  if (!password) {
    throw new Error(`Password missing for ${email}`);
  }

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    throw new Error(`Login failed: ${error.message}`);
  }

  return data.user;
}

async function logout() {
  await supabase.auth.signOut();
}

async function testQuery(name, operation) {
  try {
    const result = await operation();

    if (result.error) {
      console.log(`❌ ${name}`);
      console.log(`   Error: ${result.error.message}`);

      return {
        name,
        passed: false,
        error: result.error.message,
      };
    }

    console.log(`✅ ${name}`);

    return {
      name,
      passed: true,
    };
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);

    return {
      name,
      passed: false,
      error: error.message,
    };
  }
}

async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("No authenticated user.");
  }

  return user.id;
}

async function getStudentIdForCurrentUser() {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("students")
    .select("id")
    .eq("profile_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Student lookup failed: ${error.message}`
    );
  }

  return data?.id ?? null;
}

async function getParentIdForCurrentUser() {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("parents")
    .select("id")
    .eq("profile_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Parent lookup failed: ${error.message}`
    );
  }

  return data?.id ?? null;
}

/* ==========================================
   STUDENT
========================================== */

async function testStudent(user) {
  console.log("\n==============================");
  console.log("STUDENT TESTS");
  console.log("==============================");

  const studentId = await getStudentIdForCurrentUser();

  if (!studentId) {
    console.log(
      "⚠️ No student record visible for this authenticated user."
    );
  } else {
    console.log(`Student record ID: ${studentId}`);

    await testQuery(
      "Student can SELECT own student record",
      () =>
        supabase
          .from("students")
          .select("*")
          .eq("id", studentId)
    );

    await testQuery(
      "Student can SELECT own attendance",
      () =>
        supabase
          .from("attendance")
          .select("*")
          .eq("student_id", studentId)
    );

    await testQuery(
      "Student can SELECT own fees",
      () =>
        supabase
          .from("fees")
          .select("*")
          .eq("student_id", studentId)
    );
  }

  await testQuery(
    "Student can SELECT own incidents",
    () =>
      supabase
        .from("incidents")
        .select("*")
        .eq("reported_by", user.id)
  );

  await testQuery(
    "Authenticated user can SELECT announcements",
    () =>
      supabase
        .from("announcements")
        .select("*")
        .limit(5)
  );

  await testQuery(
    "Authenticated user can SELECT incident updates",
    () =>
      supabase
        .from("incident_updates")
        .select("*")
        .limit(5)
  );

  await testQuery(
    "Authenticated user can SELECT emergency alerts",
    () =>
      supabase
        .from("emergency_alerts")
        .select("*")
        .limit(5)
  );
}

/* ==========================================
   PARENT
========================================== */

async function testParent() {
  console.log("\n==============================");
  console.log("PARENT TESTS");
  console.log("==============================");

  const parentId = await getParentIdForCurrentUser();

  if (!parentId) {
    console.log(
      "⚠️ No parent record visible for this authenticated user."
    );
    return;
  }

  console.log(`Parent record ID: ${parentId}`);

  await testQuery(
    "Parent can SELECT own parent record",
    () =>
      supabase
        .from("parents")
        .select("*")
        .eq("id", parentId)
  );

  const { data: linkedStudents, error } =
    await supabase
      .from("parent_students")
      .select("student_id")
      .eq("parent_id", parentId);

  if (error) {
    console.log("❌ Parent linked-student lookup");
    console.log(`   Error: ${error.message}`);
    return;
  }

  console.log(
    `Linked student IDs visible to parent: ${JSON.stringify(
      linkedStudents
    )}`
  );

  if (linkedStudents?.length) {
    for (const link of linkedStudents) {
      const studentId = link.student_id;

      await testQuery(
        `Parent can SELECT linked child ${studentId}`,
        () =>
          supabase
            .from("students")
            .select("*")
            .eq("id", studentId)
      );

      await testQuery(
        "Parent can SELECT linked child's attendance",
        () =>
          supabase
            .from("attendance")
            .select("*")
            .eq("student_id", studentId)
      );

      await testQuery(
        "Parent can SELECT linked child's fees",
        () =>
          supabase
            .from("fees")
            .select("*")
            .eq("student_id", studentId)
      );
    }
  }

  await testQuery(
    "Parent can SELECT announcements",
    () =>
      supabase
        .from("announcements")
        .select("*")
        .limit(5)
  );
}

/* ==========================================
   FACULTY
========================================== */

async function testFaculty() {
  console.log("\n==============================");
  console.log("FACULTY TESTS");
  console.log("==============================");

  await testQuery(
    "Faculty can SELECT attendance",
    () =>
      supabase
        .from("attendance")
        .select("*")
        .limit(5)
  );

  await testQuery(
    "Faculty can SELECT announcements",
    () =>
      supabase
        .from("announcements")
        .select("*")
        .limit(5)
  );
}

/* ==========================================
   ADMIN
========================================== */

async function testAdmin() {
  console.log("\n==============================");
  console.log("ADMIN TESTS");
  console.log("==============================");

  await testQuery(
    "Admin can SELECT students",
    () =>
      supabase
        .from("students")
        .select("*")
        .limit(5)
  );

  await testQuery(
    "Admin can SELECT attendance",
    () =>
      supabase
        .from("attendance")
        .select("*")
        .limit(5)
  );

  await testQuery(
    "Admin can SELECT fees",
    () =>
      supabase
        .from("fees")
        .select("*")
        .limit(5)
  );

  await testQuery(
    "Admin can SELECT parents",
    () =>
      supabase
        .from("parents")
        .select("*")
        .limit(5)
  );

  await testQuery(
    "Admin can SELECT incidents",
    () =>
      supabase
        .from("incidents")
        .select("*")
        .limit(5)
  );

  await testQuery(
    "Admin can SELECT incident updates",
    () =>
      supabase
        .from("incident_updates")
        .select("*")
        .limit(5)
  );

  await testQuery(
    "Admin can SELECT emergency alerts",
    () =>
      supabase
        .from("emergency_alerts")
        .select("*")
        .limit(5)
  );
}

/* ==========================================
   SECURITY
========================================== */

async function testSecurity() {
  console.log("\n==============================");
  console.log("SECURITY TESTS");
  console.log("==============================");

  await testQuery(
    "Security can SELECT incidents",
    () =>
      supabase
        .from("incidents")
        .select("*")
        .limit(5)
  );

  await testQuery(
    "Security can SELECT incident updates",
    () =>
      supabase
        .from("incident_updates")
        .select("*")
        .limit(5)
  );

  await testQuery(
    "Security can SELECT emergency alerts",
    () =>
      supabase
        .from("emergency_alerts")
        .select("*")
        .limit(5)
  );

  await testQuery(
    "Security can SELECT announcements",
    () =>
      supabase
        .from("announcements")
        .select("*")
        .limit(5)
  );
}

/* ==========================================
   MAIN TEST RUNNER
========================================== */

async function run() {
  console.log("\n=================================");
  console.log("SUPABASE AUTHENTICATED RLS TEST");
  console.log("=================================\n");

  for (const account of users) {
    console.log("\n################################");
    console.log(`TESTING ${account.role}`);
    console.log(`ACCOUNT: ${account.email}`);
    console.log("################################");

    try {
      const user = await login(
        account.email,
        account.password
      );

      console.log(
        `Authenticated user ID: ${user.id}`
      );

      if (account.role === "STUDENT") {
        await testStudent(user);
      }

      if (account.role === "PARENT") {
        await testParent();
      }

      if (account.role === "FACULTY") {
        await testFaculty();
      }

      if (account.role === "ADMIN") {
        await testAdmin();
      }

      if (account.role === "SECURITY") {
        await testSecurity();
      }
    } catch (error) {
      console.log(
        `❌ ${account.role} authentication/test failed`
      );
      console.log(`   ${error.message}`);
    }

    await logout();
  }

  console.log("\n=================================");
  console.log("ALL RLS TESTS COMPLETED");
  console.log("=================================");
}

run();