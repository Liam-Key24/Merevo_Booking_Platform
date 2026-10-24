import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "accent" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-merevo-teal text-merevo-text-inverse hover:bg-[#125a69] active:bg-[#0f4d5a]",
  secondary:
    "bg-merevo-surface text-merevo-text border border-merevo-border hover:border-merevo-border-strong hover:bg-merevo-surface-subtle",
  ghost:
    "bg-transparent text-merevo-text hover:bg-merevo-surface-subtle",
  accent:
    "bg-merevo-accent text-merevo-text hover:bg-[#f09820] active:bg-[#e08c18]",
  danger:
    "bg-merevo-status-declined text-merevo-text-inverse hover:bg-[#9a1e14]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  fullWidth = false,
  type = "button",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "cursor-pointer inline-flex items-center justify-center gap-2 rounded-merevo font-semibold tracking-tight transition-colors",
        "focus-visible:shadow-[var(--merevo-focus-ring)]",
        "disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
}
