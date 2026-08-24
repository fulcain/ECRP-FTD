"use client";
import { PaperworkTypeSelector } from "@/app/(routes)/paperwork/components/PaperworkTypeSelector";
import { PageContainer } from "@/components/ui/page-container";

export default function Home() {
  return (
    <PageContainer>
      <PaperworkTypeSelector />
    </PageContainer>
  );
}
