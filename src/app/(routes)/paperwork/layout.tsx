import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FTD App | Paperwork Page",
  description: "Paperwork Page",
};

export default function PaperworkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
