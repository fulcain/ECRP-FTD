"use client";

import {
  Bold,
  Em,
  EmptyNotesState,
} from "@/app/(routes)/phase-paperworks/lib/phase-notes/primitives";

export function ReinstatementRideAlongNotes() {
  return (
    <EmptyNotesState
      title="Reinstatement Ride-Along - reference notes"
      message="Reinstatement ride-along content is paperwork-only. There is no separate reference-notes prose to display in this card."
      tip={
        <>
          <Bold>Tip:</Bold> the standard{" "}
          <Em>rideAlong</Em> card already covers the generic
          ride-along checklists. The reinstatement form only differs
          in its paperwork template (ride-along Type +
          Reinstatee-specific rating scale).
        </>
      }
    />
  );
}
