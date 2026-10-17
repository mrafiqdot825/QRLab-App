import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { Palette, SpringConfigs } from '@/constants/theme';

interface LiquidGlassTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const NAV_PURPLE = Palette.plum;
const NAV_INACTIVE = '#6B7280';

export const TAB_CONFIGS: Record<
  string,
  {
    label: string;
    activeIcon: keyof typeof Ionicons.glyphMap;
    inactiveIcon: keyof typeof Ionicons.glyphMap;
    isCenter?: boolean;
  }
> = {
  index: {
    label: 'Home',
    activeIcon: 'home',
    inactiveIcon: 'home-outline',
  },
  explore: {
    label: 'Search',
    activeIcon: 'search',
    inactiveIcon: 'search-outline',
  },
  studio: {
    label: 'Create',
    activeIcon: 'add',
    inactiveIcon: 'add',
    isCenter: true,
  },
  inbox: {
    label: 'Inbox',
    activeIcon: 'notifications',
    inactiveIcon: 'notifications-outline',
  },
  settings: {
    label: 'Profile',
    activeIcon: 'person',
    inactiveIcon: 'person-outline',
  },
};

const BASE_H = 68;
const HUMP_H = 13;
const TOTAL_H = BASE_H + HUMP_H + 2; // 83
const R = BASE_H / 2; // 34
const HW = 44;
const Y_BASE = HUMP_H + 1; // 14
const Y_PEAK = 1;
const Y_BOTTOM = Y_BASE + BASE_H; // 82

function getPathData(w: number): string {
  if (w <= 0) return '';
  const cx = w / 2;
  return (
    `M ${R} ${Y_BASE} ` +
    `L ${cx - HW} ${Y_BASE} ` +
    `C ${cx - HW * 0.55} ${Y_BASE}, ${cx - HW * 0.35} ${Y_PEAK}, ${cx} ${Y_PEAK} ` +
    `C ${cx + HW * 0.35} ${Y_PEAK}, ${cx + HW * 0.55} ${Y_BASE}, ${cx + HW} ${Y_BASE} ` +
    `L ${w - R} ${Y_BASE} ` +
    `A ${R} ${R} 0 0 1 ${w - R} ${Y_BOTTOM} ` +
    `L ${R} ${Y_BOTTOM} ` +
    `A ${R} ${R} 0 0 1 ${R} ${Y_BASE} Z`
  );
}

function StandardTabButton({
  isFocused,
  label,
  activeIcon,
  inactiveIcon,
  onPress,
}: {
  isFocused: boolean;
  label: string;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, SpringConfigs.gentle);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SpringConfigs.gentle);
  };

  return (
    <Animated.View style={[styles.tabButtonWrapper, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={isFocused ? { selected: true } : {}}
        style={styles.tabButtonPressable}
      >
        <Ionicons
          name={isFocused ? activeIcon : inactiveIcon}
          size={22}
          color={isFocused ? NAV_PURPLE : NAV_INACTIVE}
        />
        <Text
          numberOfLines={1}
          style={[
            styles.tabButtonLabel,
            {
              color: isFocused ? NAV_PURPLE : NAV_INACTIVE,
              fontWeight: isFocused ? '600' : '500',
            },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function CenterCreateButton({
  isFocused,
  label,
  onPress,
}: {
  isFocused: boolean;
  label: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.90, SpringConfigs.gentle);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SpringConfigs.gentle);
  };

  return (
    <Animated.View style={[styles.tabButtonWrapper, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={isFocused ? { selected: true } : {}}
        style={styles.centerButtonPressable}
      >
        <View style={styles.centerCircle}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </View>
        <Text
          numberOfLines={1}
          style={[
            styles.tabButtonLabel,
            {
              color: isFocused ? NAV_PURPLE : NAV_INACTIVE,
              fontWeight: isFocused ? '600' : '500',
            },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function LiquidGlassTabBar({ state, descriptors: _descriptors, navigation }: LiquidGlassTabBarProps) {
  const insets = useSafeAreaInsets();
  const [containerWidth, setContainerWidth] = useState(() => {
    const screenW = Dimensions.get('window').width;
    return Math.min(screenW - 32, 440);
  });

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const w = Math.round(event.nativeEvent.layout.width);
      if (w > 0 && Math.abs(w - containerWidth) > 1) {
        setContainerWidth(w);
      }
    },
    [containerWidth]
  );

  const handleTabPress = useCallback(
    (route: any, isFocused: boolean) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    },
    [navigation]
  );

  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 14);
  const pathD = useMemo(() => getPathData(containerWidth), [containerWidth]);

  return (
    <View
      style={[styles.tabBarContainer, { bottom: bottomInset }]}
      pointerEvents="box-none"
    >
      <View
        style={[styles.tabBarInner, styles.shadowElevation]}
        onLayout={onLayout}
        pointerEvents="box-none"
      >
        {containerWidth > 0 && (
          <Svg
            width={containerWidth}
            height={TOTAL_H}
            viewBox={`0 0 ${containerWidth} ${TOTAL_H}`}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          >
            <Path
              d={pathD}
              fill="#FFFFFF"
              stroke="#E5E7EB"
              strokeWidth={1.2}
            />
          </Svg>
        )}

        <View style={styles.tabButtonsRow} pointerEvents="box-none">
          {state.routes.map((route: any, index: number) => {
            const isFocused = state.index === index;
            const config = TAB_CONFIGS[route.name] || {
              label: route.name,
              activeIcon: 'cube' as const,
              inactiveIcon: 'cube-outline' as const,
            };

            if (config.isCenter) {
              return (
                <CenterCreateButton
                  key={route.key}
                  isFocused={isFocused}
                  label={config.label}
                  onPress={() => handleTabPress(route, isFocused)}
                />
              );
            }

            return (
              <StandardTabButton
                key={route.key}
                isFocused={isFocused}
                label={config.label}
                activeIcon={config.activeIcon}
                inactiveIcon={config.inactiveIcon}
                onPress={() => handleTabPress(route, isFocused)}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    zIndex: 1000,
  },
  tabBarInner: {
    width: '100%',
    maxWidth: 440,
    height: TOTAL_H,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowElevation: {
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
      },
      android: {
        elevation: 8,
      },
      web: {
        filter: 'drop-shadow(0px 8px 24px rgba(0, 0, 0, 0.08))',
      },
    }),
  },
  tabButtonsRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
    paddingBottom: 11,
  },
  tabButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tabButtonPressable: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    paddingVertical: 2,
  },
  centerButtonPressable: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    paddingVertical: 2,
  },
  centerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: NAV_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    ...Platform.select({
      ios: {
        shadowColor: NAV_PURPLE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 12px rgba(74, 15, 58, 0.35)',
      },
    }),
  },
  tabButtonLabel: {
    fontSize: 11,
    marginTop: 3,
    letterSpacing: -0.2,
    textAlign: 'center',
  },
});
