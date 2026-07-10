"use client";

import {
  Aside,
  Bold,
  Category,
  Command,
  Divider,
  EyebrowLabel,
  Em,
  Figure,
  ImportantNote,
  Item,
  NumberedList,
  OOC,
  ParagraphList,
  ParaItem,
  Spoiler,
  SubHeading,
  WarningCallout,
} from "@/app/(routes)/phase-paperworks/lib/phase-notes/primitives";
import { Clock } from "lucide-react";

export function Phase3Notes() {
  return (
    <div className="space-y-2.5">
      <div className="rounded-md border border-border/60 bg-muted/30 px-4 py-2.5">
        <EyebrowLabel icon={Clock}>
          PHASE 3 - EMT-I+ · 1h minimum / 2h maximum
        </EyebrowLabel>
      </div>

      <WarningCallout>
        The EMR should drive, provide treatment, and handle unit/call
        management at the end of the phase.
      </WarningCallout>

      <Category title="Garage and Ambulance" ordered>
        <Item>
          Show the EMR again how we get a vehicle from Betsy{" "}
          <OOC>Via the vehicle menu, point them to Handbook Section 10.1</OOC>
        </Item>
        <Item>
          There are 25 ambulances for EMRs to use in total. 10 EMT/orange
          ambulances, 5 Blue ambulances, and 10 large ambulances.
        </Item>
        <Item>
          Inform the EMR that all vehicles are fleet vehicles and we must
          take care of them for those who use it after you. Before you park,
          repair and refuel the vehicle. Maintenance of vehicles come from
          LSEMS treasury.
        </Item>
        <Item>
          Inform the EMR to always keep their ambulance locked. Double-checking
          is better than not checking.
        </Item>
        <Item>
          Explain to the EMR what the difference between Code 2 and Code 3 is
          and how to use the lights and sirens.
          <div className="mt-1">
            <OOC>
              <Command>E</Command> = lights &amp; <Command>Q</Command> =
              sirens
            </OOC>
          </div>
        </Item>
        <Item>
          <OOC>
            Explain to EMRs that only under direct permission from a
            Command+ member are they allowed to change the colour of their
            vehicles. If found to have changed the colour of their vehicle
            without permission this will result in IC reprecussions.
          </OOC>
        </Item>
        <Item>
          Explain to the EMR what Code 4 means in the context of driving
          (lights and sirens off, driving normally).
        </Item>
        <Item>
          Explain to the EMR that they can get a quick blip to{" "}
          <Em>
            <Bold>Lower Pillbox</Bold>
          </Em>{" "}
          from their GPS <OOC><Command>/hospital</Command></OOC>.
        </Item>
        <Item>
          Explain that the GPS system, while functional, may not give the
          best routing to calls.{" "}
          <Em>
            Example - Call from Burgershot while stationed at the
            ambulance bay:
          </Em>
          <Spoiler title="GPS comparison image">
            <Figure
              src="https://i.imgur.com/i5etN3F.png"
              caption="GPS routing provided, while functional, is inefficient. Going straight to Legion Square and turning from there instead, is going to be more efficient."
            />
          </Spoiler>
        </Item>
        <Item>
          Explain to the EMR how roaming works.
        </Item>
        <Item>
          If you will be 10-8 during your ride-along, take the EMR on a short
          roam and ask the EMR to do the radio.
        </Item>
        <Item>
          Explain to the EMR that as they roam they should be in motion,
          and as they roam they have to be 10-8 and take calls.
        </Item>
      </Category>

      <Category title="Driving Capabilities" ordered>
        <Item>
          Explain to the EMR that this section will consist of 3 different
          driving tests:
          <ParagraphList>
            <ParaItem>
              First is a <Em>dirt</Em> trail.
            </ParaItem>
            <ParaItem>
              Second is a combination of <Em>dirt</Em> and <Em>asphalt</Em>.
            </ParaItem>
            <ParaItem>The third is on <Em>asphalt</Em>.</ParaItem>
          </ParagraphList>
        </Item>
        <Item>
          Instruct the EMR to drive to The Observatory, specifically get the
          EMR to use <Command>1 East Galileo Ave</Command> on their GPS.{" "}
          <OOC>
            <Command>/setgps 1 east galileo ave</Command>
          </OOC>
          <Spoiler title="Map location of The Observatory">
            <Figure src="https://i.imgur.com/8Hw38YV.png" />
          </Spoiler>
        </Item>
        <Item>
          Take over, then show the EMR how to drive along the first course,
          course <Bold>(1)</Bold> in the image below. After showing them,
          have them do a few laps to get a grasp of how the ambulance handles
          dirt. <Em>Encourage them to stay in control of the vehicle.</Em>
          <Spoiler title="Observatory courses">
            <Figure src="https://i.imgur.com/lcxzHCq.jpeg" />
          </Spoiler>
        </Item>
        <Item>
          Explain the next course <Bold>(2)</Bold> to the EMR. A quick way
          to explain it is simply &ldquo;keep turning left&rdquo;.{" "}
          <Bold>Again, take over</Bold>, <Bold>do one lap</Bold>, then have
          the EMR do it!
        </Item>
        <Item>
          Their first lap will be <Bold>Code 4</Bold> (regular driving).
          Instruct them to stop at the start, then repeat the lap{" "}
          <Bold>Code 3</Bold>.
        </Item>
        <Item>
          Then have the EMR do the course two more times, in reverse (as in,
          turn the ambulance around, don&rsquo;t have them literally driving
          in reverse). The &ldquo;keep turning left&rdquo; now becomes
          &ldquo;keep turning right&rdquo;.
          <ParagraphList>
            <ParaItem>
              First reverse lap <Bold>Code 4</Bold>
            </ParaItem>
            <ParaItem>
              Second reverse lap <Bold>Code 3</Bold>
            </ParaItem>
          </ParagraphList>
        </Item>
        <Item>
          Finally, have the EMR drive to the Sandy Firestation (
          <Command>27 Panorama Dr</Command>), <Bold>Code 3</Bold>.
          <Spoiler title="Map location of Sandy Firestation">
            <Figure src="https://i.imgur.com/Rm51qYX.png" />
          </Spoiler>
        </Item>
        <Item>
          If they need more practice, have them redo any of the courses at
          the end of the session.
        </Item>
      </Category>

      <Category title="Hospitals and Fire Stations of Los Santos" ordered>
        <Item>
          Inform them that they are now at Sandy Fire station and that they
          can ask Betsy for vehicles here and then direct them to Fire
          Station 7 and show them where to ask Betsy for vehicles here as
          well.
        </Item>
        <Item>
          Take them to Central and then finally to Mount Zonah and show them
          how to call Betsy so she can retrieve a vehicle for them.
        </Item>
        <Item>
          <OOC>
            Pictures will go in here. I just have to get them from above and
            mark where the points are on the map with blips.
          </OOC>
        </Item>
      </Category>

      <Category title="Scene Management" ordered>
        <Item>
          Instruct the EMR to head to a secluded area. You should use one of
          the three locations listed below.
          <NumberedList>
            <Item>
              Abandoned Cul-de-sac in Mirror Park, opposite house at{" "}
              <Command>7 East Mirror Dr</Command>{" "}
              <OOC><Command>/setgps</Command></OOC>
            </Item>
            <Item>
              Terminal/Harbor <OOC>Credit Store</OOC>
            </Item>
            <Item>
              Dead-end road close to Clothing Store 4/17
              <Spoiler title="Location of road close to Clothing Store 4/17">
                <Figure src="https://i.imgur.com/UBq8bRR.png" />
              </Spoiler>
            </Item>
          </NumberedList>
        </Item>
        <Item>
          Inform the EMR of the blockades we have and make sure to explain
          the correct use for each.{" "}
          <OOC>
            <Command>arrow</Command>, <Command>barrier</Command>,{" "}
            <Command>barrier2</Command>, <Command>cone</Command>,{" "}
            <Command>stretcher</Command>, <Command>backboard</Command>,{" "}
            <Command>tent</Command>, <Command>bls</Command>.
          </OOC>
        </Item>
        <Item>
          Explain to the EMR that your ambulance is one of your biggest
          blockades and how to block incoming traffic using it.
        </Item>
        <Item>
          Show them how to do some basic scene management and then take it
          down.
        </Item>
        <Item>
          Explain to the EMR the steps of arriving on scene.
          <SubHeading>Steps to follow</SubHeading>
          <NumberedList>
            <Item>
              Siren OFF <OOC><Command>Q</Command></OOC>
            </Item>
            <Item>Engine OFF</Item>
            <Item>
              Emergency Lights ON <OOC><Command>E</Command></OOC>
            </Item>
            <Item>
              Step out of ambulance, then <Bold>ALWAYS</Bold> double check if
              ambulance is locked.
            </Item>
          </NumberedList>
        </Item>
        <Item>
          Show the EMR how to position the ambulance when arriving on scene,
          then allow them to attempt it.
        </Item>
        <Item>
          Have the EMR show you how they should arrive on scene and perform
          scene management all at once.
          <p className="mt-1">
            <Em>
              It is not expected for the EMR to get it perfect, however they
              should at least know how to do it.
            </Em>
          </p>
        </Item>
      </Category>

      <Category title="JTAC" ordered>
        <Item>Explain to the EMR what Jointed Tac (JTAC) is.</Item>
        <Item>Inform the EMR on how it&rsquo;s used.</Item>
        <Item>
          Explain that the highest rank on shift would be the unit to join
          JTAC if asked.
        </Item>
        <Item>
          Make sure they understand respect and professionalism is{" "}
          <Bold>utterly</Bold> important here.
          <div className="mt-1">
            <OOC>
              Make sure you explain and they understand{" "}
              <Bold>JTAC is IC and they have to use IC VOIP</Bold> as well
              when talking on it. Additionally, explain that using the TS
              VOIP without using in-game VOIP at the same time can lead to
              a server punishment.
            </OOC>
          </div>
        </Item>
        <Item>
          <OOC>
            Inform the EMR that they can bind <Command>P</Command> to Push To
            Talk in Teamspeak. Provided that you are <Bold>tabbed in</Bold>{" "}
            to RageMP, pressing <Command>P</Command> will use the
            &ldquo;talk on phone&rdquo; key as JTAC.
          </OOC>
        </Item>
        <Item>
          <OOC>
            If the EMR does not use VOIP or do not wish to use VOIP, they{" "}
            <Bold>are not expected to</Bold>; however having someone who can
            use VOIP who is on duty join JTAC with them would be ideal.
            Non-VOIP individuals may use{" "}
            <Command>/dep MD to JTAC-1 [msg]</Command> or{" "}
            <Command>/dep MD to SD/PD [unit]</Command> to communicate with
            JTAC.
          </OOC>
        </Item>
      </Category>

      <Divider />

      <Category title="Ending the Phase - Ride-Along" ordered>
        <Item>
          <Bold>
            Request Call Priority over radio. Either you, or the EMR may do
            this request.
          </Bold>
        </Item>
        <Item>
          Make sure the EMR can do everything alone, let the EMR take over
          treatment, radio calls, and driving.
        </Item>
        <Item>
          If the EMR seems overwhelmed, allow them to focus on their driving
          for rest of the session.
        </Item>
        <Item>Ask the EMR if they have any concerns.</Item>
        <Item>Question the EMR about radio calls and treatment.</Item>
        <Item>
          Assign them mandatories if they seem like they&rsquo;re having a
          rough time and remind them that they have the option to do
          optional ride-alongs.
        </Item>
      </Category>

      <ImportantNote>
        <Em>
          <Bold>
            <span className="underline">If the EMR performed poorly</span>,
            be honest and genuine on your report
          </Bold>
        </Em>{" "}
        - not stating they didn&rsquo;t do well is only harming the
        EMR as this is their last chance before their Pre-Certification.
      </ImportantNote>

      <p>
        Finally, encourage the EMR to roam during down time in their
        upcoming ride-alongs.
      </p>
    </div>
  );
}


