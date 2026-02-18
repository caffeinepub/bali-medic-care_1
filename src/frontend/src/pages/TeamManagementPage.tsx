import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { ArrowLeft, User, Activity, Save, MessageSquare, UserCheck, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useGetAllPatientSubmissions, useUpdatePatientSubmission } from '@/hooks/useSubmissions';
import { SubmissionStatus } from '@/backend';
import type { PatientSubmission } from '@/backend';

export default function TeamManagementPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { submissionId?: string };
  const { data: submissions = [] } = useGetAllPatientSubmissions();
  const updateSubmission = useUpdatePatientSubmission();

  const [selectedPatient, setSelectedPatient] = useState<PatientSubmission | null>(null);
  const [medicalUpdate, setMedicalUpdate] = useState({
    tensi: '',
    nadi: '',
    oksigen: '',
    bloodSugar: '',
    cholesterol: '',
    uricAcid: '',
    teamMedicalConditions: '',
    meetDoctor: 'yes',
    meetingDate: '2025-02-11',
    meetingTime: '12:30',
  });

  useEffect(() => {
    if (search.submissionId && submissions.length > 0) {
      const submission = submissions.find((s) => s.id.toString() === search.submissionId);
      if (submission) {
        setSelectedPatient(submission);
        const context = submission.detailedInfo.context || '';
        setMedicalUpdate({
          tensi: extractField(context, 'Blood Pressure') || '',
          nadi: extractField(context, 'Pulse') || '',
          oksigen: extractField(context, 'Oxygen') || '',
          bloodSugar: extractField(context, 'Blood Sugar') || '',
          cholesterol: extractField(context, 'Cholesterol') || '',
          uricAcid: extractField(context, 'Uric Acid') || '',
          teamMedicalConditions: submission.notes || '',
          meetDoctor: extractField(context, 'Meet Doctor') === 'No' ? 'no' : 'yes',
          meetingDate: extractField(context, 'Meeting Date') || '2025-02-11',
          meetingTime: extractField(context, 'Meeting Time') || '12:30',
        });
      }
    }
  }, [search.submissionId, submissions]);

  const extractField = (context: string, field: string): string | null => {
    const regex = new RegExp(`${field}:\\s*([^,]+)`, 'i');
    const match = context.match(regex);
    return match ? match[1].trim() : null;
  };

  const extractPatientInfo = (context: string) => {
    return {
      name: extractField(context, 'Name') || 'N/A',
      room: extractField(context, 'Room') || 'N/A',
      nationality: extractField(context, 'Nationality') || 'N/A',
      whatsapp: extractField(context, 'WhatsApp') || '',
      symptoms: extractField(context, 'Symptoms') || 'N/A',
    };
  };

  const formatWAUrl = (num: string) => {
    if (!num) return '#';
    let cleaned = num.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    }
    return `https://wa.me/${cleaned}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      const patientInfo = extractPatientInfo(selectedPatient.detailedInfo.context || '');
      const updatedContext = `Name: ${patientInfo.name}, Room: ${patientInfo.room}, Nationality: ${patientInfo.nationality}, WhatsApp: ${patientInfo.whatsapp}, Symptoms: ${patientInfo.symptoms}, Blood Pressure: ${medicalUpdate.tensi}, Pulse: ${medicalUpdate.nadi}, Oxygen: ${medicalUpdate.oksigen}, Blood Sugar: ${medicalUpdate.bloodSugar}, Cholesterol: ${medicalUpdate.cholesterol}, Uric Acid: ${medicalUpdate.uricAcid}, Meet Doctor: ${medicalUpdate.meetDoctor === 'yes' ? 'Yes' : 'No'}, Meeting Date: ${medicalUpdate.meetDoctor === 'yes' ? medicalUpdate.meetingDate : '-'}, Meeting Time: ${medicalUpdate.meetDoctor === 'yes' ? medicalUpdate.meetingTime : '-'}`;

      await updateSubmission.mutateAsync({
        ...selectedPatient,
        detailedInfo: {
          ...selectedPatient.detailedInfo,
          context: updatedContext,
        },
        notes: medicalUpdate.teamMedicalConditions,
        submissionStatus: SubmissionStatus.completed,
      });

      navigate({ to: '/exam-success', search: { submissionId: selectedPatient.id.toString() } });
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  if (!selectedPatient) {
    return (
      <div className="bg-muted/30 min-h-[calc(100vh-8rem)] py-8">
        <div className="container max-w-3xl mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate({ to: '/dashboard' })} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <p className="text-center text-muted-foreground">No patient selected</p>
        </div>
      </div>
    );
  }

  const patientInfo = extractPatientInfo(selectedPatient.detailedInfo.context || '');

  return (
    <div className="bg-muted/30 min-h-[calc(100vh-8rem)] py-8">
      <div className="container max-w-3xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate({ to: '/dashboard' })} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="space-y-4">
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="bg-primary/5 p-4 border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <User size={18} className="text-primary" />
                <h3 className="font-bold text-primary">Patient Details</h3>
              </div>
              {patientInfo.whatsapp && (
                <a
                  href={formatWAUrl(patientInfo.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <MessageSquare size={14} />
                  WhatsApp
                </a>
              )}
            </div>
            <div className="p-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Name</p>
                <p className="font-medium text-foreground">{patientInfo.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Room</p>
                <p className="font-medium text-foreground">{patientInfo.room}</p>
              </div>
              <div className="col-span-2 pt-2 border-t border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Symptoms</p>
                <p className="text-foreground italic">"{patientInfo.symptoms}"</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="bg-primary p-4 text-primary-foreground flex items-center gap-2">
              <Activity size={18} />
              <h3 className="font-bold">Medical Examination</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Blood Pressure', name: 'tensi', unit: 'mmHg' },
                  { label: 'Pulse', name: 'nadi', unit: 'bpm' },
                  { label: 'Oxygen', name: 'oksigen', unit: '%' },
                  { label: 'Blood Sugar', name: 'bloodSugar', unit: 'mg/dL' },
                  { label: 'Cholesterol', name: 'cholesterol', unit: 'mg/dL' },
                  { label: 'Uric Acid', name: 'uricAcid', unit: 'mg/dL' },
                ].map((field) => (
                  <div key={field.name}>
                    <Label htmlFor={field.name} className="text-xs font-bold text-muted-foreground uppercase mb-1">
                      {field.label}
                    </Label>
                    <Input
                      id={field.name}
                      type="text"
                      placeholder={field.unit}
                      value={medicalUpdate[field.name as keyof typeof medicalUpdate] as string}
                      onChange={(e) => setMedicalUpdate({ ...medicalUpdate, [field.name]: e.target.value })}
                      className="border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary focus-visible:border-b-2 transition-all bg-transparent px-0"
                    />
                  </div>
                ))}
              </div>

              <div>
                <Label htmlFor="notes" className="text-xs font-bold text-muted-foreground uppercase mb-1">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  rows={2}
                  value={medicalUpdate.teamMedicalConditions}
                  onChange={(e) => setMedicalUpdate({ ...medicalUpdate, teamMedicalConditions: e.target.value })}
                  className="bg-muted/50 border-border focus-visible:border-primary transition-all resize-none"
                />
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="text-xs font-bold text-primary mb-4 uppercase">Doctor Plan</h4>
                <div className="flex gap-4 mb-6">
                  <Button
                    type="button"
                    onClick={() => setMedicalUpdate({ ...medicalUpdate, meetDoctor: 'yes' })}
                    variant={medicalUpdate.meetDoctor === 'yes' ? 'default' : 'outline'}
                    className="flex-1 gap-2"
                  >
                    <UserCheck size={18} />
                    Yes
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setMedicalUpdate({ ...medicalUpdate, meetDoctor: 'no' })}
                    variant={medicalUpdate.meetDoctor === 'no' ? 'default' : 'outline'}
                    className="flex-1 gap-2"
                  >
                    <UserMinus size={18} />
                    No
                  </Button>
                </div>
                {medicalUpdate.meetDoctor === 'yes' && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="date"
                      value={medicalUpdate.meetingDate}
                      onChange={(e) => setMedicalUpdate({ ...medicalUpdate, meetingDate: e.target.value })}
                      className="border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary focus-visible:border-b-2 transition-all bg-transparent px-0"
                    />
                    <Input
                      type="time"
                      value={medicalUpdate.meetingTime}
                      onChange={(e) => setMedicalUpdate({ ...medicalUpdate, meetingTime: e.target.value })}
                      className="border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary focus-visible:border-b-2 transition-all bg-transparent px-0"
                    />
                  </div>
                )}
              </div>

              <Button type="submit" disabled={updateSubmission.isPending} className="w-full py-6 font-bold shadow-lg">
                {updateSubmission.isPending ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Finish & Save
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
