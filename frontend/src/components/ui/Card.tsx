import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-white border border-dagno-border rounded-md shadow-card",
        className
      )}
      {...rest}
    />
  );
}