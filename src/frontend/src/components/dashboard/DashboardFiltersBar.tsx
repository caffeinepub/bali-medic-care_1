import { Search, CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DashboardFiltersBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterDate: string;
  onDateChange: (value: string) => void;
}

export default function DashboardFiltersBar({
  searchTerm,
  onSearchChange,
  filterDate,
  onDateChange,
}: DashboardFiltersBarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-card p-4 rounded-xl shadow-sm border border-border">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          type="text"
          placeholder="Search by name, room, or ID..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-muted/50"
        />
      </div>
      <div className="relative">
        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          type="date"
          value={filterDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="pl-10 bg-muted/50"
        />
      </div>
    </div>
  );
}
