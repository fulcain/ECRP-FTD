"use client";

import { Clock } from "lucide-react";
import {
  Aside,
  BbLink,
  Bold,
  BulletList,
  Category,
  Command,
  Em,
  EyebrowLabel,
  Item,
  NumberedList,
  OOC,
  Tinted,
  WarningCallout,
} from "@/app/(routes)/phase-paperworks/lib/phase-notes/primitives";

export function ReinstatementPhase1Notes() {
  return (
    <div className="space-y-2.5">
      <div className="rounded-md border border-border/60 bg-muted/30 px-4 py-2.5">
        <EyebrowLabel icon={Clock}>
          REINSTATEMENT PHASE I - EMT-I+ - 1h 30m minimum / 3h maximum
        </EyebrowLabel>
      </div>

      <WarningCallout>
        <Bold>
          THE REINSTATEE SHOULD DO TREATMENT &amp; HANDLE UNIT/CALL
          MANAGEMENT TOWARDS THE END OF THE PHASE
        </Bold>
      </WarningCallout>

      <Category title="Hospitals">
        <BulletList>
          <Item>
            Explain to the reinstatee the hospitals we&rsquo;ve opened.
            (Make sure to let them know that we no longer have Zonah,
            Central and Sandy dropoffs, but have garages at Sandy,
            Zonah and Fire Station 7; reference the general handbook
            Section 1)
          </Item>
          <Item>
            Review where we can drop off patients at Paleto and Pillbox.
          </Item>
          <Item>
            Review the location of the garage in every hospital, as
            well as the 3 garage-only locations.
          </Item>
        </BulletList>
      </Category>

      <Category title="Call list">
        <BulletList>
          <Item>
            Go over the dispatch system with the reinstatee{" "}
            <OOC>
              <Command>/calls</Command>
            </OOC>
            , explaining that we see calls oldest to newest, description,
            location and which unit is currently responding to it.
          </Item>
          <Item>
            Go over how to respond to calls, how to close them, and
            how to check the location.{" "}
            <OOC>
              <Command>/resp</Command>, <Command>/closecall</Command>{" "}
              &amp; <Command>/setcall</Command>
            </OOC>
          </Item>
          <Item>
            Explain call priority:
            <NumberedList>
              <Item>Injured medics on duty</Item>
              <Item>PD and SD</Item>
              <Item>DOC and GOV</Item>
              <Item>Civilians calls from oldest to the newest</Item>
            </NumberedList>
          </Item>
        </BulletList>
      </Category>

      <Category title="Radio Codes">
        <BulletList>
          <Item>
            Review the radio codes with the reinstatee and quiz them
            on radio codes.
          </Item>
          <Item>
            Ask the reinstatee what would you respond with if someone
            asks for a 10-3, 10-21, and 10-37.
          </Item>
          <Item>
            Ask the reinstatee the difference between code 2 &amp;
            code 3.
          </Item>
          <Item>
            Ask the reinstatee what they would radio in when
            approaching a scene.
          </Item>
          <Item>
            Make up a call number, location, patient count, injury,
            and quiz them if it&rsquo;s a code 2 or code 3 and which
            hospital. (Time management is important for location)
          </Item>
          <Item>
            Ask the reinstatee what they&rsquo;d say once they&rsquo;ve
            delivered the patient to the hospital?
          </Item>
        </BulletList>
      </Category>

      <Category title="Backup Alarms">
        <BulletList>
          <Item>
            Explain to the reinstatee the difference between a panic
            alarm and a backup call.
          </Item>
          <Item>
            Inform the reinstatee that if they require a backup
            alarm they&rsquo;ll need to provide a brief description
            as to the situation.{" "}
            <OOC>
              <Command>/backup [text]</Command>
            </OOC>
          </Item>
          <Item>
            Ask the reinstatee if they would do a backup or panic
            based on the following scenarios:
            <BulletList>
              <Item>They flip their ambulance.</Item>
              <Item>
                Armed assailants are standing over their patient and
                screaming threats.
              </Item>
              <Item>
                They are involved in an accident and break a few
                ribs.
              </Item>
              <Item>They run out of fuel in their ambulance.</Item>
            </BulletList>
          </Item>
        </BulletList>
      </Category>

      <Category title="Treatment">
        <BulletList>
          <Item>
            Ask the reinstatee how they&rsquo;d treat the following
            injuries:
            <BulletList>
              <Item>Broken arm or leg</Item>
              <Item>1st and 3rd-degree burns</Item>
              <Item>Stomach gunshot wound</Item>
              <Item>Arm/leg gunshot wound</Item>
            </BulletList>
          </Item>
        </BulletList>
      </Category>

      <Category title="Fire Calls">
        <BulletList>
          <Item>
            Show the EMR where to retrieve a fire extinguisher.{" "}
            <OOC>
              RP, then <Command>/fl</Command>. Remind them that
              It&rsquo;ll be <Bold>INVISIBLE</Bold> in the top left
              slot in the weapon wheel!
            </OOC>
          </Item>
          <Item>
            Then explain the process of extinguishing a fire to the
            EMR.{" "}
            <OOC>
              <Command>E</Command> on the floating UI, and{" "}
              <Command>/extinguish</Command>
            </OOC>
          </Item>
          <Item>
            Inform the EMR that there can be lingering flames, and
            that it&rsquo;s best to check the surroundings
            thoroughly.{" "}
            <OOC>
              Additionally, explain that some fires are glitched and
              are only visible in the UI when physically close to
              the fire.
            </OOC>
          </Item>
        </BulletList>
      </Category>

      <Category title="Methadone">
        <BulletList>
          <Item>
            Explain to the EMR the proper procedure of distribution
            of methadone and give them an example of when you can
            supply it to a patient.{" "}
            <Bold>
              Make sure they understand{" "}
              <Tinted tone="maroon">WELL</Tinted>.
            </Bold>
          </Item>
          <Item>
            <Bold>
              Make sure to teach them how to properly do the entire
              procedure, especially the importance of utilizing the
              Prescription Section to note a prescription down. This
              is of extreme importance, as improperly prescribing
              Methadone can and will lead to disciplinary action if
              done incorrectly.
            </Bold>
          </Item>
          <Item>
            Inform the EMR that before selling methadone they{" "}
            <Bold>HAVE</Bold> to conduct a drug test.
          </Item>
          <Item>
            Inform the EMR that anyone requesting methadone can only
            pay for it in cash, at the price of $500.
          </Item>
          <Item>
            <OOC>
              Inform the EMR roleplay must be completed before using
              the command, without any roleplay, you&apos;ll be
              breaking powergaming by forcing roleplay without
              allowing the other player a chance and abusing faction
              commands.
            </OOC>
          </Item>
        </BulletList>
      </Category>

      <Category title="Breathalyser">
        <BulletList>
          <Item>
            Explain to the EMR the process of conducting a
            breathalyzer on a patient and give them an example of how
            to do it.{" "}
            <OOC>
              <Command>/breathanalyse</Command>
            </OOC>
          </Item>
          <Item>
            Inform the EMR that before conducting a breathalyzer
            they must have the consent of the patient.
          </Item>
          <Item>
            <OOC>
              Inform the EMR roleplay must be completed before using
              the command, without any roleplay, you&apos;ll be
              breaking powergaming by forcing roleplay without
              allowing the other player a chance and abusing faction
              commands.
            </OOC>
          </Item>
        </BulletList>
      </Category>

      <Category title="Scene Management">
        <BulletList>
          <Item>
            Inform the reinstatee what blockades we have{" "}
            <OOC>
              {" "}
              <Command>barrier</Command>, <Command>barrier2</Command>,{" "}
              <Command>cone</Command> and <Command>arrow</Command>
            </OOC>
            .
          </Item>
          <Item>
            <OOC>
              {" "}
              Additionally inform them of the three extra
              &quot;blockades&quot; they can use for improving their
              RP - <Command>bls</Command>, <Command>stretcher</Command>{" "}
              and <Command>backboard</Command>.
            </OOC>
          </Item>
          <Item>
            Explain to the reinstatee the value of blockades and
            show them that they do save lives.
          </Item>
          <Item>
            Explain to them that we can also build a tent with
            supplies found in our vehicles, but that it should only
            be used for Code 1 situations or when otherwise
            specified.{" "}
            <Aside>(( /blockade tent ))</Aside>
          </Item>
          <Item>
            Show the reinstatee how to block incoming traffic using
            the ambulance.
          </Item>
          <Item>
            Take the reinstatee on a public road, park the
            ambulance, and have them practice doing scene
            management.
          </Item>
        </BulletList>
      </Category>

      <Category title="Department Radio">
        <BulletList>
          <Item>
            Go over the department radio and who uses it. (MD, PD,
            SD, DOC &amp; GOV){" "}
            <OOC>
              <Command>/dep</Command>
            </OOC>
          </Item>
          <Item>Question the reinstatee about call priority.</Item>
          <Item>
            Make sure the reinstatee knows that department radio
            has to be answered even if we are 10-9.
          </Item>
          <Item>
            Tell the reinstatee to always say MD before calling
            over department radio.
          </Item>
          <Item>
            Explain the difference between <Em>Urgent</Em> (skipping
            &quot;how copy&quot;) and <Em>Non Urgent</Em> (using
            &quot;how copy&quot; then waiting for response)
          </Item>
          <Item>
            Inform the reinstatee that once they are certified, the
            highest ranking unit on shift would usually respond to
            departmental radio, unless a shift lead is appointed or
            a training unit has prio (teach them to ask if they are
            unsure if anyone does have prio)
          </Item>
        </BulletList>
      </Category>

      <Category title="PD/SD Calls">
        <BulletList>
          <Item>
            Explain to the reinstatee how to communicate with
            PD/SD over department radio.
          </Item>
          <Item>
            Inform the reinstatee that they need to report when
            they are en-route over our normal radio and department
            radio.
          </Item>
          <Item>
            Tell the reinstatee that the first thing to do as they
            approach the scene is to ask who is injured and who is
            10-15/10-16 and if any treatment has been given to the
            patients before our arrival (Most of PD and SD
            employees have BLS training).
            <BulletList>
              <Item>
                If there are no 10-15s, we behave as if it was a
                normal call.
              </Item>
              <Item>
                If there is an injured 10-15, we treat the patient
                and then we ask PD/SD if we can take the patient to
                the ambulance.
              </Item>
            </BulletList>
          </Item>
          <Item>
            Explain why:
            <BulletList>
              <Item>
                Never take 10-15 to an ambulance without PD/SD
                permission.
              </Item>
              <Item>Never leave a scene without PD/SD permission.</Item>
              <Item>
                Always ask which hospital PD/SD wishes to go to.
              </Item>
              <Item>
                Never drop the patient without asking PD/SD for
                permission.
              </Item>
            </BulletList>
          </Item>
          <Item>
            Make sure the reinstatee knows that it&rsquo;s better
            to ask twice than get IA reported for stealing a 10-15.
          </Item>
        </BulletList>
      </Category>

      <Category title="((Teamspeak))">
        <BulletList>
          <Item>
            <OOC>
              Ask them to join TeamSpeak 3, make sure they are in
            Zulu unit <Em>TS info - IP: ts.eclipse-rp.net ; Password: ecrpsagov</Em>
          </OOC>.
        </Item>
          <Item>
            <OOC>
              Explain to them how to set up the unit tag before
              their name, for example,{" "}
            <Tinted tone="amber">[Z-11]</Tinted>
          </OOC>.
        </Item>
          <Item>
            <OOC>
            Explain that if we use VOIP we say Zulu, if we use
            chat we type Z</OOC>.
        </Item>
        </BulletList>
      </Category>

      <Category title="Jointed Tac">
        <BulletList>
          <Item>
            Explain to the reinstatee what Jointed Tac (JTAC) is.
          </Item>
          <Item>
            Inform the reinstatee on how it&rsquo;s used.{" "}
            <OOC>
              Make sure you explain and they understand{" "}
              <Bold>JTAC is IC and they have to use IC VOIP</Bold>{" "}
              as well when talking on it. Additionally, explain
              that using the TS VOIP without using in game VOIP at
              the same time can lead to a server punishment.
            </OOC>
          </Item>
          <Item>
            Make sure they understand respect and professionalism
            is <Bold>utterly</Bold> important here.
          </Item>
        </BulletList>
      </Category>

      <Category title="On-Call Pager Program">
        <BulletList>
          <Item>
            Hand them an On-Call Program Pager (stored in the locker
            room) &amp; explain the program. The EMR is not
            obliged to join, so do inform them of this as well.{" "}
            <Aside>
              {" "}
              ((<Bold>Make sure you give them the discord role!</Bold>))
            </Aside>
          </Item>
        </BulletList>
      </Category>

      <Category title="Re-Introduction Email">
        <BulletList>
          <Item>
            Last but not least, send{" "}
            <BbLink href="https://pastebin.com/raw/Dq7vYC7s">
              this email
            </BbLink>{" "}
            to the Reinstatee! It contains useful things they may
            or may not need during the reinstatement training
            and/or employment.
          </Item>
        </BulletList>
      </Category>
    </div>
  );
}
