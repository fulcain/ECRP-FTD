"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { fetchEMRProfileLinks, EMRProfileLink } from "@/components/current-emrs/fetchCurrentEMRs";

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

export type FormType = "normal" | "reinstatement";

interface AdditionalMandatoriesState {
  normal: string;
  reinstatement: string;
}

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

/**
 * Top-level provider that owns the cross-form session state
 * (FTO name, date, times, EMR, current phase, additional mandatories).
 * Persists the long-lived fields to `localStorage` so a refresh — or
 * switching to the other form type — doesn't lose the trainer's inputs.
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [persisted, setPersisted] = useLocalStorage<{
    ftoName: string;
    date: string | null; // ISO string or null
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

  const [emrList, setEmrList] = useState<EMRProfileLink[]>([]);
  useEffect(() => {
    fetchEMRProfileLinks().then(setEmrList);
  }, []);

  const [formType, setFormTypeRaw] = useLocalStorage<FormType>(
    "ftd-form-type",
    "normal",
  );
  const setFormType = (type: FormType) => setFormTypeRaw(type);

  const [currentPhase, setCurrentPhase] = useState<string | null>(null);

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

/**
 * Returns the shared session context. Throws if no `SessionProvider` is
 * mounted above the call site (intentional — it's a developer error,
 * not a runtime condition to handle).
 */
export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within a <SessionProvider>");
  }
  return ctx;
}
