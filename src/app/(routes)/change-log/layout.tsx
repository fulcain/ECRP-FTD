import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FTD App | Change Log",
  description: "Day-by-day record of updates, fixes, and new features.",
};

export default function ChangeLogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
