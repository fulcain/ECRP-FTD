import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FTD App | Field Training Instructor",
  description: "Field Training Instructor certification page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
