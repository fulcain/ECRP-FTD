"use client";

import { useSearchParams } from "next/navigation";
import { MessageCircleWarning } from "lucide-react";

/**
 * Client island for /login. Reads ?returnTo / ?error / ?reason / ?loggedOut
 * and renders the appropriate CTA.
 *
 * Kept as a separate client component because `useSearchParams` requires
 * a Suspense boundary on the page (see Next 15 docs on Client Components
 * in a Server Component).
 */
export function LoginButton() {
  const params = useSearchParams();
  const returnTo = params.get("returnTo") ?? "/";
  const reason = params.get("reason");
  const error = params.get("error");
  const loggedOut = params.get("loggedOut");

  const loginHref = `/api/auth/discord/login?returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <div className="flex flex-col gap-3">
      {loggedOut === "1" && (
        <p className="text-sm text-muted-foreground text-center">
          You&apos;ve been signed out.
        </p>
      )}
      {reason === "expired" && (
        <p className="text-sm text-amber-500 text-center flex items-center justify-center gap-2">
          <MessageCircleWarning className="h-4 w-4" />
          Your session expired. Please sign in again.
        </p>
      )}
      {error && <ErrorBanner error={error} />}

      <a
        href={loginHref}
        className="inline-flex items-center justify-center gap-2 w-full rounded-md bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold py-3 px-4 transition-colors shadow-md"
      >
        <DiscordIcon className="w-5 h-5" />
        Continue with Discord
      </a>
    </div>
  );
}

function ErrorBanner({ error }: { error: string }) {
  const messages: Record<string, string> = {
    config:
      "OAuth is not configured correctly on the server. Contact an admin.",
    missing_params: "Discord's response was missing parameters. Try again.",
    bad_state:
      "Could not verify the OAuth response (state mismatch). Try again.",
    callback_failed:
      "Discord callback failed. Try again, and contact an admin if it persists.",
    access_denied: "You declined the authorization. Try again to continue.",
  };
  const msg = messages[error] ?? `OAuth error: ${error}`;
  return (
    <p className="text-sm text-red-500 text-center flex items-center justify-center gap-2">
      <MessageCircleWarning className="h-4 w-4" />
      {msg}
    </p>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  // Inline SVG of the official Discord logo so we don't need
  // an extra icon dependency just for this.
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.197.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.029zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.42 2.157-2.42 1.21 0 2.176 1.096 2.157 2.42 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.42 2.157-2.42 1.21 0 2.176 1.096 2.157 2.42 0 1.334-.946 2.419-2.157 2.419z" />
    </svg>
  );
}
