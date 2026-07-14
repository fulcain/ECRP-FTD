/**
 * Two-record architecture — keep these separate:
 *   • `ROLES` (`configs/roles.ts`) gates FT route access.
 *   • `RANKS` does the LSEMS org rank display on paperworks.
 * Adding to one shouldn't bleed into the other.
 */

import {
  ROUTE_ACCESS,
  ROLES,
  RANKS,
  ADMIN_USER_IDS,
  type RoleName,
  type LsemsRankName,
  type RouteRoleRule,
} from "@/configs/roles";

// Re-export the source types so callers can import everything from one place.
export type { RoleName, LsemsRankName, RouteRoleRule };

/**
 * Minimal shape a nav item must satisfy for `filterAccessibleLinks` to
 * reason about who can see it. Top-level items expose an optional
 * `href`; dropdown/grouped items expose `children` whose entries each
 * carry their own `href`.
 */
export type AccessCheckableLink = {
  href?: string;
  children?: readonly { href: string }[];
};

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
for (const [alias, id] of Object.entries(RANKS)) {
  warnIfNotSnowflake(`RANKS.${alias}`, id);
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
 * `/paperwork` from accidentally matching `/paperwork-v2`.
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
/**
 * Friendly rank labels rendered into the paperwork "Rank" dropdown and
 * BBCode signature. **This object is the single source of truth** for
 * both the labels and the LSEMS rank ordering — `RANK_HIERARCHY` below
 * is derived from its key order so adding a new rank here automatically
 * slots it into `getHighestRank`'s iteration.
 *
 * `Object.keys` returns string keys in insertion order, so the order
 * here IS the order users will see in the dropdown (highest → lowest).
 * Customise any label string here without touching the snowflake
 * config in `configs/roles.ts`.
 *
 * The `satisfies Record<LsemsRankName, string>` constraint enforces that
 * every alias has a label, but does NOT lock the keys to a specific
 * order — so it's safe to insert new ranks anywhere in this object.
 */
export const RANK_LABELS = {
  ChiefOfEMS: "Chief of EMS",
  AssistantChiefOfEMS: "Assistant Chief of EMS",
  DeputyChiefOfEMS: "Deputy Chief of EMS",
  Consultant: "Consultant",
  Commander: "Commander",
  Captain: "Captain",
  Lieutenant: "Lieutenant",
  LeadParamedic: "Lead Paramedic",
  SeniorParamedic: "Senior Paramedic",
  Paramedic: "Paramedic",
  JuniorParamedic: "Junior Paramedic",
  MasterEMT: "Master EMT",
  EMPP: "EMP-P",
  EMTAdvanced: "EMT-Advanced",
  EMTIntermediate: "EMT-Intermediate",
  EMTBasic: "EMT-Basic",
  EMRTrainee: "EMR Trainee",
} satisfies Record<LsemsRankName, string>;

/**
 * LSEMS rank hierarchy used for paperworks: HIGHEST → LOWEST. The first
 * match in the user's Discord role snowflakes wins, so listing Chief of
 * EMS first means a Chief of EMS user is ranked as "Chief of EMS" even
 * if they also hold Paramedic, EMT-Basic, etc.
 *
 * Derived from `RANK_LABELS` key order so the labels object stays the
 * single source of truth — `as readonly LsemsRankName[]` is safe because
 * the `satisfies Record<LsemsRankName, string>` check above guarantees
 * every key is a valid `LsemsRankName`.
 */
export const RANK_HIERARCHY: readonly LsemsRankName[] = Object.keys(
  RANK_LABELS,
) as readonly LsemsRankName[];

/**
 * Resolve a user's Discord role snowflakes down to their highest LSEMS
 * rank. Returns `null` if the user holds no rank-related role.
 *
 * - Iterates `RANK_HIERARCHY` (highest first) so the first match wins.
 * - Looks up snowflakes via `RANKS` so role aliases keep their single
 *   source of truth in `configs/roles.ts`.
 */
export function getHighestRank(
  userRoleIds: readonly string[],
): LsemsRankName | null {
  for (const alias of RANK_HIERARCHY) {
    if (userRoleIds.includes(RANKS[alias])) return alias;
  }
  return null;
}

/** Convenience: look up the friendly label for an LSEMS rank alias. */
export function rankLabel(alias: LsemsRankName): string {
  return RANK_LABELS[alias];
}

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

/**
 * Decide whether `userRoleIds` is allowed to edit FT session rows.
 *
 * Mirrors the same triple (FTHead / FTAssHead / Command) the
 * `/fd-command` route already gates on, so editing a session has the
 * same access bar as opening the Command page. Admins (in
 * `ADMIN_USER_IDS`) short-circuit to `true` to match the rest of
 * `userHasAccess`'s behavior.
 *
 * Used by:
 *   - the `/api/update-session` route (server-side guard)
 *   - `app/page.tsx` (server-rendered flag passed to <AllDataTable>)
 */
export function hasSessionEditAccess(
  userRoleIds: readonly string[],
  discordId?: string,
): boolean {
  if (discordId && ADMIN_USER_IDS.has(discordId)) {
    return true;
  }
  const requiredIds = new Set<string>([
    ROLES.FTHead,
    ROLES.FTAssHead,
    ROLES.Command,
  ]);
  for (const id of userRoleIds) {
    if (requiredIds.has(id)) return true;
  }
  return false;
}

/**
 * Filter a list of nav-style links down to only those the caller is
 * permitted to open. Reuses `userHasAccess` so route rules stay as the
 * single source of truth — adding a new gated route in
 * `configs/roles.ts` automatically updates the header with no extra
 * wiring.
 *
 *   • Items without children are kept iff the caller passes
 *     `userHasAccess(item.href)`.
 *   • Items with children have their non-accessible children stripped;
 *     the parent is then KEPT iff at least one child remains, so we
 *     never render an empty dropdown.
 *   • `userRoleIds === null` means "unauthenticated"/"could not
 *     verify session token". In that case we cannot identify an admin,
 *     so we restrict to purely *open* routes (paths with no entry in
 *     `ROUTE_ACCESS`) — keeping gated links off `/login` and
 *     `/unauthorized`.
 */
export function filterAccessibleLinks<T extends AccessCheckableLink>(
  items: readonly T[],
  userRoleIds: readonly string[] | null,
  discordId?: string,
): T[] {
  const isAuthed = userRoleIds !== null;

  const canSee = (href: string): boolean =>
    isAuthed && userRoleIds
      ? userHasAccess(href, userRoleIds, discordId)
      : matchRoleRule(href) === undefined;

  return items.flatMap<T>((item) => {
    if (item.children) {
      const visibleChildren = item.children.filter((c) => canSee(c.href));
      if (visibleChildren.length === 0) return [];
      // Cast is safe: we are slicing the children subset of T and
      // re-spreading the rest. Runtime shape is preserved.
      return [{ ...item, children: visibleChildren } as T];
    }
    // Defensive: an item lacking both `href` and `children` would
    // crash `HeaderDesktop`/`HeaderMobile` (they read `item.href!`).
    // Drop it rather than leak it through to the renderer.
    if (!item.href) return [];
    return canSee(item.href) ? [item] : [];
  });
}
