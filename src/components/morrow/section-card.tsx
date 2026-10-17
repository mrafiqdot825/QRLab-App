import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/theme';

interface SectionCardProps {
  title?: string;
  actionText?: string;
  onPressAction?: () => void;
  showChevron?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const SectionCard = React.memo(function SectionCard({
  title,
  actionText,
  onPressAction,
  showChevron = false,
  children,
  className = '',
}: SectionCardProps) {
  const handleAction = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    if (onPressAction) onPressAction();
  };

  return (
    <View style={styles.card} className={`w-full rounded-[26px] p-5 my-2.5 ${className}`}>
      {/* Header Row */}
      {title && (
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-ink text-[17px] font-semibold tracking-tight">
            {title}
          </Text>

          {onPressAction && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={actionText || 'View details'}
              onPress={handleAction}
              className="flex-row items-center gap-1 active:opacity-70"
            >
              {actionText && (
                <Text className="text-ink-muted text-xs font-medium">
                  {actionText}
                </Text>
              )}
              {showChevron && (
                <View style={styles.chevronCircle}>
                  <Ionicons name="chevron-forward" size={14} color={Palette.ink} />
                </View>
              )}
            </Pressable>
          )}
        </View>
      )}

      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(74, 15, 58, 0.05)',
    boxShadow: '0px 8px 24px rgba(74, 15, 58, 0.05)',
  },
  chevronCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FDF6F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 15, 58, 0.06)',
  },
});

