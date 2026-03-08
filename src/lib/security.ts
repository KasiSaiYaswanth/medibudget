import { z } from "zod";

// Strip HTML tags to prevent XSS
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[<>"'&]/g, (char) => {
      const entities: Record<string, string> = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "&": "&amp;",
      };
      return entities[char] || char;
    })
    .trim();
}

// Validate and sanitize a generic text input
export function cleanInput(input: string, maxLength = 500): string {
  return sanitizeText(input.slice(0, maxLength));
}

// Common validation schemas
export const emailSchema = z.string().trim().email("Invalid email address").max(255);
export const nameSchema = z.string().trim().min(1, "Name is required").max(100, "Name too long");
export const messageSchema = z.string().trim().min(1, "Message is required").max(2000, "Message too long");
export const searchSchema = z.string().trim().max(200, "Search query too long");

// Rate limiter for client-side actions
export function createRateLimiter(maxAttempts: number, windowMs: number) {
  const attempts: number[] = [];

  return {
    check(): boolean {
      const now = Date.now();
      // Remove expired attempts
      while (attempts.length > 0 && attempts[0] < now - windowMs) {
        attempts.shift();
      }
      return attempts.length < maxAttempts;
    },
    record(): void {
      attempts.push(Date.now());
    },
    remainingAttempts(): number {
      const now = Date.now();
      while (attempts.length > 0 && attempts[0] < now - windowMs) {
        attempts.shift();
      }
      return Math.max(0, maxAttempts - attempts.length);
    },
  };
}

// File upload validation
export function validateFileUpload(
  file: File,
  allowedTypes: string[] = ["image/jpeg", "image/png", "image/webp"],
  maxSizeMB = 5
): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} not allowed. Accepted: ${allowedTypes.join(", ")}` };
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `File too large. Maximum size: ${maxSizeMB}MB` };
  }
  return { valid: true };
}
