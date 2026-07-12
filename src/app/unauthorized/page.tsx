import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "FTD App | Access Denied",
  description: "Your Discord account doesn't have access to this page.",
};

/**
 * /unauthorized
 *
 * Shown by middleware when:
 *   • reason=not_in_guild  — Discord says the user isn't in our guild.
 *   • role gating failed for the requested path.
 *
 * The path is preserved so we can tell the user *what* they were trying
 * to access.
 */
export default async function UnauthorizedPage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string; reason?: string }>;
}) {
  const sp = await searchParams;
  const path = sp.path ?? "this page";
  const reason = sp.reason;

  const heading =
    reason === "not_in_guild"
      ? "You're not in the ECRP Discord server"
      : "Access denied";

  const body =
    reason === "not_in_guild" ? (
      <>
        Your Discord account isn&apos;t a member of the ECRP server, so it
        can&apos;t be granted access.{" "}
        <Link
          href={
            process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "https://discord.com/"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold hover:underline"
        >
          Join the server
        </Link>
        , then{" "}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          sign in again
        </Link>
        .
      </>
    ) : (
      <>
        Your Discord account doesn&apos;t have a role that grants access to{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">{path}</code>.
        Contact an FTD administrator to request the appropriate role.
      </>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-xl border bg-card text-card-foreground shadow-2xl p-8 space-y-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <ShieldAlert className="h-12 w-12 text-amber-500" />
          <Image alt="FT" src="/FT.png" height={50} width={50} />
          <h1 className="text-2xl font-bold">{heading}</h1>
        </div>

        <p className="text-sm text-muted-foreground">{body}</p>

        <div className="flex flex-col gap-2 pt-4 border-t border-border">
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full rounded-md bg-primary text-primary-foreground font-semibold py-2.5 px-4 hover:opacity-90 transition-opacity"
          >
            Sign in with a different account
          </Link>
          {/* Sign out is a POST via form submit — /api/auth/logout is
              intentionally GET-less to prevent accidental CSRF signouts. */}
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
