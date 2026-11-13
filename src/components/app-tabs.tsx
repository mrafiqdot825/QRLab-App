import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ds/app-text';
import type { IconName } from '@/components/ds/controls';
import { C, SHADOW_FLOAT, TAB_BAR_HEIGHT } from '@/constants/design';
import { useKeyboardVisible } from '@/hooks/use-keyboard-visible';
import { haptic } from '@/services/preferences';

interface TabRoute {
  key: string;
  name: string;
}

interface AppTabBarProps {
  state: { index: number; routes: TabRoute[] };
  navigation: {
    emit: (e: { type: 'tabPress'; target: string; canPreventDefault: true }) => {
      defaultPrevented: boolean;
    };
    navigate: (name: string) => void;
  };
}

interface TabConfig {
  label: string;
  icon: IconName;
  activeIcon: IconName;
  center?: boolean;
}

export const TAB_CONFIGS: Record<string, TabConfig> = {
  index: { label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  explore: { label: 'Templates', icon: 'grid-outline', activeIcon: 'grid' },
  studio: { label: 'Create', icon: 'add', activeIcon: 'add', center: true },
  inbox: { label: 'Inbox', icon: 'notifications-outline', activeIcon: 'notifications' },
  settings: { label: 'Settings', icon: 'options-outline', activeIcon: 'options' },
};

const TabButton = React.memo(function TabButton({
  route,
  focused,
  onPress,
}: {
  route: TabRoute;
  focused: boolean;
  onPress: (route: TabRoute, focused: boolean) => void;
}) {
  const cfg = TAB_CONFIGS[route.name] ?? {
    label: route.name,
    icon: 'ellipse-outline' as const,
    activeIcon: 'ellipse' as const,
  };
  const color = focused ? C.brand : C.inactive;

  return (
    <Pressable
      onPress={() => onPress(route, focused)}
      accessibilityRole="tab"
      accessibilityLabel={cfg.label}
      accessibilityState={{ selected: focused }}
      style={({ pressed }) => [styles.tab, pressed && styles.pressed]}>
      {cfg.center ? (
        <View style={styles.center}>
          <Ionicons name="add" size={24} color={C.white} />
        </View>
      ) : (
        <Ionicons name={focused ? cfg.activeIcon : cfg.icon} size={23} color={color} />
      )}
      <AppText weight={focused ? 'bold' : 'semibold'} size={11} color={color} numberOfLines={1}>
        {cfg.label}
      </AppText>
    </Pressable>
  );
});

/** Flat white tab bar: Home, Templates, Create (black circle), Inbox, Settings. */
export function AppTabBar({ state, navigation }: AppTabBarProps) {
  const insets = useSafeAreaInsets();
  const keyboardOpen = useKeyboardVisible();

  const handlePress = useCallback(
    (route: TabRoute, focused: boolean) => {
      haptic('light');
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!focused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    },
    [navigation]
  );

  // On Android the window resizes for the keyboard; hide the bar so it doesn't ride on top of it.
  if (keyboardOpen && Platform.OS === 'android') return null;

  return (
    <View accessibilityRole="tablist" style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, i) => (
        <TabButton key={route.key} route={route} focused={state.index === i} onPress={handlePress} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: C.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.border,
    paddingTop: 4,
  },
  tab: {
    flex: 1,
    height: TAB_BAR_HEIGHT - 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  pressed: {
    opacity: 0.7,
  },
  center: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.brand,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: SHADOW_FLOAT,
  },
});
