// Security utilities for password protection and SQL injection prevention

// Password validation and hashing
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  // Check for common weak passwords
  const weakPasswords = ["password", "123456", "admin", "qwerty", "letmein"];
  if (weakPasswords.some((weak) => password.toLowerCase().includes(weak))) {
    errors.push("Password is too common or weak");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Simple hash function for demo (in production, use bcrypt or similar)
export function hashPassword(password: string): string {
  let hash = 0;
  if (password.length === 0) return hash.toString();

  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Add salt for better security
  const salt = "secure-shield-salt-2024";
  const saltedPassword = password + salt;
  let saltedHash = 0;

  for (let i = 0; i < saltedPassword.length; i++) {
    const char = saltedPassword.charCodeAt(i);
    saltedHash = (saltedHash << 5) - saltedHash + char;
    saltedHash = saltedHash & saltedHash;
  }

  return Math.abs(saltedHash).toString(36);
}

// Verify password against hash
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// SQL Injection prevention
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";

  // Remove potentially dangerous characters
  return input
    .replace(/['"\\]/g, "") // Remove quotes and backslashes
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/[;]/g, "") // Remove semicolons
    .replace(/[--]/g, "") // Remove SQL comment markers
    .replace(/\/\*/g, "") // Remove SQL comment start
    .replace(/\*\//g, "") // Remove SQL comment end
    .trim();
}

// XSS prevention
export function sanitizeHtml(input: string): string {
  if (typeof input !== "string") return "";

  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remainingTime?: number;
} {
  const now = Date.now();
  const attempts = loginAttempts.get(ip);

  if (!attempts) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return { allowed: true };
  }

  // Reset after 15 minutes
  if (now - attempts.lastAttempt > 15 * 60 * 1000) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return { allowed: true };
  }

  // Allow up to 5 attempts
  if (attempts.count >= 5) {
    const remainingTime = Math.ceil(
      (15 * 60 * 1000 - (now - attempts.lastAttempt)) / 1000
    );
    return { allowed: false, remainingTime };
  }

  attempts.count++;
  attempts.lastAttempt = now;
  return { allowed: true };
}

// CSRF token generation
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

// Validate CSRF token
export function validateCSRFToken(
  token: string,
  sessionToken: string
): boolean {
  return token === sessionToken && token.length === 64;
}

