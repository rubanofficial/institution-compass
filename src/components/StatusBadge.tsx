import { ComplaintStatus, ComplaintPriority } from '@/types/complaint';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ComplaintStatus;
  className?: string;
}

const statusConfig: Record<ComplaintStatus, { label: string; className: string }> = {
  submitted: { label: 'Submitted', className: 'status-submitted' },
  in_review: { label: 'In Review', className: 'status-in-review' },
  resolved: { label: 'Resolved', className: 'status-resolved' },
  rejected: { label: 'Rejected', className: 'status-rejected' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: ComplaintPriority;
  className?: string;
}

const priorityConfig: Record<ComplaintPriority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'priority-low' },
  medium: { label: 'Medium', className: 'priority-medium' },
  high: { label: 'High', className: 'priority-high' },
  critical: { label: 'Critical', className: 'priority-high' },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  
  return (
    <span className={cn('text-sm font-medium', config.className, className)}>
      {config.label}
    </span>
  );
}
