"use client";
import { PaperworkTypeSelector } from "@/app/(routes)/paperwork/components/PaperworkTypeSelector";

export default function Home() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      <PaperworkTypeSelector />
    </div>
  );
}
