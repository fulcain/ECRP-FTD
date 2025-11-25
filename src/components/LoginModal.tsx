"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export default function LoginModal({
  onUnlockAction,
}: {
  onUnlockAction: () => void;
}) {
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(true);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const pass = process.env.NEXT_PUBLIC_SITE_PASS;
    if (password === pass) {
      const res = await fetch("/api/create-token", { method: "POST" });
      const { token } = await res.json();
      localStorage.setItem("jwt_token", token);
      toast.success("Access granted!", { theme: "dark" });
      setTimeout(() => {
        setOpen(false);
        onUnlockAction();
      }, 1000);
    } else {
      toast.error("Invalid password", { theme: "dark" });
    }
  }

  return (
    <>
      <Dialog open={open}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Restricted Access</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <Input
                type={showPass ? "text" : "password"}
                placeholder="enter access key..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 py-5"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPass((prev) => !prev)}
                className="absolute right-2  top-[3px] text-gray-500"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>

            <Button type="submit" className="w-full">
              Unlock
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </>
  );
}
