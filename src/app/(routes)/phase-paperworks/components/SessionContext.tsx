"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { fetchEMRProfileLinks, EMRProfileLink } from "@/components/current-emrs/fetchCurrentEMRs";

/* ------------------------------------------------------------------ */
/*  Shape of the shared session details                               */
/* ------------------------------------------------------------------ */

export interface SessionDetails {
  ftoName: string;
  date: Date | undefined;
  timeStart: string;   // "HH:MM" from <input type="time">
  timeFinish: string;  // "HH:MM"
  emrName: string;     // selected from EMR dropdown
  emrNameManual: string; // manual fallback
  sessionConducted: string;
}

const defaultDetails: SessionDetails = {
  ftoName: "",
  date: undefined,
  timeStart: "",
  timeFinish: "",
  emrName: "",
  emrNameManual: "",
  sessionConducted: "",
};

/* ------------------------------------------------------------------ */
/*  Shared paperwork-mode state                                       */
/* ------------------------------------------------------------------ */

export type FormType = "normal" | "reinstatement";

interface AdditionalMandatoriesState {
  normal: string;
  reinstatement: string;
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface SessionContextValue {
  /** The current shared session fields. */
  details: SessionDetails;

  /** Replace the entire details object (or merge via spread). */
  setDetails: React.Dispatch<React.SetStateAction<SessionDetails>>;

  /** Derived: whichever EMR name the user chose. */
  resolvedEMR: string;

  /** Full list of FTO names (from /api/get-fto-names). */
  ftoNames: string[];

  /** Full EMR list with profile links (from /api/current-emrs). */
  emrList: EMRProfileLink[];

  /** Derive the profile-link for the currently-selected EMR. */
  selectedEMRProfileLink: string | undefined;

  /** Which paperwork form is currently rendered. */
  formType: FormType;
  setFormType: (type: FormType) => void;

  /** Current phase within the active form (e.g. "phase1", "reinstatementPhase2"). */
  currentPhase: string | null;
  setCurrentPhase: (phase: string | null) => void;

  /**
   * Live Additional Mandatories count for the *currently active* form type.
   * Used by the SessionDetailsCard's "Pending Nx Mandatory" badge / dropdown
   * option and by the form for BBCode generation.
   */
  additionalMandatories: string;
  setAdditionalMandatories: (value: string) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // Persist the core fields (date stored as ISO string, parsed back on load)
  const [persisted, setPersisted] = useLocalStorage<{
    ftoName: string;
    date: string | null;   // ISO string or null
    timeStart: string;
    timeFinish: string;
    emrName: string;
    emrNameManual: string;
    sessionConducted: string;
  }>("ftd-session-details", {
    ftoName: "",
    date: null,
    timeStart: "",
    timeFinish: "",
    emrName: "",
    emrNameManual: "",
    sessionConducted: "",
  });

  // Convert persisted serialisable shape → SessionDetails shape
  const [details, setDetails] = useState<SessionDetails>(() => ({
    ...defaultDetails,
    ftoName: persisted.ftoName,
    date: persisted.date ? new Date(persisted.date) : undefined,
    timeStart: persisted.timeStart,
    timeFinish: persisted.timeFinish,
    emrName: persisted.emrName,
    emrNameManual: persisted.emrNameManual,
    sessionConducted: persisted.sessionConducted,
  }));

  // Sync details back into localStorage whenever they change
  useEffect(() => {
    setPersisted({
      ftoName: details.ftoName,
      date: details.date ? details.date.toISOString() : null,
      timeStart: details.timeStart,
      timeFinish: details.timeFinish,
      emrName: details.emrName,
      emrNameManual: details.emrNameManual,
      sessionConducted: details.sessionConducted,
    });
  }, [details, setPersisted]);

  // Fetch FTO names on mount
  const [ftoNames, setFtoNames] = useState<string[]>([]);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/get-fto-names");
        const data = await res.json();
        setFtoNames(data.options ?? []);
      } catch (err) {
        console.error("Error fetching FTO names:", err);
      }
    };
    load();
  }, []);

  // Fetch EMR list (with profile links) on mount
  const [emrList, setEmrList] = useState<EMRProfileLink[]>([]);
  useEffect(() => {
    fetchEMRProfileLinks().then(setEmrList);
  }, []);

  // Active paperwork form type — persists across reloads
  const [formType, setFormTypeRaw] = useLocalStorage<FormType>(
    "ftd-form-type",
    "normal",
  );
  const setFormType = (type: FormType) => setFormTypeRaw(type);

  // Currently selected phase within the active form (transient)
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);

  // Additional Mandatories — kept separately per form type so switching tabs
  // doesn't lose data.
  const [additionalMandatoriesByType, setAdditionalMandatoriesByType] =
    useLocalStorage<AdditionalMandatoriesState>(
      "ftd-additional-mandatories",
      { normal: "", reinstatement: "" },
    );

  const additionalMandatories =
    additionalMandatoriesByType[formType] ?? "";

  const setAdditionalMandatories = (value: string) => {
    setAdditionalMandatoriesByType((prev) => ({ ...prev, [formType]: value }));
  };

  const resolvedEMR = details.emrName || details.emrNameManual;

  const selectedEMRProfileLink = emrList.find(
    (e) => e.EMR === details.emrName,
  )?.profileLink;

  return (
    <SessionContext.Provider
      value={{
        details,
        setDetails,
        resolvedEMR,
        ftoNames,
        emrList,
        selectedEMRProfileLink,
        formType,
        setFormType,
        currentPhase,
        setCurrentPhase,
        additionalMandatories,
        setAdditionalMandatories,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within a <SessionProvider>");
  }
  return ctx;
}
