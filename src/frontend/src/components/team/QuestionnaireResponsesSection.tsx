import type { QuestionResponse } from '@/backend';

interface QuestionnaireResponsesSectionProps {
  title: string;
  responses: QuestionResponse[];
}

export default function QuestionnaireResponsesSection({ title, responses }: QuestionnaireResponsesSectionProps) {
  if (responses.length === 0) {
    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-sm text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground italic">No responses recorded</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-sm text-foreground">{title}</h4>
      <div className="space-y-3">
        {responses.map((response, index) => (
          <div key={index} className="bg-muted/30 rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Score Type</p>
                <p className="text-sm font-medium text-foreground">
                  {response.scoreType || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Score</p>
                <p className="text-sm font-medium text-foreground">
                  {response.answer.score.toString()}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Answer</p>
              <p className="text-sm text-foreground">{response.answer.text}</p>
            </div>
            {response.feedbackText && (
              <div>
                <p className="text-xs text-muted-foreground">Feedback</p>
                <p className="text-sm text-foreground">{response.feedbackText}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
