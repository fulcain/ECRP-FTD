/**
 * Paste-friendly, first-person narration of the Reinstatement Phase I notes.
 * Backticked spans render as click-to-copy command chips in Script mode;
 * "## " paragraphs render as section headings. Copying strips both.
 */
export const REINSTATEMENT_PHASE1_SPOKEN = [
  "Welcome back to LSEMS - Reinstatement Phase I, 1 hour 30 minutes minimum, 3 hours maximum. Heads up - you'll be doing treatment and handling unit/call management toward the end of this phase.",

  "## Hospitals",

  "Let's get you caught up on hospitals. We no longer have Zonah, Central or Sandy dropoffs - but we do have garages at Sandy, Zonah and Fire Station 7.",

  "Drop-offs are at Paleto and Pillbox - I'll show you both if you want.",

  "Let's also re-find the garage at every hospital, plus the three garage-only locations.",

  "## Call list",

  "Open dispatch `/calls` - oldest to newest, with description, location, and which unit is responding.",

  "(( Responding - `/resp`. Closing - `/closecall`. Checking or setting location - `/setcall`. ))",

  "Call priority - injured medics on duty, then PD and SD, then DOC and GOV, then civilian calls oldest to newest.",

  "## Radio codes",

  "Let's re-quiz you on radio codes.",
  "Ten codes - 10-1 is roll call.",
"10-3",
"10-4",
"10-5",
"10-6",
"10-8",
"10-9",
"10-15",
"10-16",
"10-20",
"10-21",
"10-37",
"10-70",
"10-99",

"Status codes - Code 0",
"Code 1 is urgent assistance required - ALL UNITS.",
"Code 2 is non-emergency.",
"Code 3 is emergency.",
"Code 4 is no further assistance required.",
"Code 6 is on scene.",

  "What's the difference between Code 2 and Code 3?",

  "What do you radio in when you're approaching a scene?",

  "Scenario || make up a call number, location, patient count and injury || - code 2 or code 3, and which hospital?",

  "And what do you say once you've delivered the patient to the hospital?",

  "## Backup alarms",

  "Panic alarm vs backup call - what's the difference?",

  "If you call a backup - brief description of the situation, and specify if it's MD only. `/backup [text]`.",

  "Asked for backup? Stay put - it's tied to your cruiser.",

  "Your panic button is tied to your radio's location, and you can't add a reason. `CTRL + E`.",

  "Our panics and backups show in PD/SD dispatch - if it doesn't need them, tell those departments to disregard it on department radio. (( `/dep` ))",

  "Need PD or SD? Department radio with the call number.",

  "Scenario time - would you back up or panic? You flip the ambulance.",
  "Armed people are standing over your patient making threats. (( Remember FearRP - no panics while under it! ))",
  "You run out of fuel.", 
  "You're badly injured after a severe accident. (( And if you're scriptly injured, call 911 in addition to the panic! ))",

  "## Treatment",

  "Tell me how you'd treat these - a closed fracture on a patient's leg.", 
  "A gunshot wound to the chest.", 
  "1st, 2nd and 3rd degree burns.", 
  "Stab wounds.", 
  "A concussion.",

  "## Fire calls",

   "I'll show you where the fire extinguishers live. (( RP pulling it out first, then `/fl`. Heads up - it's INVISIBLE in the top-left weapon wheel slot! ))",

  "To extinguish just take the pin out and shoot straight into the fire (( press `E` on the floating UI, then `/extinguish` )).",

  "Watch for lingering flames - check the surroundings thoroughly. (( Some fires are glitched and only show in the UI when you're physically close. ))",

  "(( Unattended fires get handled by roadworkers after 5 minutes - that doesn't mean you leave a fire unattended. ))",

  "Fire calls don't close themselves. `/closecall ID`.",

  "And put the extinguisher back when you're done.",

  "## Methadone",

  "Let's go over the methadone procedure - I'll give you an example of when you can supply it. || Make sure they understand WELL - improperly prescribing is disciplinary action. ||",

  "Drug test before every sale. Cash only, $500.",

  "(( Full RP before the command - otherwise it's powergaming and faction command abuse. ))",

  "## Breathalyser",

  "The breathalyzer process, (( `/breathanalyse` )) Consent first, always. (( And RP before the command. ))",

  "## Scene management",

   "(( Our blockades - `arrow`, `barrier`, `barrier2`, `cone`, `stretcher`, `backboard`, `tent`, `bls`. ))",
  "(( You can place them by /blockade [name] for example: /blockade arrow ))",
  "(( You can also see the full list by doing `/blockade a` ))",

  "## Department radio",

  "MD, PD, SD, DOC and GOV use the department radio. (( `/dep` ))",

  "Quick quiz - call priority?",

  "Department radio has to be answered even when we're 10-9. Always say 'MD to' first.",

  "Urgent - skip 'how copy'. Non-urgent - 'MD to PD/SD, how copy?' and wait for the response.",

  "Once certified, the highest-ranking unit on shift usually answers departmental radio - unless a shift lead is appointed or a training unit has prio. (( If you're unsure whether anyone has prio, ask. ))",

  "## PD/SD calls",

  "Do you remember how we talk to PD/SD over department radio - and report en-route on both our normal and department radio.",

  "Roll up - who's injured, who's 10-15/10-16, and has any treatment been given before our arrival? Most PD/SD employees have BLS training.",

  "No 10-15s? Normal call. Injured 10-15? Treat, then ask PD/SD if you can take them to the ambulance.",

  "Never take a 10-15 without permission. Never leave a scene without permission. Always ask which hospital. Never drop the patient without asking.",

  "Ask twice rather than get IA'd for stealing a 10-15.",

  "## Teamspeak (OOC)",

  "## Jointed Tac",

  "JTAC - what it is, and how it's used. (( JTAC is IC - in-game VOIP required. TS VOIP without in-game VOIP can be a server punishment. ))",

  "Respect and professionalism are UTTERLY important here.",

  "## On-call pager program",

  "Here's your On-Call Program Pager || stored in the locker room || - (( explain the program. You're not obliged to join. Don't forget the discord role! ))",

  "## Re-introduction email",

  "|| Last thing - send the Re-Introduction email - it contains useful things you may need during training and employment. The copy button lives in the Guide view. ||",
].join("\n\n");
