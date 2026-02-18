import { ChevronRight, Loader2 } from 'lucide-react';
import { SubmissionStatus } from '@/backend';
import type { PatientSubmission } from '@/backend';

interface SubmissionsTableProps {
  submissions: PatientSubmission[];
  isLoading: boolean;
  onSelectSubmission: (submission: PatientSubmission) => void;
}

export default function SubmissionsTable({ submissions, isLoading, onSelectSubmission }: SubmissionsTableProps) {
  const extractField = (context: string, field: string): string | null => {
    const regex = new RegExp(`${field}:\\s*([^,]+)`, 'i');
    const match = context.match(regex);
    return match ? match[1].trim() : null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
        <p className="text-muted-foreground">No submissions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((submission) => {
        // Warn if submission has id=0
        if (submission.id === BigInt(0)) {
          console.warn('⚠️ SubmissionsTable: Rendering submission with id=0');
        }

        const context = submission.detailedInfo.context || '';
        const name = extractField(context, 'Name') || 'Unknown';
        const room = extractField(context, 'Room') || 'N/A';
        const date = submission.detailedInfo.date || 'N/A';
        const isCompleted = submission.submissionStatus === SubmissionStatus.completed;

        return (
          <div
            key={submission.id.toString()}
            onClick={() => onSelectSubmission(submission)}
            className="bg-card p-4 rounded-xl shadow-sm border border-border hover:border-primary cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                    isCompleted ? 'bg-green-600' : 'bg-primary'
                  }`}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">{name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Room: {room} • {date}
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
