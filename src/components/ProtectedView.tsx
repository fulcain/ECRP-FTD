"use client";

import { useState, useEffect } from "react";
import LoginModal from "@/components/LoginModal";
import { usePathname } from "next/navigation";

export default function ProtectedView({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checked, setChecked] = useState(false);
  const pathname = usePathname();

  const routeTokens: Record<string, string> = {
    "/": "NEXT_PUBLIC_SITE_PASS",
    "/fd-command": "NEXT_PUBLIC_FTD_COMMAND_PASS",
  };

  const envVarName = routeTokens[pathname];

  useEffect(() => {
    if (!envVarName) return; // no verification needed

    const verify = async () => {
      const tokenKey =
        pathname === "/" ? "public_jwt_token" : "command_jwt_token";
      const token = localStorage.getItem(tokenKey);
      if (!token) {
        setChecked(true);
        return;
      }

      const res = await fetch("/api/verify-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, route: pathname }),
      });

      const { valid } = await res.json();

      if (valid) setLoggedIn(true);
      setChecked(true);
    };

    verify();
  }, [pathname, envVarName]);

  // ✅ Conditional rendering after hooks
  if (!envVarName) return <>{children}</>;
  if (!checked) return null;

  if (!loggedIn)
    return (
      <LoginModal
        onUnlockAction={() => setLoggedIn(true)}
        expectedToken={envVarName}
        route={pathname}
      />
    );

  return <>{children}</>;
}
