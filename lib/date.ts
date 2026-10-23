/**
 * Standardises date and date-range formatting across portfolio sections.
 * e.g. "Feb 2025 – Apr 2025", "Mar 2024", or "2024".
 * Preserves known granularity without inventing months.
 */
export function formatDate(dateStr?: string): string {
  if (!dateStr) return "";

  return dateStr
    // Normalize dashes (em-dash, en-dash, hyphen) to uniform spaced en-dash
    .replace(/\s*[—–-]\s*/g, " – ")
    // Standardise full month names to 3-letter abbreviations
    .replace(/\bMarch\b/g, "Mar")
    .replace(/\bApril\b/g, "Apr")
    .replace(/\bJune\b/g, "Jun")
    .replace(/\bJuly\b/g, "Jul")
    .trim();
}
