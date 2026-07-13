
export const ROLES = {
  FTOHead: "459439795635224589",
  FTOAssHead: "1030270859610423407",
  Commad: "1189390497639301213",
  FTI: "796493688649023518",
  FTO: "836248428971425823",
} as const;

/** Union of role aliases above. Used to type-check `requireAnyRole[]`. */
export type RoleName = keyof typeof ROLES;

/** A single route role rule: which roles unlock a path (any-of). */
export interface RouteRoleRule {
  requireAnyRole: RoleName[];
}

/**
 * Map of path-prefix → rule. Path matching is exact-or-prefix, with the
 * longest matching key winning — see `matchRoleRule` in role-config.ts.
 * Adding a new gated page? Just add another entry below.
 */
export const ROUTE_ACCESS: Record<string, RouteRoleRule> = {
  "/phase-paperworks": {
    requireAnyRole: [
      "FTOHead",
      "FTOAssHead",
      "Commad",
      "FTI",
      "FTO",
    ],
  },
  "/fd-command": {
    requireAnyRole: ["FTOHead", "FTOAssHead", "Commad",],
  },
};

/**
 * Discord user IDs that bypass every role check. Useful for bootstrapping
 * (add yourself while you're setting things up) and for true operators.
 *
 * Keep this list small — anyone in `ADMIN_USER_IDS` can read every route.
 */
export const ADMIN_USER_IDS: ReadonlySet<string> = new Set([
  "290467278540242944",
]);