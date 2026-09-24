/**
 * Helper utilities to parse and format Indonesian dates in KasKampus.
 */

const INDO_MONTHS: Record<string, number> = {
  januari: 0,
  jan: 0,
  februari: 1,
  feb: 1,
  maret: 2,
  mar: 2,
  april: 3,
  apr: 3,
  mei: 4,
  may: 4,
  juni: 5,
  jun: 5,
  juli: 6,
  jul: 6,
  agustus: 7,
  agu: 7,
  ags: 7,
  aug: 7,
  september: 8,
  sep: 8,
  oktober: 9,
  okt: 9,
  oct: 9,
  november: 10,
  nov: 10,
  desember: 11,
  des: 11,
  dec: 11,
};

const MONTH_NAMES_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

/**
 * Parses an Indonesian date string (e.g. "Jumat, 16 Mei 2025" or "16 Mei 2025")
 * or standard ISO date string ("2025-05-16") into a JavaScript Date object (normalized to midnight).
 */
export const parseIndonesianDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;

  const trimmed = dateStr.trim();

  // Try parsing YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const parts = trimmed.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    d.setHours(0, 0, 0, 0);
    return isNaN(d.getTime()) ? null : d;
  }

  // Try parsing Indonesian text formats, e.g. "Jumat, 16 Mei 2025" or "14 Mei 2025"
  const match = trimmed.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (match) {
    const day = parseInt(match[1], 10);
    const monthName = match[2].toLowerCase();
    const year = parseInt(match[3], 10);
    const month = INDO_MONTHS[monthName];
    if (month !== undefined) {
      const d = new Date(year, month, day);
      d.setHours(0, 0, 0, 0);
      return isNaN(d.getTime()) ? null : d;
    }
  }

  // Fallback for native Date parsing
  const fallback = new Date(trimmed);
  if (!isNaN(fallback.getTime())) {
    fallback.setHours(0, 0, 0, 0);
    return fallback;
  }

  return null;
};

/**
 * Formats a Date object to YYYY-MM-DD for HTML5 date inputs.
 */
export const toInputDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Formats a Date object into readable Indonesian date string (e.g. "16 Mei 2025").
 */
export const formatIndonesianDate = (date: Date): string => {
  const day = date.getDate();
  const monthName = MONTH_NAMES_ID[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${monthName} ${year}`;
};
