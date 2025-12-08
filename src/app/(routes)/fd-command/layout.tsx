import type { Metadata } from "next";
import ProtectedView from "@/components/ProtectedView";

export const metadata: Metadata = {
  title: "FTD App | Command Page",
  description: "Command Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedView requiredKey="NEXT_PUBLIC_FTD_COMMAND_PASS">
      {children}
    </ProtectedView>
  );
}
