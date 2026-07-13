import {
  ROUTE_ACCESS,
  ROLES,
  ADMIN_USER_IDS,
  type RoleName,
  type RouteRoleRule,
} from "@/configs/roles";

// Re-export the source types so callers can import everything from one place.
export type { RoleName, RouteRoleRule };

// ─── One-time config sanity check ──────────────────────────────────────
// Discord role and user snowflakes are 17–20 digits. A typo here would
// silently disable admin bypass or a route gate, so we warn at module load
// if anything in ROLES or ADMIN_USER_IDS doesn't look like a snowflake.
const SNOWFLAKE_PATTERN = /^\d{17,20}$/;

function warnIfNotSnowflake(label: string, id: string): void {
  if (!SNOWFLAKE_PATTERN.test(id)) {
    console.warn(
      `[role-config] ${label} = "${id}" doesn't look like a Discord snowflake (expected 17–20 digits).`,
    );
  }
}

for (const [alias, id] of Object.entries(ROLES)) {
  warnIfNotSnowflake(`ROLES.${alias}`, id);
}
for (const id of ADMIN_USER_IDS) {
  warnIfNotSnowflake("ADMIN_USER_IDS", id);
}

/**
 * Find the most specific route rule matching `pathname` by longest-prefix
 * match. Returns `undefined` if no rule applies — which is treated as
 * "open" downstream.
 *
 * The trailing `/` in the prefix check matters: it prevents keys like
 * `/phase-paperworks` from accidentally matching `/phase-paperworks-v2`.
 */
export function matchRoleRule(pathname: string): RouteRoleRule | undefined {
  let bestKey: string | null = null;
  for (const key of Object.keys(ROUTE_ACCESS)) {
    if (pathname === key || pathname.startsWith(`${key}/`)) {
      if (!bestKey || key.length > bestKey.length) bestKey = key;
    }
  }
  return bestKey ? ROUTE_ACCESS[bestKey] : undefined;
}

/**
 * Decide whether a user may access `pathname`, given the Discord guild role
 * snowflakes in their JWT.
 *
 *   1. Admins (in `ADMIN_USER_IDS`) always pass.
 *   2. If the route has no rule (or an empty rule), it's open.
 *   3. Otherwise, the user must hold at least one of the route's
 *      `requireAnyRole` aliases (resolved via `ROLES`).
 */
export function userHasAccess(
  pathname: string,
  userRoleIds: readonly string[],
  discordId?: string,
): boolean {
  if (discordId && ADMIN_USER_IDS.has(discordId)) {
    return true;
  }

  const rule = matchRoleRule(pathname);
  if (!rule || rule.requireAnyRole.length === 0) return true;

  // Resolve the friendly aliases to snowflake IDs, then intersect. Using a
  // Set drops `as const`'s literal-union type so `.has(string)` typechecks.
  const requiredIds = new Set<string>(
    rule.requireAnyRole.map((alias) => ROLES[alias]),
  );
  for (const id of userRoleIds) {
    if (requiredIds.has(id)) return true;
  }
  return false;
}
