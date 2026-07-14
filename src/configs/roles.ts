export const ROLES = {
  FTHead: "459439795635224589",
  FTAssHead: "1030270859610423407",
  Command: "1189390497639301213",
  FTO: "796493688649023518",
  FTI: "836248428971425823",
} as const;

/** Union of role aliases above. Used to type-check `requireAnyRole[]`. */
export type RoleName = keyof typeof ROLES;

/** A single route role rule: which roles unlock a path (any-of). */
export interface RouteRoleRule {
  requireAnyRole: RoleName[];
}

/** Every FT Related role and Command+. */
const everyone: RoleName[] = [
  "FTHead",
  "FTAssHead",
  "Command",
  "FTO",
  "FTI",
];

export const ROUTE_ACCESS: Record<string, RouteRoleRule> = {
  "/paperwork": {
    requireAnyRole: everyone,
  },
  "/fd-command": {
    requireAnyRole: ["FTHead", "FTAssHead", "Command"],
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