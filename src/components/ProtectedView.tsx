"use client";
import { useState, useEffect } from "react";
import LoginModal from "@/components/LoginModal";

export default function ProtectedView({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) return setChecked(true);

      const res = await fetch("/api/verify-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const { valid } = await res.json();
      if (valid) setLoggedIn(true);
      setChecked(true);
    };

    verify();
  }, []);

  if (!checked) return null;
  if (!loggedIn) return <LoginModal onUnlockAction={() => setLoggedIn(true)} />;
  return <>{children}</>;
}
