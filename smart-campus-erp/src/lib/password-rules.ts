// ============================================================
// Smart Campus ERP — Password policy
//
// One rule set, used both by the Add User form (early feedback)
// and by /api/admin/users (the check that actually counts).
// Passwords are only ever handed to Supabase Auth, which stores a
// one-way hash; this module never stores or logs them.
// ============================================================

export const PASSWORD_MIN_LENGTH = 8;
/** bcrypt, which Supabase Auth uses, ignores everything past 72 bytes. */
export const PASSWORD_MAX_BYTES = 72;

export const PASSWORD_HINT = `Min ${PASSWORD_MIN_LENGTH} characters, with a letter and a number`;

/** Returns a human-readable problem with the password, or null if it passes. */
export function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (new TextEncoder().encode(password).length > PASSWORD_MAX_BYTES) {
    return `Password must be at most ${PASSWORD_MAX_BYTES} bytes.`;
  }
  if (!/[A-Za-z]/.test(password)) {
    return "Password must contain at least one letter.";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }
  return null;
}
