"use client";

import type { ReactNode } from "react";

interface FooterProps {
	children?: ReactNode;
}

export function Footer({ children }: FooterProps) {
	if (!children) return null;

	return (
		<footer className="flex items-center justify-between p-6 text-sm text-muted-foreground">
			{children}
		</footer>
	);
}
