import { forwardRef, type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
	({ className = "", ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={`rounded-md border border-border bg-background p-4 ${className}`}
				{...props}
			/>
		);
	},
);
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, CardProps>(
	({ className = "", ...props }, ref) => {
		return <div ref={ref} className={`mb-4 ${className}`} {...props} />;
	},
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<
	HTMLHeadingElement,
	HTMLAttributes<HTMLHeadingElement>
>(({ className = "", ...props }, ref) => {
	return <h3 ref={ref} className={`font-medium ${className}`} {...props} />;
});
CardTitle.displayName = "CardTitle";

export const CardContent = forwardRef<HTMLDivElement, CardProps>(
	({ className = "", ...props }, ref) => {
		return <div ref={ref} className={className} {...props} />;
	},
);
CardContent.displayName = "CardContent";
