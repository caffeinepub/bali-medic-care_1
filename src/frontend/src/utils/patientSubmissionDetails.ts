import type { PatientSubmission } from '@/backend';

/**
 * Extracts a field value from a context string (fallback for older submissions)
 */
function extractField(context: string, field: string): string | null {
  const regex = new RegExp(`${field}:\\s*([^,]+)`, 'i');
  const match = context.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * Converts bigint to string safely for display
 */
function bigintToString(value: bigint | undefined | null): string {
  if (value === undefined || value === null) return 'N/A';
  return value.toString();
}

/**
 * Formats timestamp for display
 */
function formatTimestamp(timestamp: bigint | undefined | null): string {
  if (!timestamp) return 'N/A';
  try {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Formats submission status for display
 */
function formatStatus(status: string): string {
  switch (status) {
    case 'inProgress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'discarded':
      return 'Discarded';
    default:
      return status;
  }
}

/**
 * Creates a complete view-model for displaying PatientSubmission details
 * Prefers structured fields and falls back to context parsing only when needed
 */
export function getPatientDetailsViewModel(submission: PatientSubmission) {
  const context = submission.detailedInfo.context || '';

  // Personal Info - prefer structured fields
  const personalInfo = {
    fullName: submission.personalInfo.fullName || extractField(context, 'Name') || 'N/A',
    country: submission.personalInfo.country || extractField(context, 'Nationality') || 'N/A',
    roomNumber: submission.personalInfo.roomNumber || extractField(context, 'Room') || 'N/A',
    whatsappNumber: submission.personalInfo.whatsappNumber || extractField(context, 'WhatsApp') || 'N/A',
    medicalConditions: submission.personalInfo.medicalConditions || 'N/A',
    symptoms: submission.personalInfo.symptoms || extractField(context, 'Symptoms') || 'N/A',
  };

  // Demographic Info
  const demographic = {
    age: submission.demographic.age ? bigintToString(submission.demographic.age) : 'N/A',
    unitOfMeasure: submission.demographic.unitOfMeasure || 'N/A',
    gestationalAge: submission.demographic.gestationalAge ? bigintToString(submission.demographic.gestationalAge) : 'N/A',
    gender: submission.demographic.gender || 'N/A',
  };

  // Timestamps
  const timestamps = {
    submission: formatTimestamp(submission.timestamps.submission.submission),
    recorded: submission.timestamps.recorded?.submission 
      ? formatTimestamp(submission.timestamps.recorded.submission) 
      : 'N/A',
    followUp: submission.timestamps.followUp?.submission 
      ? formatTimestamp(submission.timestamps.followUp.submission) 
      : 'N/A',
  };

  // Detailed Info
  const detailedInfo = {
    date: submission.detailedInfo.date || 'N/A',
    time: submission.detailedInfo.time || 'N/A',
    context: submission.detailedInfo.context || 'N/A',
  };

  // Scores
  const initialScore = {
    obstructive: bigintToString(submission.initialScore.obstructive),
    central: bigintToString(submission.initialScore.central),
  };

  const summaryScore = {
    obstructive: submission.summary.score.obstructiveScore 
      ? bigintToString(submission.summary.score.obstructiveScore) 
      : 'N/A',
    central: submission.summary.score.centralScore 
      ? bigintToString(submission.summary.score.centralScore) 
      : 'N/A',
  };

  return {
    id: bigintToString(submission.id),
    clinicId: submission.clinicId,
    patientId: submission.patientId || 'N/A',
    submissionStatus: formatStatus(submission.submissionStatus),
    personalInfo,
    demographic,
    timestamps,
    detailedInfo,
    initialScore,
    summary: {
      score: summaryScore,
      status: formatStatus(submission.summary.status),
    },
    feedbackCode: submission.feedbackCode ? bigintToString(submission.feedbackCode) : 'N/A',
    notes: submission.notes || 'N/A',
    additionalInfo: submission.additionalInfo || 'N/A',
    responsesSectionA: submission.responsesSectionA,
    responsesSectionB: submission.responsesSectionB,
  };
}
