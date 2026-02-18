import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Send, Activity, MapPin, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSectionCard from '@/components/forms/FormSectionCard';
import RequiredMarker from '@/components/forms/RequiredMarker';
import { useSubmitPatientForm } from '@/hooks/useSubmissions';
import { SubmissionStatus } from '@/backend';
import { toast } from 'sonner';

export default function PatientFormPage() {
  const navigate = useNavigate();
  const submitForm = useSubmitPatientForm();

  const [formData, setFormData] = useState({
    name: '',
    nationality: '',
    roomNumber: '',
    whatsapp: '',
    patientMedicalConditions: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log('📤 Submitting patient form...');
      
      const submissionId = await submitForm.mutateAsync({
        id: BigInt(0),
        clinicId: 'apsp',
        patientId: undefined,
        demographic: {
          age: undefined,
          unitOfMeasure: undefined,
          gestationalAge: undefined,
          gender: undefined,
        },
        submissionStatus: SubmissionStatus.inProgress,
        initialScore: {
          obstructive: BigInt(0),
          central: BigInt(0),
        },
        responsesSectionA: [],
        responsesSectionB: [],
        feedbackCode: undefined,
        timestamps: {
          submission: {
            submission: BigInt(Date.now() * 1000000),
            recorded: undefined,
            followUp: undefined,
          },
          recorded: undefined,
          followUp: undefined,
        },
        detailedInfo: {
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0],
          context: `Name: ${formData.name}, Room: ${formData.roomNumber}, Nationality: ${formData.nationality}, WhatsApp: ${formData.whatsapp}, Symptoms: ${formData.patientMedicalConditions}`,
        },
        summary: {
          score: {
            obstructiveScore: undefined,
            centralScore: undefined,
          },
          status: SubmissionStatus.inProgress,
        },
        notes: formData.patientMedicalConditions,
        additionalInfo: undefined,
      });

      // Validate the returned ID
      if (submissionId === BigInt(0)) {
        console.warn('⚠️ Backend returned submission ID of 0, which may indicate an issue');
      } else {
        console.log('✅ Form submitted successfully with ID:', submissionId.toString());
      }

      navigate({ to: '/success' });
    } catch (error: any) {
      console.error('❌ Submission error:', error);
      console.error('Error details:', {
        message: error?.message,
        name: error?.name,
        stack: error?.stack,
        cause: error?.cause,
        raw: error,
      });
      
      // Log additional context if available
      if (error?.message) {
        console.error('Error message:', error.message);
      }
      
      toast.error('Failed to submit form. Please try again.');
    }
  };

  return (
    <div className="bg-muted/30 min-h-[calc(100vh-8rem)] py-8">
      <div className="container max-w-3xl mx-auto px-4">
        <FormSectionCard className="mb-6 border-t-8 border-t-primary">
          <div className="w-full bg-muted/50 flex justify-center border-b border-border mb-6 -mx-6 -mt-6">
            <img
              src="/assets/generated/bali-medic-care-banner.dim_1600x400.png"
              alt="Bali Medic Care Banner"
              className="w-full max-h-[200px] object-contain p-4"
            />
          </div>

          <h1 className="text-3xl font-bold mb-4 text-primary">Free Health Check Registration Form</h1>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 p-4 rounded-r flex items-start gap-3">
              <ShieldCheck className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" size={20} />
              <p className="font-bold text-blue-800 dark:text-blue-300 italic leading-snug">
                This form is only for Hotel Paradiso guests.
              </p>
            </div>

            <div className="px-1">
              <p className="font-medium text-foreground mb-3 text-base">
                Register here to receive free basic health services:
              </p>
              <ul className="space-y-2 ml-2">
                <li className="flex items-center gap-2 text-foreground">
                  <span className="w-2 h-2 bg-primary rounded-full shrink-0"></span>
                  Blood pressure check
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <span className="w-2 h-2 bg-primary rounded-full shrink-0"></span>
                  Blood sugar check
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <span className="w-2 h-2 bg-primary rounded-full shrink-0"></span>
                  Basic medical consultation
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-border grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2 text-foreground">
                <MapPin size={16} className="text-red-500 shrink-0" />
                <p className="font-medium text-xs">
                  Location: <span className="font-bold uppercase">Hotel Paradiso</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-primary shrink-0" />
                <p className="font-bold text-xs text-primary">Provided by Bali Medic Care</p>
              </div>
            </div>
          </div>
        </FormSectionCard>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSectionCard>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-bold text-foreground">
                  Full Name <RequiredMarker />
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your answer"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary focus-visible:border-b-2 transition-all bg-transparent px-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality" className="text-sm font-bold text-foreground">
                  Nationality <RequiredMarker />
                </Label>
                <Input
                  id="nationality"
                  type="text"
                  placeholder="e.g. UK"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  required
                  className="border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary focus-visible:border-b-2 transition-all bg-transparent px-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomNumber" className="text-sm font-bold text-foreground">
                  Room Number <RequiredMarker />
                </Label>
                <Input
                  id="roomNumber"
                  type="text"
                  placeholder="e.g. 101"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  required
                  className="border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary focus-visible:border-b-2 transition-all bg-transparent px-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-sm font-bold text-foreground">
                  WhatsApp Number <RequiredMarker />
                </Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+..."
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  required
                  className="border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary focus-visible:border-b-2 transition-all bg-transparent px-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms" className="text-sm font-bold text-foreground">
                  Medical Conditions / Symptoms
                </Label>
                <Textarea
                  id="symptoms"
                  rows={3}
                  placeholder="What are you feeling right now?"
                  value={formData.patientMedicalConditions}
                  onChange={(e) => setFormData({ ...formData, patientMedicalConditions: e.target.value })}
                  className="bg-muted/50 border-border focus-visible:border-primary transition-all resize-none"
                />
              </div>
            </div>
          </FormSectionCard>

          <Button
            type="submit"
            disabled={submitForm.isPending}
            className="w-full py-6 text-lg font-bold shadow-lg"
          >
            {submitForm.isPending ? (
              'Submitting...'
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Submit Data
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
