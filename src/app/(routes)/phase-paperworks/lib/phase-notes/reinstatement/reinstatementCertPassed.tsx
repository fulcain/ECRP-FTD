"use client";

import { Clock } from "lucide-react";
import {
  Aside,
  BbLink,
  Bold,
  BulletList,
  Category,
  EyebrowLabel,
  Item,
  Spoiler,
  WarningCallout,
} from "@/app/(routes)/phase-paperworks/lib/phase-notes/primitives";

export function ReinstatementCertPassedNotes() {
  return (
    <div className="space-y-2.5">
      <div className="rounded-md border border-border/60 bg-muted/30 px-4 py-2.5">
        <EyebrowLabel icon={Clock}>
          REINSTATEMENT CERTIFICATION - Junior Paramedic+ - 1h 30m
          minimum / 3h maximum
        </EyebrowLabel>
      </div>

      <WarningCallout>
        <Bold>THE REINSTATEE SHOULD HANDLE EVERYTHING</Bold>
      </WarningCallout>

      <Category title="Beginning">
        <BulletList>
          <Item>
            Make sure the reinstatee knows how to handle and
            transport a 10-15 if they have not handled one during
            the reinstatement program. If necessary, create a
            mock-up scenario.
          </Item>
          <Item>
            Inform the reinstatee&apos; that during this
            certification they are on their own.
          </Item>
          <Item>
            Ensure the reinstatee creates the unit for the
            certification. (D-6Z, C-2Z, B-2Z, A-1Z etc...)
          </Item>
        </BulletList>
      </Category>

      <Category title="During examination">
        <BulletList>
          <Item>
            Pay attention to their communication, locking their
            ambulance, radio calls, scene management, and
            treatment.
          </Item>
          <Item>
            Ensure the reinstatee&apos; attends a department radio
            call and is able to communicate and efficiently deal
            with the hectic situation it can become.
          </Item>
        </BulletList>
      </Category>

      <Category title="Ending certification">
        <BulletList>
          <Item>
            Give the reinstatee&apos; their certification result
            and the feedback you gathered whilst supervising them.
          </Item>
          <Item>
            Make sure they have a medical license, and offer them
            a Pager (optional to take it){" "}
            <Aside>(( Don&apos;t forget the discord role! ))</Aside>
          </Item>
          <Item>
            Inform the reinstatee&apos; regarding duty reports
            being optional but are encouraged to fill one out.
          </Item>
          <Item>
            Inform the reinstatee&apos; regarding the divisions we
            have and that they&apos;re eligible to join, and
            encourage them to join a few.
          </Item>
          <Item>
            Complete certification paperwork alongside handing the
            reinstatee&apos; their new rank and callsign (let them
            pick) within LSEMS. (The rank is predetermined and is
            stated in the top post)
          </Item>
          <Item>
            Post the EMR/REINSTATEE Promotion Checklist on their
            personnel profile
          </Item>
        </BulletList>
      </Category>

      <Category title="Useful Links">
        <BulletList>
          <Item>
            <BbLink href="https://gov.eclipse-rp.net/viewtopic.php?f=597&t=9497">
              Staff Roster
            </BbLink>
          </Item>
          <Item>
            <BbLink href="https://gov.eclipse-rp.net/ucp.php?i=ucp_groups&mode=manage">
              Groups
            </BbLink>
          </Item>
          <Item>
            <BbLink href="https://gov.eclipse-rp.net/viewforum.php?f=605">
              Personnel Files
            </BbLink>
          </Item>
          <Item>
            <BbLink href="https://gov.eclipse-rp.net/viewtopic.php?t=74487">
              Promotion Checklist (Supervisor Handbook Section 5)
            </BbLink>
          </Item>
        </BulletList>
      </Category>

      <Spoiler title="Hippocratic Oath">
        <p className="text-sm text-foreground/85 mb-3">
          Before handing the EMR their EMT badge, have them swear the
          Hippocratic Oath found below.
        </p>
        <div className="rounded-lg border border-[#800000]/30 dark:border-rose-400/30 bg-amber-50/40 dark:bg-amber-950/20 px-4 py-5 space-y-3">
          <p className="text-center text-base font-semibold italic text-[#800000] dark:text-rose-300">
            I, <Bold>FName LName</Bold>, swear to fulfill, to the
            best of my ability and judgment, this covenant:
          </p>
          <div className="text-[15px] leading-relaxed space-y-2.5 italic text-foreground/90">
            <p>
              I will respect the hard-won scientific gains of those
              who walked the steps I walk now, and gladly share such
              knowledge as is mine with those who are to follow.
            </p>
            <p>
              I will apply, for the benefit of the sick, all measures
              which are required to better their condition.
            </p>
            <p>
              I will remember that there is an art to medicine as
              well as science, and that warmth, sympathy, and
              understanding may outweigh the surgeon&apos;s knife or
              the chemist&apos;s drug.
            </p>
            <p>
              I will never be ashamed to say &ldquo;I know
              not,&rdquo; nor will I fail to call in my colleagues
              when the skills of another are needed for a
              patient&apos;s recovery.
            </p>
            <p>
              I will respect the privacy of my patients, for their
              problems are not disclosed to me that the world may
              know.
            </p>
            <p>
              I will remember that I do not treat a chart or
              simulation, but a sick or injured human being, whose
              illness may affect the person&apos;s family and
              economic stability.
            </p>
            <p>
              I will prevent disease whenever I can, for prevention
              is preferable to cure.
            </p>
            <p>
              I will remember that I remain a member of society,
              with special obligations to all my fellow human
              beings, those sound of mind and body as well as the
              infirm.
            </p>
            <p>
              If I do not violate this oath, may I enjoy life,
              respected while I live and remembered with affection
              thereafter.
            </p>
            <p>
              If I do not violate this oath, may I long experience
              the joy of healing those who seek my help.
            </p>
          </div>
        </div>
      </Spoiler>

      <Spoiler title="EMT E-mails">
        <p className="text-sm text-foreground/90">
          <BbLink href="https://pastebin.com/raw/EjBDfT9X">
            Here you&apos;ll find a list for each EMT e-mail.
          </BbLink>{" "}
          Use the correct one!
        </p>
      </Spoiler>

      <Spoiler title="Diploma Passed">
        <p className="text-sm text-foreground/90">
          <BbLink href="https://gov.eclipse-rp.net/viewtopic.php?p=445130#p445130">
            Formats found here - Promotion Posts
          </BbLink>
        </p>
      </Spoiler>
    </div>
  );
}
