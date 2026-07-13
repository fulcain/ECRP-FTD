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

/**
 * Map of path-prefix → rule. Path matching is exact-or-prefix, with the
 * longest matching key winning — see `matchRoleRule` in role-config.ts.
 * Adding a new gated page? Just add another entry below.
 *
 * Note: the FTO creation feature used to live at `/fto-creation`, but it
 * was moved under the FT Command page (`/fd-command`) so users see it in
 * the same surface as the EMR roster. If you ever need a standalone
 * route for it again, just add back a `/fto-creation` entry here.
 */
export const ROUTE_ACCESS: Record<string, RouteRoleRule> = {
  "/phase-paperworks": {
    requireAnyRole: [
      "FTHead",
      "FTAssHead",
      "Command",
      "FTO",
      "FTI",
    ],
  },
  "/fd-command": {
    requireAnyRole: ["FTHead", "FTAssHead", "Command"],
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
