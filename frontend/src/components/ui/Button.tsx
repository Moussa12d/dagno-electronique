import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-dagno-blue text-white hover:bg-dagno-blueDark disabled:bg-dagno-blue/50",
  secondary:
    "bg-white text-dagno-ink border border-dagno-border hover:border-dagno-ink/40 hover:bg-dagno-bg",
  ghost: "bg-transparent text-dagno-ink hover:bg-dagno-ink/5",
  danger: "bg-dagno-danger text-white hover:bg-dagno-danger/90",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", loading, className, children, ...rest },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium rounded transition-colors",
          "disabled:cursor-not-allowed disabled:opacity-60",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={loading || rest.disabled}
        {...rest}
      >
        {loading ? "Chargement..." : children}
      </button>
    );
  }
);

Button.displayName = "Button";