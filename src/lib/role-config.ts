export interface RouteRoleRule {
  requireAnyRoleId?: string[];
}

export type RoleConfigMap = Record<string, RouteRoleRule>;

let cached: RoleConfigMap | null = null;

export function loadRoleConfig(): RoleConfigMap {
  if (cached) return cached;
  const raw = process.env.DISCORD_ROLE_CONFIG;
  if (!raw) {
    cached = {};
    return cached;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      cached = parsed as RoleConfigMap;
      return cached;
    }
    console.warn(
      "[role-config] DISCORD_ROLE_CONFIG must be a JSON object, ignoring.",
    );
  } catch (err) {
    console.warn("[role-config] Failed to parse DISCORD_ROLE_CONFIG:", err);
  }
  cached = {};
  return cached;
}

const SNOWFLAKE_PATTERN = /^\d{17,20}$/;

let cachedAdminIds: Set<string> | null = null;

export function loadAdminIds(): Set<string> {
  if (cachedAdminIds) return cachedAdminIds;
  const raw = process.env.DISCORD_ADMIN_IDS;
  if (!raw) {
    cachedAdminIds = new Set();
    return cachedAdminIds;
  }
  const parsed: string[] = [];
  for (const piece of raw.split(",")) {
    const trimmed = piece.trim();
    if (!trimmed) continue;
    if (!SNOWFLAKE_PATTERN.test(trimmed)) {
      console.warn(
        `[role-config] DISCORD_ADMIN_IDS: ignoring "${trimmed}" — not a valid Discord user snowflake (expected 17–20 digits).`,
      );
      continue;
    }
    parsed.push(trimmed);
  }
  cachedAdminIds = new Set(parsed);
  return cachedAdminIds;
}

export function matchRoleRule(
  pathname: string,
  config: RoleConfigMap,
): RouteRoleRule | undefined {
  let bestKey: string | null = null;
  for (const key of Object.keys(config)) {
    if (pathname === key || pathname.startsWith(`${key}/`)) {
      if (!bestKey || key.length > bestKey.length) bestKey = key;
    }
  }
  return bestKey ? config[bestKey] : undefined;
}

export function userHasAccess(
  pathname: string,
  roles: string[],
  config: RoleConfigMap = loadRoleConfig(),
  options?: { discordId?: string; adminIds?: Set<string> },
): boolean {
  if (
    options?.discordId &&
    options?.adminIds &&
    options.adminIds.has(options.discordId)
  ) {
    return true;
  }
  const rule = matchRoleRule(pathname, config);
  const required = rule?.requireAnyRoleId ?? [];
  if (required.length === 0) return true;
  return required.some((r) => roles.includes(r));
}
