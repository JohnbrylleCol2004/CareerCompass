import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../lib/supabase';
import { MAX_RESUME_BYTES, validatePdfHeader, validatePdfMetadata } from '../utils/resumePdf';

export async function requestCareerAi(body) {
  const { data, error } = await supabase.functions.invoke('career-ai', { body, timeout: 90000 });
  if (error) {
    let message = 'Could not reach AI. Check your internet connection and ensure the career-ai function is deployed.';
    try {
      const details = await error.context?.json();
      if (typeof details?.error === 'string') message = details.error;
    } catch { /* Gateway responses may not be JSON. */ }
    throw new Error(message);
  }
  if (!data || data.error) throw new Error(data?.error || 'AI returned no result. Please try again.');
  return data;
}

export async function analyzeResumePdf(resume) {
  validatePdfMetadata(resume?.name, resume?.size);
  if (!resume.uri) throw new Error('Please select your PDF again.');
  const info = await FileSystem.getInfoAsync(resume.uri);
  if (!info.exists || info.isDirectory) throw new Error('This PDF is no longer available. Please select it again.');
  validatePdfMetadata(resume.name, info.size);
  const pdfBase64 = await FileSystem.readAsStringAsync(resume.uri, { encoding: FileSystem.EncodingType.Base64 });
  if (pdfBase64.length > Math.ceil(MAX_RESUME_BYTES / 3) * 4) throw new Error('Please select a PDF smaller than 10 MB.');
  validatePdfHeader(new Uint8Array(decode(pdfBase64.slice(0, 8))));
  return requestCareerAi({ action: 'resume_analysis', filename: 'resume.pdf', pdfBase64 });
}
