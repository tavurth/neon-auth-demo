import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className = "", ...props }, ref) => {
		return (
			<input
				ref={ref}
				className={`flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring ${className}`}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";
