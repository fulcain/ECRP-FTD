/**
 * Hand-maintained change log for the FTD App.
 *
 * To add a new entry, append a `{ ... }` object to the appropriate day's
 * `entries` array, or create a new `ChangeLogDay` for a new date.
 * The page renders the days in array order, so place the most recent
 * day at the top of the array.
 *
 * Each entry has a `type` that determines its badge color:
 *
 *   • `added`   — green   (a new feature or piece of content)
 *   • `changed` — amber   (an existing feature was updated)
 *   • `fixed`   — sky     (a bug was fixed)
 *   • `removed` — rose    (something was removed)
 */
export type ChangeLogEntryType = "added" | "changed" | "fixed" | "removed";

export type ChangeLogEntry = {
  type: ChangeLogEntryType;
  description: string;
};

export type ChangeLogDay = {
  /** ISO date for this batch of changes, e.g. "2026-07-13". */
  date: string;
  entries: ChangeLogEntry[];
};

/**
 * Add new days to the **top** of this array.
 * The page renders them in reverse chronological order.
 */
export const changeLog: ChangeLogDay[] = [
  {
    date: "2026-07-13",
    entries: [
      {
        type: "added",
        description: "Added a dedicated Change Log page.",
      },
      {
        type: "added",
        description: "Added Discord authentication.",
      },
      {
        type: "added",
        description:
          "Added a copy button next to commands to make them easier to copy in the phase paperwork page.",
      },
      {
        type: "added",
        description:
          "Added an FTO Trainee creation feature to the Command page.",
      },
      {
        type: "added",
        description:
          "Added the ability for FT Command and MD Command+ to edit and delete Field Training Sessions directly from the table.",
      },
    ],
  },
  {
    date: "2026-07-11",
    entries: [
      {
        type: "added",
        description: "Added a Next Session title generator.",
      },
      {
        type: "added",
        description:
          "Added phase notes to each phase to make training easier.",
      },
    ],
  },
  {
    date: "2026-07-04",
    entries: [
      {
        type: "changed",
        description:
          "Moved the Field Training Session section to the Phase Paperwork page.",
      },
    ],
  },
];