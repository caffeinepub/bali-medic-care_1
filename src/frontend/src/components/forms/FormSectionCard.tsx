import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormSectionCardProps {
  children: ReactNode;
  className?: string;
}

export default function FormSectionCard({ children, className }: FormSectionCardProps) {
  return (
    <div className={cn('bg-card rounded-xl shadow-sm border border-border p-6', className)}>
      {children}
    </div>
  );
}
