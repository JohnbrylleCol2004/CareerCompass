export const MAX_RESUME_BYTES = 10 * 1024 * 1024;

export function validatePdfMetadata(name, size) {
  if (!/\.pdf$/i.test(name || '')) throw new Error('Please select a PDF file only.');
  if (!Number.isFinite(size) || size <= 0) throw new Error('This file is empty or cannot be read.');
  if (size > MAX_RESUME_BYTES) throw new Error('Please select a PDF smaller than 10 MB.');
}

export function validatePdfHeader(bytes) {
  if (String.fromCharCode(...bytes.slice(0, 5)) !== '%PDF-') {
    throw new Error('This file is not a PDF. Export your resume as PDF and try again.');
  }
}
