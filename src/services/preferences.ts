import * as Haptics from 'expo-haptics';
import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';

/**
 * App preferences shown on the Settings screen. Kept in memory for the session;
 * read by the haptics helper and by the PNG exporter.
 */
export interface Preferences {
  haptics: boolean;
  hdExport: boolean;
}

let prefs: Preferences = { haptics: true, hdExport: true };
const listeners = new Set<() => void>();

export function getPreferences(): Preferences {
  return prefs;
}

export function setPreference<K extends keyof Preferences>(key: K, value: Preferences[K]) {
  if (prefs[key] === value) return;
  prefs = { ...prefs, [key]: value };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function usePreferences(): Preferences {
  return useSyncExternalStore(subscribe, getPreferences, getPreferences);
}

/** PNG export edge length in pixels. */
export function exportPixelSize(): number {
  return prefs.hdExport ? 2048 : 1024;
}

type HapticKind = 'light' | 'medium' | 'success';

/** Fires a haptic tap unless the user turned haptics off. No-op on web. */
export function haptic(kind: HapticKind = 'light') {
  if (Platform.OS === 'web' || !prefs.haptics) return;
  if (kind === 'success') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    return;
  }
  Haptics.impactAsync(
    kind === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
  ).catch(() => {});
}
