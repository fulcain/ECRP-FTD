"use client";

import { useEffect, useState } from "react";
import { getHighestRank, rankLabel } from "@/lib/role-config";

/** Shape of /api/auth/me's `user` payload (kept local to avoid coupling). */
interface MeResponseUser {
  discordId: string;
  username: string;
  globalName: string | null;
  nick: string | null;
  avatar: string | null;
  avatarUrl: string | null;
  roles: string[];
}

export interface HighestRankState {
  rankLabel: string | null;
  /** True until the /api/auth/me request settles. */
  isLoading: boolean;
  /** Error from the fetch, or null on success. */
  error: Error | null;
}


export function useHighestRank(): HighestRankState {
  const [state, setState] = useState<HighestRankState>({
    rankLabel: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          signal: controller.signal,
        });
        if (!res.ok) {
          // 401 = signed out, anything else = unexpected. Either way we
          // surface "no rank" rather than throwing, so paperwork forms
          // stay usable for manual rank entry.
          setState({ rankLabel: null, isLoading: false, error: null });
          return;
        }

        const data = (await res.json()) as { user: MeResponseUser | null };
        const userRoles = data.user?.roles ?? [];
        const alias = getHighestRank(userRoles);
        setState({
          rankLabel: alias ? rankLabel(alias) : null,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        // AbortController rejection = clean unmount, not a real error.
        // Single check covers both fetch and json() abort paths since
        // we own the only abort source (the cleanup below).
        if (controller.signal.aborted) return;
        setState({
          rankLabel: null,
          isLoading: false,
          error: err instanceof Error ? err : new Error(String(err)),
        });
      }
    };

    // `void` makes the floating-promise intent explicit and silences
    // `no-floating-promises` ESLint complaints.
    void load();

    return () => {
      controller.abort();
    };
  }, []);

  return state;
}
