"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/frontend/auth-client";

interface AuthButtonProps {
	signedIn?: ReactNode;
	signedOut?: ReactNode;
	loading?: ReactNode;
}

export function AuthButton({ signedIn, signedOut, loading }: AuthButtonProps) {
	const { data: session, isPending } = authClient.useSession();
	const isAuthed = !!session?.session;

	if (isPending) return loading ?? null;
	if (isAuthed) return <>{signedIn}</>;
	return <>{signedOut}</>;
}

export function SignOutButton({
	variant = "ghost",
	size = "sm",
}: {
	variant?: "primary" | "secondary" | "destructive" | "ghost";
	size?: "sm" | "md" | "lg";
}) {
	return (
		<AuthButton
			signedIn={
				<Button
					variant={variant}
					size={size}
					onClick={async () => {
						await authClient.signOut();
						window.location.href = "/";
					}}
				>
					Sign out
				</Button>
			}
		/>
	);
}

export function SignInButton({
	href = "/auth/sign-in",
	variant = "ghost",
	size = "sm",
	children = "Sign in",
}: {
	href?: string;
	variant?: "primary" | "secondary" | "destructive" | "ghost";
	size?: "sm" | "md" | "lg";
	children?: ReactNode;
}) {
	return (
		<AuthButton
			signedOut={
				<Link href={href}>
					<Button variant={variant} size={size}>
						{children}
					</Button>
				</Link>
			}
		/>
	);
}

export function DashboardButton({
	href = "/dashboard",
	variant = "ghost",
	size = "sm",
	children = "Dashboard",
}: {
	href?: string;
	variant?: "primary" | "secondary" | "destructive" | "ghost";
	size?: "sm" | "md" | "lg";
	children?: ReactNode;
}) {
	return (
		<AuthButton
			signedIn={
				<Link href={href}>
					<Button variant={variant} size={size}>
						{children}
					</Button>
				</Link>
			}
		/>
	);
}
