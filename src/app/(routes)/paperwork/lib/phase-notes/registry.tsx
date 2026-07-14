"use client";

import * as React from "react";
import type { PhaseKey } from "@/app/(routes)/paperwork/lib/paperworkConfig";
import type { ReinstatementPhaseKey } from "@/app/(routes)/paperwork/lib/reinstatementConfig";

import { IntroductionNotes } from "@/app/(routes)/paperwork/lib/phase-notes/normal/introduction";
import { Phase1Notes } from "@/app/(routes)/paperwork/lib/phase-notes/normal/phase1";
import { Phase2Notes } from "@/app/(routes)/paperwork/lib/phase-notes/normal/phase2";
import { Phase3Notes } from "@/app/(routes)/paperwork/lib/phase-notes/normal/phase3";
import { PreCertNotes } from "@/app/(routes)/paperwork/lib/phase-notes/normal/preCert";
import { CertPassedNotes } from "@/app/(routes)/paperwork/lib/phase-notes/normal/certPassed";
import { CertFailedNotes } from "@/app/(routes)/paperwork/lib/phase-notes/normal/certFailed";
import { RideAlongNotes } from "@/app/(routes)/paperwork/lib/phase-notes/normal/rideAlong";

import { ReinstatementPhase1Notes } from "@/app/(routes)/paperwork/lib/phase-notes/reinstatement/reinstatementPhase1";
import { ReinstatementPhase2Notes } from "@/app/(routes)/paperwork/lib/phase-notes/reinstatement/reinstatementPhase2";
import { ReinstatementCertPassedNotes } from "@/app/(routes)/paperwork/lib/phase-notes/reinstatement/reinstatementCertPassed";
import { ReinstatementCertFailedNotes } from "@/app/(routes)/paperwork/lib/phase-notes/reinstatement/reinstatementCertFailed";
import { ReinstatementRideAlongNotes } from "@/app/(routes)/paperwork/lib/phase-notes/reinstatement/reinstatementRideAlong";

export const NORMAL_NOTES: Record<PhaseKey, React.ComponentType> = {
  introduction: IntroductionNotes,
  phase1: Phase1Notes,
  phase2: Phase2Notes,
  phase3: Phase3Notes,
  preCert: PreCertNotes,
  certPassed: CertPassedNotes,
  certFailed: CertFailedNotes,
  rideAlong: RideAlongNotes,
};

export const REINSTATEMENT_NOTES: Record<
  ReinstatementPhaseKey,
  React.ComponentType
> = {
  reinstatementPhase1: ReinstatementPhase1Notes,
  reinstatementPhase2: ReinstatementPhase2Notes,
  reinstatementCertPassed: ReinstatementCertPassedNotes,
  reinstatementCertFailed: ReinstatementCertFailedNotes,
  reinstatementRideAlong: ReinstatementRideAlongNotes,
};

export function resolveNormalNotes(
  key: string | null | undefined,
): React.ComponentType | undefined {
  if (!key) return undefined;
  return (NORMAL_NOTES as Record<string, React.ComponentType | undefined>)[key];
}

export function resolveReinstatementNotes(
  key: string | null | undefined,
): React.ComponentType | undefined {
  if (!key) return undefined;
  return (REINSTATEMENT_NOTES as Record<string, React.ComponentType | undefined>)[
    key
  ];
}
