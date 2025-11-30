import { cn } from '@/lib/utils';

interface SimpleProgressProps {
  value: number;
  className?: string;
}

export function SimpleProgress({ value, className }: SimpleProgressProps) {
  return (
    <div className={cn('relative h-2 w-full overflow-hidden rounded-full bg-gray-200', className)}>
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
