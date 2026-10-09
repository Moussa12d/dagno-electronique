import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type Tone = "blue" | "green" | "gray" | "orange" | "red";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const toneClasses: Record<Tone, string> = {
  blue: "bg-dagno-blueLight text-dagno-blueDark border-dagno-blue/20",
  green: "bg-green-50 text-dagno-success border-dagno-success/20",
  gray: "bg-dagno-bg text-dagno-inkSoft border-dagno-border",
  orange: "bg-amber-50 text-dagno-warning border-dagno-warning/20",
  red: "bg-red-50 text-dagno-danger border-dagno-danger/20",
};

export function Badge({ tone = "gray", className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border",
        toneClasses[tone],
        className
      )}
      {...rest}
    />
  );
}