"use client";

import {
  Bold,
  EmptyNotesState,
  Em,
} from "@/app/(routes)/phase-paperworks/lib/phase-notes/primitives";

export function ReinstatementCertFailedNotes() {
  return (
    <EmptyNotesState
      title="Reinstatement Certification Failed - reference notes"
      message="Reinstatement failed-flow reuses the standard certification-failed checklist - the only difference is the paperwork template below."
      tip={
        <>
          <Bold>Tip:</Bold> cross-reference the normal{" "}
          <Em>certFailed</Em> notes for the failed-flow mechanics
          (minimum 2 mandatory ride-alongs, Head-of-Field-Training
          notification, FT Session Report honesty prompt).
        </>
      }
    />
  );
}
