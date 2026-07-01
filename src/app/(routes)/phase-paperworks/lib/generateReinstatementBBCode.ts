export function generateReinstatementBBCode(
  values: Record<string, any>,
  phase: string,
  sections: string[],
  image?: string,
) {
  const yesNo = (val: boolean) => (val ? "YES" : "NO");
  const cbCodeFts = values.ftsCompleted ? "[cbc]" : "[cb]";
  const medicalGiven = values.wasMedicalGiven ? "YES" : "NO";
  const reintroEmailSent = values.reintroEmailSent ? "YES" : "NO";
  const detailedNotesListType = values.detailedNotesListNone ? "none" : "";
  const fTSessionLink = "https://forms.gle/BJ6iLg5Fkf9Ug6fE6";

  // 10-15 Call section — uses "reinstatee" language
  const tenFifteenSection = `[list]
${
  values.participated && values.tenFifteenCalls?.length
    ? values.tenFifteenCalls
        .map(
          (call: any, index: number) =>
            `[*]Call ${index + 1}: ${call.rating || "N/A"} - ${call.performanceNotes || "N/A"}`,
        )
        .join("\n")
    : "[*]N/A"
}
[/list]`;

  // Ride-along section
  const rideAlongSection = `[b]Ride-along Type:[/b] ${values.rideAlongType || ""}`;

  // Detailed notes — renamed to "Certification Notes" for cert passed/failed
const detailedNotesTitles = {
  reinstatementCertPassed: "Reinstatement Certification Notes (50 Word Minimum)",
  reinstatementCertFailed: "Reinstatement Certification Notes (50 Word Minimum)",
  reinstatementPhase1: "Reinstatement Phase I Notes (25 Word Minimum)",
  reinstatementRideAlong: "Ride-along Notes (as detailed as possible, minimum 20 words)",
  reinstatementPhase2: "Reinstatement Phase Two Notes (25 Word Minimum)",
} as const;

const detailedNotesSection = `[b]${
  detailedNotesTitles[phase as keyof typeof detailedNotesTitles] ??
  "Reinstatement Phase Two Notes (25 Word Minimum)"
}:[/b]`;

  // Issues section (not used in reinstatement but kept for extensibility)
  const issuesSection =
    sections.includes("issues") && values.issues
      ? `[b]Issues:[/b]
[list=none]
${values.issues}
[/list]`
      : "";

  // Reason for failure
  const reasonFailureSection = sections.includes("failedCert")
    ? `[b]Reason(s):[/b]
[list=none]
${values.reasonFailure}
[/list]`
    : "";

      // Reintroduction email checkbox (Phase I only)
  const reintroEmailLine =
    phase === "reinstatementPhase1"
      ? `[b]Was the Reinstatee sent the Re-Introduction Email?[/b] ${reintroEmailSent}\n`
      : "";

        // Pass/fail line for Phase I
  const phasePassLine =
    phase === "reinstatementPhase1"
      ? `[b]Did the Reinstatee pass Phase I:[/b] ${yesNo(values.phasePassed)}\n`
      : phase === "reinstatementPhase2"
      ? `[b]Did the reinstatee pass Reinstatement Phase II? [/b] ${yesNo(values.phasePassed)}\n`
      : "";

  // Notes for next training session
  const notesNextTrainingSection =
    sections.includes("nextTraining") && phase !== "reinstatementCertFailed"
      ? `[lsemssubtitle]CONCLUDING NOTES:[/lsemssubtitle]
[divbox=white]
[b]Mandatory Ride-Alongs given:[/b] ${values.additionalMandatories || "0"}

[b]Any subjects that require additional attention in their next session:[/b]
[list=none]
${values.notesNextTraining || ""}
[/list]
${reintroEmailLine}
${phasePassLine}
[/divbox]`
      : "";

  // Pre-cert notes (not used in reinstatement)
  const notesForPreCert = "";

  // Passed cert notes — reinstatement version
  const notesForPassedCert = sections.includes("passedCertNotes")
    ? `[lsemssubtitle]CERTIFICATION PASSED NOTES:[/lsemssubtitle]
[divbox=white]
[b] Call sign given: [/b] ECHO-${values.callsign}

[b] Medical license present/given? [/b] ${medicalGiven}

[/divbox]`
    : "";

  // Failed cert notes — reinstatement version
  const notesForFailedCert = sections.includes("failedCert")
    ? `[lsemssubtitle]CERTIFICATION FAILED NOTES:[/lsemssubtitle]
[divbox=white]
${reasonFailureSection}

[b]Number of mandatory ridealongs (Minimum 2 + any you deem necessary):[/b] ${values.additionalMandatories}

[b]Any subjects that require additional attention in their next session:[/b][list=none]
${values.notesNextTraining}

[/list]
[/divbox]`
    : "";

  // Signature section
  const signatureSection = `[lsemssubtitle]SIGNATURE[/lsemssubtitle]
[divbox=white]
[img]${values.signature || ""}[/img]
${values.rank || ""}
[/divbox]`;


  // Assemble all phases dynamically
  const sessionDetailsParts = [
    values.rideAlongType ? rideAlongSection : "",
    `[b]Time Started:[/b] ${values.timeStarted || ""}`,
    `[b]Time Ended:[/b] ${values.timeEnded || ""}`,
    `[b]Were there any department calls?[/b] ${yesNo(values.departmentCalls)}`,
    `[b]Did the reinstatee transport a 10-15?[/b] ${yesNo(values.participated)}
[i]If Yes, rate their performance (1-5). Explain any issues if performance was poor[/i]`,
    tenFifteenSection,
    detailedNotesSection,
    `[b][ooc] How did they do Roleplay-wise? Note anything negative and positive:[/ooc][/b][list=none]
[ooc]${values.roleplayNotes || ""}[/ooc]
[/list]`,
    issuesSection,
  ].filter(Boolean);

  const postSessionParts = [
    notesForPreCert,
    notesForPassedCert,
    notesForFailedCert,
    notesNextTrainingSection,
  ].filter(Boolean);

  return `${image ? `[img]${image}[/img]\n` : ""}[lsemssubtitle]SESSION DETAILS:[/lsemssubtitle]
[divbox=white]

${sessionDetailsParts.join("\n\n")}
[/divbox]
${postSessionParts.join("\n")}
[lsemssubtitle]Field Training Session Report[/lsemssubtitle]
[divbox=white]
[b]Click [url=${fTSessionLink}]here[/url] to submit your Field Training Session Report.[/b] ${cbCodeFts} [i](tick with an X if complete.)[/i]
[/divbox]
${signatureSection}
[lsemsfooter][/lsemsfooter]`;
}
