"use client";

import { Clock } from "lucide-react";
import {
  Bold,
  BulletList,
  EyebrowLabel,
  Item,
  ParagraphList,
  ParaItem,
  Spoiler,
  WarningCallout,
} from "@/app/(routes)/paperwork/lib/phase-notes/primitives";

export function ReinstatementPhase2Notes() {
  return (
    <div className="space-y-2.5">
      <div className="rounded-md border border-border/60 bg-muted/30 px-4 py-2.5">
        <EyebrowLabel icon={Clock}>
          REINSTATEMENT PHASE II - EMT-A+ - 1h 30m minimum / 3h
          maximum
        </EyebrowLabel>
      </div>

      <WarningCallout>
        <Bold>THE REINSTATEE SHOULD HANDLE EVERYTHING</Bold>
      </WarningCallout>

      <BulletList>
        <Item>
          The Reinstatement Phase II is something similar to a
          regular Pre-Certification within the Field Training
          Program.
        </Item>
        <Item>
          You are allowed to answer questions that the reinstatee
          may have, and you should be asking the reinstatee random
          things throughout the Phase to ensure they have retained
          their knowledge during their absence.
          <Spoiler title="What to look out for:">
            <ParagraphList>
              <ParaItem>Did the EMR create a unit?</ParaItem>
              <ParaItem>Did the EMR start service correctly?</ParaItem>
              <ParaItem>
                Did the EMR park their ambulance correctly in the
                ambulance bay?
              </ParaItem>
              <ParaItem>
                Did the EMR check if there are any calls to take
                from the call list?
              </ParaItem>
              <ParaItem>
                Did the EMR respond to calls without you asking to
                do it?
              </ParaItem>
              <ParaItem>Did the EMR follow call priority?</ParaItem>
              <ParaItem>Did the EMR manage to use radio calls properly?</ParaItem>
              <ParaItem>
                Did the EMR respond to department radio if there
                were any department calls?
              </ParaItem>
              <ParaItem>
                Did the EMR handle department radio properly and
                timely?
              </ParaItem>
              <ParaItem>Did the EMR handle PD/SD calls properly?</ParaItem>
              <ParaItem>
                Did the EMR use our MD frequency to radio that they
                responding to PD/SD calls?
              </ParaItem>
              <ParaItem>
                Did the EMR ask if the patient is a 10-15 or 10-16?
              </ParaItem>
              <ParaItem>
                Did the EMR ask if any treatment has been done
                before?
              </ParaItem>
              <ParaItem>
                Did the EMR ask if they clear to load the patient
                to an ambulance if the patient was 10-15?
              </ParaItem>
              <ParaItem>Did the EMR ask PD/SD where they want to go?</ParaItem>
              <ParaItem>Did the EMR properly radio transporting a 10-15</ParaItem>
              <ParaItem>
                Did the EMR ask PD/SD if they clear to drop patients
                at MD?
              </ParaItem>
              <ParaItem>
                Did the EMR keep their ambulance locked at all
                times?
              </ParaItem>
              <ParaItem>Did the EMR properly utilize code 2, 3 and 4?</ParaItem>
              <ParaItem>Did the EMR drive properly?</ParaItem>
              <ParaItem>
                Did the EMR know how to utilize all necessary radio
                calls and codes throughout?
              </ParaItem>
              <ParaItem>Did the EMR treat properly and timely?</ParaItem>
              <ParaItem>Did the EMR roam properly and safely?</ParaItem>
            </ParagraphList>
          </Spoiler>
        </Item>
        <Item>
          The Reinstatement Phase II must be flawless. Any major
          mistakes are eliminatory and will result in a failed
          Phase, and will have to be attempted again.
        </Item>
        <Item>
          After the Phase is completed, the EMR can go on duty as
          an EMR unit, exactly the same as after passing the FTP
          Pre-Certification.
        </Item>
      </BulletList>
    </div>
  );
}
