import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PatientSubmission } from '@/backend';

interface ExportButtonProps {
  submissions: PatientSubmission[];
  filterDate: string;
}

export default function ExportButton({ submissions, filterDate }: ExportButtonProps) {
  const extractField = (context: string, field: string): string | null => {
    const regex = new RegExp(`${field}:\\s*([^,]+)`, 'i');
    const match = context.match(regex);
    return match ? match[1].trim() : null;
  };

  const getFieldValue = (submission: PatientSubmission, structuredField: keyof typeof submission.personalInfo, contextField: string): string => {
    // Prefer structured personalInfo field
    if (submission.personalInfo[structuredField]) {
      return submission.personalInfo[structuredField] as string;
    }
    // Fallback to context parsing for older submissions
    return extractField(submission.detailedInfo.context || '', contextField) || '-';
  };

  const handleExport = () => {
    if (submissions.length === 0) return;

    const headers = [
      'ID',
      'Name',
      'Room',
      'Nationality',
      'WhatsApp',
      'Patient Symptoms',
      'Blood Pressure',
      'Pulse',
      'Oxygen',
      'Blood Sugar',
      'Cholesterol',
      'Uric Acid',
      'Team Medical Notes',
      'Meet Doctor?',
      'Meeting Date',
      'Meeting Time',
      'Date',
      'Time',
    ];

    const rows = submissions.map((submission) => {
      const context = submission.detailedInfo.context || '';
      const symptoms = getFieldValue(submission, 'symptoms', 'Symptoms') || 
                       getFieldValue(submission, 'medicalConditions', 'Symptoms');
      
      return [
        submission.id.toString(),
        getFieldValue(submission, 'fullName', 'Name'),
        getFieldValue(submission, 'roomNumber', 'Room'),
        getFieldValue(submission, 'country', 'Nationality'),
        getFieldValue(submission, 'whatsappNumber', 'WhatsApp'),
        `"${symptoms.replace(/"/g, '""')}"`,
        extractField(context, 'Blood Pressure') || '-',
        extractField(context, 'Pulse') || '-',
        extractField(context, 'Oxygen') || '-',
        extractField(context, 'Blood Sugar') || '-',
        extractField(context, 'Cholesterol') || '-',
        extractField(context, 'Uric Acid') || '-',
        `"${(submission.notes || '-').replace(/"/g, '""')}"`,
        extractField(context, 'Meet Doctor') || '-',
        extractField(context, 'Meeting Date') || '-',
        extractField(context, 'Meeting Time') || '-',
        submission.detailedInfo.date || '-',
        submission.detailedInfo.time || '-',
      ];
    });

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Medical_Data_${filterDate || 'All'}.csv`;
    link.click();
  };

  return (
    <Button onClick={handleExport} disabled={submissions.length === 0} className="gap-2 shadow-sm">
      <Download size={16} />
      Export CSV
    </Button>
  );
}
