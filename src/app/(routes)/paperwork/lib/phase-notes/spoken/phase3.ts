/**
 * Paste-friendly, first-person narration of the Phase III notes.
 * Backticked spans render as click-to-copy command chips in Script mode;
 * "## " paragraphs render as section headings. Copying strips both.
 */
export const PHASE3_SPOKEN = [
  "Welcome to Phase III - 1 hour minimum, 2 hours maximum. This is where you drive, treat, and run the whole show.",

  "## Garage and ambulance",

  "Let's grab an ambulance from Betsy. You can choose whatever is labled ar EMR and EMT.",

  "(( You see whatever your rank allows you to see, make sure to check the description before using it. It might be for a division only. ))",

  "These are fleet vehicles - repair and refuel before you park, every time. Maintenance comes out of the LSEMS treasury, so take care of them for the next medic.",

  "Lock your ambulance, always. Double-checking is better than not checking.",

  "Code 2 vs Code 3, and how to run the lights and sirens. Toggles lights using this button on the dashboard `/E` ,This button toggles sirens on dashboard. `/Q`. Code 4 is lights and sirens off, driving normally.",

  "(( Only a Command+ member can authorize changing your vehicle's colour - otherwise it's IC repercussions. ))",

  "Quick blip to Lower Pillbox from the GPS is this button on dashboard. `/hospital`.",

  "The GPS is functional but not always smart about routing - a call from Burgershot while you're at the ambulance bay is the classic example. Trust your map knowledge. Ill send you a photo of what I mean",
 
  "{{ /me airdrops a image to EMR through the tablet. }}",
  "{{ /do https://i.ibb.co/YxGLLsQ/i5et-N3F.png }}",

  "Roaming - stay in motion, stay 10-8, and take calls as they come.",

  "## Driving capabilities",

  "Three driving tests today - first a dirt trail, then dirt and asphalt mixed, then pure asphalt.",

  "Head to The Observatory - set on the GPS 1 East Galileo Ave. (( `/setgps 1 east galileo ave` )) I'll show you the map spot.",

  "{{/me takes out the tablet and airdrops a link to the EMR.}}",
  "{{/do https://i.ibb.co/rfR2PCGL/lcxz-HCq.jpg}}",

  "I'll take over and show you the first course first, then you do a few laps to get a feel for how the ambulance handles dirt. Stay in control of the vehicle.",

  "Course two - the easy way to think about it is 'keep turning left'. I do one lap, then it's yours.",

  "First lap Code 4 - regular driving. Stop at the start, then repeat the lap Code 3.",

  "Then do the course two more times in reverse - turn the rig around, don't literally drive backwards. 'Keep turning left' becomes 'keep turning right'. First reverse lap Code 4, second reverse lap Code 3.",

  "Finale - drive to Sandy Firestation at 27 Panorama Dr `/setgps 27 Panorama Dr`, Code 3.",

  "Need more practice? We'll redo any of the courses at the end of the session.",

  "## Hospitals and fire stations of Los Santos",

  "You're at Sandy now - Betsy can serve you here too. Then we hit Fire Station 7, Central, and finally Mount Zonah, and I'll show you where to call Betsy at each so she can retrieve a vehicle for you.",

  "## Scene management",

  "|| Pick a secluded spot to practice - the abandoned cul-de-sac in Mirror Park opposite. `/setgps 7 East Mirror Dr` ||",

  "(( Our blockades - `arrow`, `barrier`, `barrier2`, `cone`, `stretcher`, `backboard`, `tent`, `bls`. ))",
  "(( You can place them by /blockade [name] for example: /blockade arrow ))",
  "(( You can also see the full list by doing `/blockade a` ))",

  "Your ambulance is one of your biggest blockades - here's how to angle it to block incoming traffic.",

  "Arriving on scene, in order - siren OFF, engine OFF, emergency lights ON, step out of the ambulance, then ALWAYS double-check the rig is locked.",

  "Watch me position once, then you try it. Then show me the whole arrival + scene management routine all at once.",

  "## JTAC",

  "Jointed Tac - JTAC - I'll explain what it is and how it's used. The highest rank on shift is the unit that joins JTAC if asked.",

  "Respect and professionalism are UTTERLY important here. (( JTAC is IC, so it's in-game VOIP. Using TS VOIP without in-game VOIP at the same time can lead to a server punishment. ))",

  "(( You can bind `P` as push-to-talk in TeamSpeak. Tabbed into RageMP, pressing `P` uses the 'talk on phone' key as JTAC. ))",

  "(( No VOIP? That's fine - not expected. But having someone on duty who can VOIP join JTAC with you is ideal. Otherwise - `/dep MD to JTAC-1 [msg]` or `/dep MD to SD/PD [unit]`. ))",

  "## Ending the phase - ride-along",

  "|| Make sure they can do everything alone - let the EMR take over treatment, radio calls, and driving. ||",

  "|| Overwhelmed? Let them focus on their driving for the rest of the session. ||",

  "|| Assign mandatories if they're having a rough time, and remind them optional ride-alongs are always an option. And encourage roaming during downtime in their upcoming ride-alongs. ||",

  "|| Report honestly - if they performed poorly, say so. This is their last chance before Pre-Certification, and generic praise only hurts them. ||",
].join("\n\n");
