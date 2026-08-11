import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
	primary:
		"bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-accent disabled:text-accent-foreground",
	secondary:
		"bg-secondary text-secondary-foreground hover:bg-accent disabled:bg-accent disabled:text-accent-foreground",
	destructive: "bg-destructive text-white hover:bg-red-700 disabled:bg-red-400 disabled:text-white",
	ghost:
		"hover:bg-accent hover:text-accent-foreground disabled:bg-transparent disabled:text-muted-foreground",
};

const sizeStyles: Record<ButtonSize, string> = {
	sm: "h-8 px-3 text-sm",
	md: "h-10 px-4 text-sm",
	lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ variant = "primary", size = "md", className = "", ...props }, ref) => {
		return (
			<button
				ref={ref}
				type="button"
				className={`inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";
