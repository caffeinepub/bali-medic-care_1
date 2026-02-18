import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { ArrowLeft, Activity, Save, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useGetAllPatientSubmissions, useUpdatePatientSubmission } from '@/hooks/useSubmissions';
import { SubmissionStatus } from '@/backend';
import type { PatientSubmission } from '@/backend';
import { buildWhatsAppUrl } from '@/utils/whatsapp';
import PatientDetailsCard from '@/components/team/PatientDetailsCard';

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

  const getPatientInfo = (submission: PatientSubmission) => {
    // Prefer structured personalInfo fields, fallback to context parsing
    if (submission.personalInfo.fullName) {
      return {
        name: submission.personalInfo.fullName || 'N/A',
        room: submission.personalInfo.roomNumber || 'N/A',
        nationality: submission.personalInfo.country || 'N/A',
        whatsapp: submission.personalInfo.whatsappNumber || '',
        symptoms: submission.personalInfo.symptoms || submission.personalInfo.medicalConditions || 'N/A',
      };
    }
    
    // Fallback to context parsing for older submissions
    const context = submission.detailedInfo.context || '';
    return {
      name: extractField(context, 'Name') || 'N/A',
      room: extractField(context, 'Room') || 'N/A',
      nationality: extractField(context, 'Nationality') || 'N/A',
      whatsapp: extractField(context, 'WhatsApp') || '',
      symptoms: extractField(context, 'Symptoms') || 'N/A',
    };
  };

  const handleWhatsAppClick = () => {
    if (!selectedPatient) return;
    
    const whatsappUrl = buildWhatsAppUrl(selectedPatient);
    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      const patientInfo = getPatientInfo(selectedPatient);
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

  return (
    <div className="bg-muted/30 min-h-[calc(100vh-8rem)] py-8">
      <div className="container max-w-3xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate({ to: '/dashboard' })} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="space-y-4">
          <PatientDetailsCard submission={selectedPatient} onWhatsAppClick={handleWhatsAppClick} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
              <div className="bg-primary/5 p-4 border-b border-border flex items-center gap-2">
                <Activity size={18} className="text-primary" />
                <h3 className="font-bold text-primary">Medical Examination</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tensi" className="text-sm font-bold">
                      Blood Pressure (Tensi)
                    </Label>
                    <Input
                      id="tensi"
                      type="text"
                      placeholder="e.g. 120/80"
                      value={medicalUpdate.tensi}
                      onChange={(e) => setMedicalUpdate({ ...medicalUpdate, tensi: e.target.value })}
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nadi" className="text-sm font-bold">
                      Pulse (Nadi)
                    </Label>
                    <Input
                      id="nadi"
                      type="text"
                      placeholder="e.g. 72 bpm"
                      value={medicalUpdate.nadi}
                      onChange={(e) => setMedicalUpdate({ ...medicalUpdate, nadi: e.target.value })}
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oksigen" className="text-sm font-bold">
                      Oxygen Saturation
                    </Label>
                    <Input
                      id="oksigen"
                      type="text"
                      placeholder="e.g. 98%"
                      value={medicalUpdate.oksigen}
                      onChange={(e) => setMedicalUpdate({ ...medicalUpdate, oksigen: e.target.value })}
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodSugar" className="text-sm font-bold">
                      Blood Sugar
                    </Label>
                    <Input
                      id="bloodSugar"
                      type="text"
                      placeholder="e.g. 95 mg/dL"
                      value={medicalUpdate.bloodSugar}
                      onChange={(e) => setMedicalUpdate({ ...medicalUpdate, bloodSugar: e.target.value })}
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cholesterol" className="text-sm font-bold">
                      Cholesterol
                    </Label>
                    <Input
                      id="cholesterol"
                      type="text"
                      placeholder="e.g. 180 mg/dL"
                      value={medicalUpdate.cholesterol}
                      onChange={(e) => setMedicalUpdate({ ...medicalUpdate, cholesterol: e.target.value })}
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uricAcid" className="text-sm font-bold">
                      Uric Acid
                    </Label>
                    <Input
                      id="uricAcid"
                      type="text"
                      placeholder="e.g. 5.5 mg/dL"
                      value={medicalUpdate.uricAcid}
                      onChange={(e) => setMedicalUpdate({ ...medicalUpdate, uricAcid: e.target.value })}
                      className="bg-muted/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamMedicalConditions" className="text-sm font-bold">
                    Medical Team Notes
                  </Label>
                  <Textarea
                    id="teamMedicalConditions"
                    rows={4}
                    placeholder="Additional notes from medical team..."
                    value={medicalUpdate.teamMedicalConditions}
                    onChange={(e) => setMedicalUpdate({ ...medicalUpdate, teamMedicalConditions: e.target.value })}
                    className="bg-muted/50 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
              <div className="bg-primary/5 p-4 border-b border-border flex items-center gap-2">
                <UserCheck size={18} className="text-primary" />
                <h3 className="font-bold text-primary">Doctor Appointment</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold">Does patient need to meet doctor?</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="meetDoctor"
                        value="yes"
                        checked={medicalUpdate.meetDoctor === 'yes'}
                        onChange={(e) => setMedicalUpdate({ ...medicalUpdate, meetDoctor: e.target.value })}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="meetDoctor"
                        value="no"
                        checked={medicalUpdate.meetDoctor === 'no'}
                        onChange={(e) => setMedicalUpdate({ ...medicalUpdate, meetDoctor: e.target.value })}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </div>

                {medicalUpdate.meetDoctor === 'yes' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="meetingDate" className="text-sm font-bold">
                        Meeting Date
                      </Label>
                      <Input
                        id="meetingDate"
                        type="date"
                        value={medicalUpdate.meetingDate}
                        onChange={(e) => setMedicalUpdate({ ...medicalUpdate, meetingDate: e.target.value })}
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meetingTime" className="text-sm font-bold">
                        Meeting Time
                      </Label>
                      <Input
                        id="meetingTime"
                        type="time"
                        value={medicalUpdate.meetingTime}
                        onChange={(e) => setMedicalUpdate({ ...medicalUpdate, meetingTime: e.target.value })}
                        className="bg-muted/50"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" disabled={updateSubmission.isPending} className="w-full py-6 text-lg font-bold shadow-lg">
              {updateSubmission.isPending ? (
                'Saving...'
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Save Medical Examination
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
