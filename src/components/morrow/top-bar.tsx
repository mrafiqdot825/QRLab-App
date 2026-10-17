import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/theme';
import { Typography } from '@/constants/theme/typography';

interface TopBarProps {
  title?: string;
  onPressAction?: () => void;
  actionIcon?: keyof typeof Ionicons.glyphMap;
  accessibilityLabel?: string;
  showSearch?: boolean;
  onPressSearch?: () => void;
  className?: string;
}

export const TopBar = React.memo(function TopBar({
  title = 'QRLab',
  onPressAction,
  actionIcon = 'person-outline',
  accessibilityLabel = 'Open Profile',
  showSearch = false,
  onPressSearch,
  className = '',
}: TopBarProps) {
  const handleAction = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    if (onPressAction) onPressAction();
  };

  const handleSearch = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    if (onPressSearch) onPressSearch();
  };

  return (
    <View className={`w-full flex-row items-center justify-between py-2.5 px-1 ${className}`}>
      {/* Serif Wordmark */}
      <Text
        style={[styles.wordmark, { fontFamily: Typography.serifFamily }]}
        className="text-[26px] font-bold tracking-tight text-ink"
      >
        {title}
      </Text>

      {/* Right Circular Icon Button(s) */}
      <View className="flex-row items-center gap-2">
        {showSearch && onPressSearch && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Search"
            onPress={handleSearch}
            style={styles.circleButton}
            className="w-10 h-10 rounded-full items-center justify-center active:scale-95"
          >
            <Ionicons name="search-outline" size={19} color={Palette.ink} />
          </Pressable>
        )}

        {onPressAction && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            onPress={handleAction}
            style={styles.circleButton}
            className="w-10 h-10 rounded-full items-center justify-center active:scale-95"
          >
            <Ionicons name={actionIcon} size={19} color={Palette.ink} />
          </Pressable>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wordmark: {
    letterSpacing: -0.5,
  },
  circleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(74, 15, 58, 0.08)',
    boxShadow: '0px 2px 8px rgba(74, 15, 58, 0.05)',
  },
});

