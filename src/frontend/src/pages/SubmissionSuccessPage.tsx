import { useNavigate } from '@tanstack/react-router';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SubmissionSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-muted/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg border-t-8 border-t-primary p-8 text-center animate-in fade-in zoom-in duration-300">
        <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-3">Thank You</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Your registration has been submitted successfully. Please wait for our medical team to contact you for your check-up.
        </p>
        <Button
          onClick={() => navigate({ to: '/' })}
          variant="outline"
          className="font-medium"
        >
          Submit another response
        </Button>
      </div>
    </div>
  );
}
