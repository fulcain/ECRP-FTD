export type PhaseKey =
  | "introduction"
  | "phase1"
  | "phase2"
  | "phase3"
  | "preCert"
  | "certPassed"
  | "certFailed"
  | "rideAlong";

export const paperworkConfig: Record<
  PhaseKey,
  { label: string; image: string | null; sections: string[] }
> = {
  introduction: {
    label: "Introduction",
    image: "https://i.imgur.com/9fbJGt0.png",
    sections: ["issues"],
  },
  phase1: {
    label: "Phase 1",
    image: "https://i.imgur.com/15qKtOb.png",
    sections: ["tenFifteen", "detailedNotes", "nextTraining"],
  },
  phase2: {
    label: "Phase 2",
    image: "https://i.imgur.com/WNwxLGs.png",
    sections: ["tenFifteen", "detailedNotes", "nextTraining"],
  },
  phase3: {
    label: "Phase 3",
    image: "https://i.imgur.com/JjD9Y74.png",
    sections: ["tenFifteen", "detailedNotes", "nextTraining"],
  },
  preCert: {
    label: "Pre-Certification",
    image: "https://i.imgur.com/p33kyzm.png",
    sections: ["tenFifteen", "detailedNotes","preCertNotes"],
  },
  certPassed: {
    label: "Certification Passed",
    image: "https://i.imgur.com/huDCbJP.png",
    sections: ["tenFifteen", "detailedNotes","passedCertNotes"],
  },
  certFailed: {
    label: "Certification Failed",
			image: "https://i.imgur.com/huDCbJP.png",
    sections: ["tenFifteen", "detailedNotes", "failedCert", "nextTraining"],
  },
  rideAlong: {
    label: "Ride Along",
    image: "https://i.imgur.com/fV26BWG.png",
    sections: ["tenFifteen", "rideAlong", "detailedNotes", "nextTraining"],
  },
};
