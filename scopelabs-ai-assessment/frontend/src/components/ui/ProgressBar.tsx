import { cn } from './Button';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className={cn('w-full', className)}>
      <div className="h-2 md:h-2.5 w-full bg-gray-200/60 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-primary-light to-primary shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
