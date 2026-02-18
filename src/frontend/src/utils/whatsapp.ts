import type { PatientSubmission } from '@/backend';

/**
 * Normalizes a phone number for WhatsApp:
 * - Strips all non-digit characters
 * - Converts leading 0 to 62 (Indonesia country code)
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  
  // Strip all non-digits
  let cleaned = phone.replace(/\D/g, '');
  
  // Convert leading 0 to 62
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  
  return cleaned;
}

/**
 * Extracts a field value from a context string
 */
function extractField(context: string, field: string): string | null {
  const regex = new RegExp(`${field}:\\s*([^,]+)`, 'i');
  const match = context.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * Gets patient info from submission, preferring structured fields
 */
function getPatientInfo(submission: PatientSubmission) {
  // Prefer structured personalInfo fields
  if (submission.personalInfo.fullName) {
    return {
      name: submission.personalInfo.fullName || 'Patient',
      room: submission.personalInfo.roomNumber || null,
      nationality: submission.personalInfo.country || null,
      whatsapp: submission.personalInfo.whatsappNumber || '',
    };
  }
  
  // Fallback to context parsing for older submissions
  const context = submission.detailedInfo.context || '';
  return {
    name: extractField(context, 'Name') || 'Patient',
    room: extractField(context, 'Room'),
    nationality: extractField(context, 'Nationality'),
    whatsapp: extractField(context, 'WhatsApp') || '',
  };
}

/**
 * Builds a human-readable WhatsApp message template from patient submission data
 */
export function buildWhatsAppMessage(submission: PatientSubmission): string {
  const context = submission.detailedInfo.context || '';
  const patientInfo = getPatientInfo(submission);
  
  // Extract medical results
  const bloodPressure = extractField(context, 'Blood Pressure') || '-';
  const pulse = extractField(context, 'Pulse') || '-';
  const oxygen = extractField(context, 'Oxygen') || '-';
  const bloodSugar = extractField(context, 'Blood Sugar') || '-';
  const cholesterol = extractField(context, 'Cholesterol') || '-';
  const uricAcid = extractField(context, 'Uric Acid') || '-';
  
  // Extract doctor schedule
  const meetDoctor = extractField(context, 'Meet Doctor');
  const meetingDate = extractField(context, 'Meeting Date');
  const meetingTime = extractField(context, 'Meeting Time');
  
  // Team notes
  const notes = submission.notes || '';
  
  // Google Maps review link
  const googleMapsUrl = 'https://share.google/FHNcPzGbdwQSjKj3n';
  
  // Build message sections
  let message = `Hello ${patientInfo.name}!\n\n`;
  message += `📋 *Medical Examination Results*\n\n`;
  
  // Patient info
  message += `Patient: ${patientInfo.name}\n`;
  if (patientInfo.room) message += `Room: ${patientInfo.room}\n`;
  if (patientInfo.nationality) message += `Nationality: ${patientInfo.nationality}\n`;
  message += `\n`;
  
  // Medical results
  message += `*Vital Signs & Lab Results:*\n`;
  message += `• Blood Pressure: ${bloodPressure}\n`;
  message += `• Pulse: ${pulse}\n`;
  message += `• Oxygen: ${oxygen}\n`;
  message += `• Blood Sugar: ${bloodSugar}\n`;
  message += `• Cholesterol: ${cholesterol}\n`;
  message += `• Uric Acid: ${uricAcid}\n`;
  message += `\n`;
  
  // Team notes
  if (notes) {
    message += `*Medical Team Notes:*\n`;
    message += `${notes}\n`;
    message += `\n`;
  }
  
  // Doctor schedule (only if meetDoctor is "Yes")
  if (meetDoctor === 'Yes' && meetingDate && meetingTime) {
    message += `*Doctor Appointment:*\n`;
    message += `📅 Date: ${meetingDate}\n`;
    message += `🕐 Time: ${meetingTime}\n`;
    message += `\n`;
  }
  
  // Review request
  message += `⭐ *Help Us Grow!*\n`;
  message += `Please share your experience by leaving a review on our Google Maps profile:\n`;
  message += `${googleMapsUrl}\n`;
  message += `\n`;
  message += `Thank you for trusting us with your health! 🏥`;
  
  return message;
}

/**
 * Builds a complete wa.me URL with normalized phone number and encoded message
 */
export function buildWhatsAppUrl(submission: PatientSubmission): string {
  const patientInfo = getPatientInfo(submission);
  const whatsappNumber = patientInfo.whatsapp;
  
  if (!whatsappNumber) {
    return '';
  }
  
  const normalizedNumber = normalizePhoneNumber(whatsappNumber);
  const message = buildWhatsAppMessage(submission);
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${normalizedNumber}?text=${encodedMessage}`;
}
