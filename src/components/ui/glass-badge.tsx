import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { withAlpha } from '@/utils/color';

interface GlassBadgeProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  className?: string;
}

export const GlassBadge = React.memo(function GlassBadge({
  label,
  icon,
  variant = 'primary',
  className = '',
}: GlassBadgeProps) {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';
  const isSuccess = variant === 'success';
  const isWarning = variant === 'warning';

  const badgeConfig = isPrimary
    ? { text: '#4A0F3A', bg: 'rgba(74, 15, 58, 0.08)', border: 'rgba(74, 15, 58, 0.18)' }
    : isSuccess
    ? { text: '#1B3B2B', bg: '#E4ECE0', border: 'rgba(143, 166, 127, 0.35)' }
    : isWarning
    ? { text: '#5C3805', bg: '#FDF4D4', border: 'rgba(251, 233, 168, 0.6)' }
    : { text: '#6B6468', bg: '#FDF6F2', border: 'rgba(74, 15, 58, 0.08)' };

  return (
    <View
      style={{ backgroundColor: badgeConfig.bg, borderColor: badgeConfig.border }}
      className={`self-start flex-row items-center gap-1.5 px-3 py-1 rounded-full border overflow-hidden relative ${className}`}>
      {icon && <Ionicons name={icon} size={12} color={badgeConfig.text} />}

      <Text className="font-bold text-[10px] tracking-wider uppercase" style={{ color: badgeConfig.text }}>
        {label}
      </Text>
    </View>
  );
});
