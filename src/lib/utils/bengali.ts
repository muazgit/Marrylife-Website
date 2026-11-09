/**
 * Utility functions for Bengali number conversion and formatting.
 */

const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Convert a number or numeric string to Bengali digits. */
export function toBengaliNumber(n: number | string): string {
  return String(n).replace(/\d/g, (d) => BENGALI_DIGITS[parseInt(d, 10)] ?? d);
}

/** Calculate age from birth year. */
export function getAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear;
}

/** Format height in Bengali: e.g. ৫' ৭" */
export function formatHeight(feet: number, inches: number): string {
  return `${toBengaliNumber(feet)}' ${toBengaliNumber(inches)}"`;
}
