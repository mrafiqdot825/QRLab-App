import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

const STORAGE_FILE = `${FileSystem.documentDirectory || ''}qrlab_app_state.json`;
const WEB_KEY = 'qrlab_first_visit_demo_seen';

interface AppStoredState {
  hasSeenFeatureDemo: boolean;
  firstLaunchTimestamp?: number;
}

export const AppStorageService = {
  /**
   * Checks whether the user has already seen the first-visit feature demo.
   */
  async getHasSeenFeatureDemo(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          const val = window.localStorage.getItem(WEB_KEY);
          return val === 'true';
        }
        return false;
      }

      const fileInfo = await FileSystem.getInfoAsync(STORAGE_FILE);
      if (!fileInfo.exists) {
        return false;
      }

      const raw = await FileSystem.readAsStringAsync(STORAGE_FILE);
      const parsed: AppStoredState = JSON.parse(raw);
      return Boolean(parsed.hasSeenFeatureDemo);
    } catch {
      return false;
    }
  },

  /**
   * Marks the first-visit feature demo as seen.
   */
  async setHasSeenFeatureDemo(seen: boolean = true): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(WEB_KEY, seen ? 'true' : 'false');
        }
        return;
      }

      let state: AppStoredState = {
        hasSeenFeatureDemo: seen,
        firstLaunchTimestamp: Date.now(),
      };

      try {
        const fileInfo = await FileSystem.getInfoAsync(STORAGE_FILE);
        if (fileInfo.exists) {
          const raw = await FileSystem.readAsStringAsync(STORAGE_FILE);
          state = { ...JSON.parse(raw), hasSeenFeatureDemo: seen };
        }
      } catch {
        // Fallback to fresh state
      }

      await FileSystem.writeAsStringAsync(STORAGE_FILE, JSON.stringify(state));
    } catch {
      // Ignore write failures silently
    }
  },

  /**
   * Resets the demo state so the user can test/replay the onboarding experience.
   */
  async resetFeatureDemo(): Promise<void> {
    await this.setHasSeenFeatureDemo(false);
  },
};

