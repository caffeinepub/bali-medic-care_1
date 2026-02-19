import { User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { PatientSubmission } from '@/backend';
import { getPatientDetailsViewModel } from '@/utils/patientSubmissionDetails';

interface PatientDetailsCardProps {
  submission: PatientSubmission;
  onWhatsAppClick?: () => void;
}

export default function PatientDetailsCard({ submission, onWhatsAppClick }: PatientDetailsCardProps) {
  const details = getPatientDetailsViewModel(submission);

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="bg-primary/5 p-4 border-b border-border flex justify-between items-center">
        <div className="flex items-center gap-2">
          <User size={18} className="text-primary" />
          <h3 className="font-bold text-primary">Patient Details</h3>
        </div>
        {details.personalInfo.whatsappNumber !== 'N/A' && onWhatsAppClick && (
          <Button
            onClick={onWhatsAppClick}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white gap-2"
          >
            <MessageSquare size={16} />
            Send Results
          </Button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Basic Information */}
        <div>
          <h4 className="font-semibold text-sm text-foreground mb-2">Basic Information</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Submission ID</p>
              <p className="text-sm font-medium text-foreground">{details.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Clinic ID</p>
              <p className="text-sm font-medium text-foreground">{details.clinicId}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Patient ID</p>
              <p className="text-sm font-medium text-foreground">{details.patientId}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="text-sm font-medium text-foreground">{details.submissionStatus}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Personal Information */}
        <div>
          <h4 className="font-semibold text-sm text-foreground mb-2">Personal Information</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="text-sm font-medium text-foreground">{details.personalInfo.fullName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Country</p>
              <p className="text-sm font-medium text-foreground">{details.personalInfo.country}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Room Number</p>
              <p className="text-sm font-medium text-foreground">{details.personalInfo.roomNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">WhatsApp Number</p>
              <p className="text-sm font-medium text-foreground">{details.personalInfo.whatsappNumber}</p>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Medical Conditions</p>
              <p className="text-sm text-foreground">{details.personalInfo.medicalConditions}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Symptoms</p>
              <p className="text-sm text-foreground">{details.personalInfo.symptoms}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Demographic Information */}
        <div>
          <h4 className="font-semibold text-sm text-foreground mb-2">Demographic Information</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="text-sm font-medium text-foreground">{details.demographic.age}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Unit of Measure</p>
              <p className="text-sm font-medium text-foreground">{details.demographic.unitOfMeasure}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gender</p>
              <p className="text-sm font-medium text-foreground">{details.demographic.gender}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gestational Age</p>
              <p className="text-sm font-medium text-foreground">{details.demographic.gestationalAge}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Timestamps */}
        <div>
          <h4 className="font-semibold text-sm text-foreground mb-2">Timestamps</h4>
          <div className="grid grid-cols-1 gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Submission Time</p>
              <p className="text-sm font-medium text-foreground">{details.timestamps.submission}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Recorded Time</p>
              <p className="text-sm font-medium text-foreground">{details.timestamps.recorded}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Follow-up Time</p>
              <p className="text-sm font-medium text-foreground">{details.timestamps.followUp}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Detailed Information */}
        <div>
          <h4 className="font-semibold text-sm text-foreground mb-2">Detailed Information</h4>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium text-foreground">{details.detailedInfo.date}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="text-sm font-medium text-foreground">{details.detailedInfo.time}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Context</p>
              <p className="text-sm text-foreground break-words">{details.detailedInfo.context}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
