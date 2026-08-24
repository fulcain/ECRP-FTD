import Image from "next/image";
import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginButton } from "@/app/login/LoginButton";

export const metadata: Metadata = {
  title: "FTD App | Sign in",
  description: "Sign in with Discord to access the FTD app.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-lg border border-border/40 bg-surface p-8 text-center space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <Image alt="FT" src="/FT.png" height={36} width={36} priority />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">
              FTD App
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in with Discord to continue.
            </p>
          </div>
        </div>

        <Suspense fallback={null}>
          <LoginButton />
        </Suspense>

        <p className="text-xs text-muted-foreground pt-4 border-t border-border/30">
          You must be a member of the ECRP Discord server.
        </p>
      </div>
    </div>
  );
}