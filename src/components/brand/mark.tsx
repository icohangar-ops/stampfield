import { cn } from "cn";

export function Mark({
  className,
  label = true,
}: {
  className?: string;
  label?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg viewBox="0 0 32 32" aria-hidden="true" className="size-8 shrink-0">
        <rect width="32" height="32" rx="8" fill="#14573f" />
        <rect x="7" y="6" width="18" height="20" rx="2" fill="#f6f3ec" />
        <path d="M9 12h8M9 16h6" stroke="#1c1915" strokeWidth="1.4" />
        <circle cx="20.5" cy="13" r="1.7" fill="#c2410c" />
        <rect x="7" y="20" width="18" height="6" rx="1" fill="#9a3412" />
      </svg>
      {label ? (
        <span className="font-heading text-lg leading-none tracking-tight">
          StampField
        </span>
      ) : (
        <span className="sr-only">StampField</span>
      )}
    </span>
  );
}
