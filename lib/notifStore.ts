"use client";

import { useState, useCallback } from "react";

const STORE_KEY = "sim_notif_store";

interface NotifState {
  readIds: string[];
  prefOverrides: Record<string, Record<string, boolean>>;
}

function load(): NotifState {
  if (typeof window === "undefined") return { readIds: [], prefOverrides: {} };
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
    return { readIds: raw.readIds ?? [], prefOverrides: raw.prefOverrides ?? {} };
  }
  catch { return { readIds: [], prefOverrides: {} }; }
}

function persist(state: NotifState): void {
  if (typeof window !== "undefined")
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

export function useNotifStore(role: string) {
  const [state, setState] = useState<NotifState>(() => load());

  const markRead = useCallback((id: string) => {
    setState(prev => {
      if (prev.readIds.includes(id)) return prev;
      const next = { ...prev, readIds: [...prev.readIds, id] };
      persist(next);
      return next;
    });
  }, []);

  const togglePref = useCallback((r: string, key: string) => {
    setState(prev => {
      const rolePrefs = prev.prefOverrides[r] ?? {};
      const current = rolePrefs[key];
      const next: NotifState = {
        ...prev,
        prefOverrides: {
          ...prev.prefOverrides,
          [r]: { ...rolePrefs, [key]: current === undefined ? false : !current },
        },
      };
      persist(next);
      return next;
    });
  }, []);

  const getPrefs = useCallback(
    (defaultPrefs: Array<{ key: string; label: string; detail: string; enabled: boolean }>) => {
      const overrides = state.prefOverrides[role] ?? {};
      return defaultPrefs.map(p => ({
        ...p,
        enabled: p.key in overrides ? overrides[p.key] : p.enabled,
      }));
    },
    [state.prefOverrides, role]
  );

  const markAllRead = useCallback((prefix: string, total: number) => {
    const ids = Array.from({ length: total }, (_, i) => `${prefix}-notif-${i}`);
    setState(prev => {
      const merged = Array.from(new Set([...prev.readIds, ...ids]));
      const next = { ...prev, readIds: merged };
      persist(next);
      return next;
    });
  }, []);

  const unreadCount = useCallback(
    (prefix: string, total: number) =>
      Array.from({ length: total }, (_, i) => `${prefix}-notif-${i}`).filter(
        id => !state.readIds.includes(id)
      ).length,
    [state.readIds]
  );

  return { readIds: state.readIds, markRead, markAllRead, togglePref, getPrefs, unreadCount };
}

export function getUnreadCount(prefix: string, total: number): number {
  const state = load();
  return Array.from({ length: total }, (_, i) => `${prefix}-notif-${i}`).filter(
    id => !state.readIds.includes(id)
  ).length;
}
