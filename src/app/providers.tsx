"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth-ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { authClient } from "@/lib/auth/client";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NeonAuthUIProvider
        authClient={authClient}
        navigate={router.push}
        replace={router.replace}
        onSessionChange={() => {
          router.refresh();
        }}
        emailOTP
        redirectTo="/dashboard"
        Link={Link}
      >
        {children}
      </NeonAuthUIProvider>
    </QueryClientProvider>
  );
}
