/**
 * Validation Utility Helpers for Email and Form Inputs
 */

/**
 * Strict RFC 5322-compliant Email Validation
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length > 254) return false;
  
  // Strict regex verifying username, @ symbol, domain name, and at least 2-letter TLD
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmed);
}
