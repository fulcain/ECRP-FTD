import { ThemeProvider } from "@/components/ui/theme-provider";
import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Header } from "@/components/layout/header/header";
import ProtectedView from "@/components/ProtectedView";

export const metadata: Metadata = {
  title: "FTD App | FTD Members",
  description: "Internal Access — Authorized Personnel Only",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
				>
					<Header/>
          <ProtectedView>{children}</ProtectedView>
        </ThemeProvider>
      </body>
    </html>
  );
}
