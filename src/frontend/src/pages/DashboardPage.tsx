import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ClipboardList } from 'lucide-react';
import { useGetAllPatientSubmissions } from '@/hooks/useSubmissions';
import DashboardFiltersBar from '@/components/dashboard/DashboardFiltersBar';
import SubmissionsTable from '@/components/dashboard/SubmissionsTable';
import ExportButton from '@/components/dashboard/ExportButton';
import type { PatientSubmission } from '@/backend';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: submissions = [], isLoading } = useGetAllPatientSubmissions();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Runtime regression check for id=0 submissions
  if (submissions.length > 0) {
    const zeroIdSubmissions = submissions.filter(s => s.id === BigInt(0));
    if (zeroIdSubmissions.length > 0) {
      console.warn('⚠️ Dashboard: Found submissions with id=0:', zeroIdSubmissions.length);
    }
  }

  const filteredSubmissions = submissions.filter((submission) => {
    const context = submission.detailedInfo.context || '';
    const matchesSearch =
      context.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.id.toString().includes(searchTerm);

    const submissionDate = submission.detailedInfo.date || '';
    const matchesDate = !filterDate || submissionDate === filterDate;

    return matchesSearch && matchesDate;
  });

  const handleSelectSubmission = (submission: PatientSubmission) => {
    console.log('📋 Navigating to team page with submission ID:', submission.id.toString());
    navigate({
      to: '/team',
      search: { submissionId: submission.id.toString() },
    });
  };

  return (
    <div className="bg-muted/30 min-h-[calc(100vh-8rem)] py-8">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <ClipboardList className="text-primary h-8 w-8" />
              Dashboard
            </h2>
            <ExportButton submissions={filteredSubmissions} filterDate={filterDate} />
          </div>

          <DashboardFiltersBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterDate={filterDate}
            onDateChange={setFilterDate}
          />
        </div>

        <SubmissionsTable
          submissions={filteredSubmissions}
          isLoading={isLoading}
          onSelectSubmission={handleSelectSubmission}
        />
      </div>
    </div>
  );
}
