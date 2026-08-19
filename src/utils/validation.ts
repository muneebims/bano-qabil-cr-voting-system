/**
 * Student ID Validation & Receipt Generator
 * Rules: Exactly 7 digits, strictly starting with '138' (e.g., 1384021)
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  cleanId?: string;
}

export function validateStudentId(rawId: string): ValidationResult {
  const trimmed = (rawId || '').trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Student ID cannot be empty. Please enter your 7-digit ID.'
    };
  }

  // Check if contains non-digit characters
  if (!/^\d+$/.test(trimmed)) {
    return {
      isValid: false,
      error: 'Invalid Student ID. ID must contain numbers only, exactly 7 digits, and start with 138. Example: 1384021.'
    };
  }

  // Check if exactly 7 digits
  if (trimmed.length !== 7) {
    return {
      isValid: false,
      error: `Invalid Student ID length (${trimmed.length} digits). ID must contain exactly 7 digits and start with 138. Example: 1384021.`
    };
  }

  // Check if starts with 138
  if (!trimmed.startsWith('138')) {
    return {
      isValid: false,
      error: 'Invalid Student ID. ID must start with 138 (e.g., 1384021).'
    };
  }

  return {
    isValid: true,
    cleanId: trimmed
  };
}

export function maskStudentId(studentId: string): string {
  if (!studentId || studentId.length < 5) return studentId;
  return `${studentId.substring(0, 3)}****${studentId.substring(studentId.length - 2)}`;
}

export function generateReceiptCode(studentId: string, candidateId: string, voteNum: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const checksum = (parseInt(studentId, 10) * 31 + voteNum * 17) % 997;
  const candCode = candidateId.includes('1') ? 'A1' : 'B2';
  return `BQ-CR25-${candCode}-${rand}-${checksum.toString().padStart(3, '0')}`;
}
