export const ROLES = {
  FTHead: "459439795635224589",
  FTAssHead: "1030270859610423407",
  Command: "1189390497639301213",
  Consultant:"1039228533651816590",
  FTO: "796493688649023518",
  FTI: "836248428971425823",
} as const;

/** Union of role aliases above. Used to type-check `requireAnyRole[]`. */
export type RoleName = keyof typeof ROLES;

export const RANKS = {
  ChiefOfEMS: "459439793185488916",
  AssistantChiefOfEMS: "624916991421054976",
  DeputyChiefOfEMS: "459439793307123713",
  Consultant: "1039228533651816590",
  Commander: "459439795391823882",
  Captain: "459439798491283458",
  Lieutenant: "459439799359635497",
  LeadParamedic: "579584822494625803",
  SeniorParamedic: "459439799825072129",
  Paramedic: "554627428446765066",
  JuniorParamedic: "993202463962320926",
  MasterEMT: "819650743228956692",
  EMPP: "1149314508934889553",
  EMTAdvanced: "459439804719955968",
  EMTIntermediate: "459439805885972501",
  EMTBasic: "459439805915201556",
  EMRTrainee: "459439807496585217",
} as const;

/** Union of LSEMS rank aliases above. Drives `RANK_HIERARCHY` typing. */
export type LsemsRankName = keyof typeof RANKS;

/** A single route role rule: which roles unlock a path (any-of). */
export interface RouteRoleRule {
  requireAnyRole: RoleName[];
}

/** Every FT Related role and Command+. */
const everyone: RoleName[] = [
  "FTHead",
  "FTAssHead",
  "Command",
  "Consultant",
  "FTO",
  "FTI",
];

export const ROUTE_ACCESS: Record<string, RouteRoleRule> = {
  "/paperwork": {
    requireAnyRole: everyone,
  },
  "/fd-command": {
    requireAnyRole: ["FTHead", "FTAssHead", "Command", "Consultant"],
  },
  "/change-log": {
    requireAnyRole: everyone,
  },
  "/": {
    requireAnyRole: everyone,
  },
};

/**
 * Discord user IDs that bypass every role check. Useful for bootstrapping
 * (add yourself while you're setting things up) and for true operators.
 *
 */
export const ADMIN_USER_IDS: ReadonlySet<string> = new Set([
  "290467278540242944",
]);