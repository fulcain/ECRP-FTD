import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FTD App | Phase Paperworks Page",
  description: "Phase Paperworks Page",
};

export default function PhasePaperworksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
