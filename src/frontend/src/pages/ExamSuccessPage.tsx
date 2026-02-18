import { useNavigate, useSearch } from '@tanstack/react-router';
import { CheckCircle2, ArrowLeft, MapPin, ExternalLink, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetAllPatientSubmissions } from '@/hooks/useSubmissions';

export default function ExamSuccessPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { submissionId?: string };
  const { data: submissions = [] } = useGetAllPatientSubmissions();

  const selectedPatient = submissions.find((s) => s.id.toString() === search.submissionId);

  const extractField = (context: string, field: string): string | null => {
    const regex = new RegExp(`${field}:\\s*([^,]+)`, 'i');
    const match = context.match(regex);
    return match ? match[1].trim() : null;
  };

  const patientName = selectedPatient
    ? extractField(selectedPatient.detailedInfo.context || '', 'Name') || 'Patient'
    : 'Patient';

  const googleMapsUrl = 'https://share.google/FHNcPzGbdwQSjKj3n';

  return (
    <div className="bg-muted/30 min-h-[calc(100vh-8rem)] py-8">
      <div className="container max-w-3xl mx-auto px-4">
        <div className="bg-card rounded-2xl shadow-xl overflow-hidden border-t-8 border-t-primary animate-in zoom-in duration-300">
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3">Examination Finished!</h1>
            <p className="text-muted-foreground mb-8 italic text-lg">
              The medical record for <span className="font-bold text-foreground">{patientName}</span> has been updated
              successfully.
            </p>

            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 mb-8">
              <div className="flex justify-center mb-4 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-amber-400 fill-amber-400" size={28} />
                ))}
              </div>
              <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-2">Help us grow!</h2>
              <p className="text-amber-800 dark:text-amber-200 text-sm mb-6">
                Please ask the patient to leave a 5-star review on our Google Maps profile.
              </p>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all w-full justify-center"
              >
                <MapPin size={20} />
                Review on Google Maps
                <ExternalLink size={16} />
              </a>
            </div>

            <Button variant="ghost" onClick={() => navigate({ to: '/dashboard' })} className="gap-2">
              <ArrowLeft size={18} />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
