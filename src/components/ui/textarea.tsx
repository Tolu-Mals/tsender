import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border-2 border-slate-200 bg-white/5 px-2.5 py-2 text-base transition-all outline-none placeholder:text-muted-foreground focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:border-white/10 dark:bg-white/5 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400/20",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
