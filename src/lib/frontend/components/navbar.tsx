"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { APP_NAME } from "@/constants";

interface NavbarProps {
	children?: ReactNode;
}

export function Navbar({ children }: NavbarProps) {
	if (!children) return null;

	return (
		<nav className="flex items-center justify-between p-6">
			<Link href="/" className="text-lg font-bold">
				{APP_NAME}
			</Link>
			{children}
		</nav>
	);
}
