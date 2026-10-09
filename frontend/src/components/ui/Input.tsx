import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...rest }, ref) => {
    const inputId = id ?? rest.name;
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-dagno-ink"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-10 px-3 rounded border bg-white text-sm",
            "border-dagno-border focus:border-dagno-blue focus:outline-none",
            "placeholder:text-dagno-inkSoft/60",
            error && "border-dagno-danger",
            className
          )}
          {...rest}
        />
        {error && <span className="text-xs text-dagno-danger">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";