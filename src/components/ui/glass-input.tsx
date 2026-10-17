import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Palette, SpringConfigs } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface GlassInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onClear?: () => void;
  className?: string;
  style?: any;
}

export function GlassInput({
  label,
  icon,
  onClear,
  value,
  onChangeText,
  placeholder,
  className = '',
  style,
  ...props
}: GlassInputProps) {
  const { colors, shadows } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const focusProgress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: focusProgress.value === 1 ? 'rgba(74, 15, 58, 0.35)' : 'rgba(74, 15, 58, 0.08)',
      borderWidth: 1.5,
      boxShadow: focusProgress.value === 1 ? '0px 0px 0px 3px rgba(74, 15, 58, 0.12)' : '0px 4px 16px rgba(74, 15, 58, 0.04)',
    };
  });

  const handleFocus = () => {
    setIsFocused(true);
    focusProgress.value = withSpring(1, SpringConfigs.gentle);
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync().catch(() => {});
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusProgress.value = withSpring(0, SpringConfigs.gentle);
  };

  return (
    <View className={`w-full gap-1.5 ${className}`}>
      {label ? (
        <Text className="text-ink-muted text-xs font-semibold px-1 tracking-wider uppercase">
          {label}
        </Text>
      ) : null}

      <Animated.View
        style={[{ backgroundColor: '#FFFFFF' }, animatedStyle, style]}
        className="flex-row items-center px-4 py-3 rounded-[18px] overflow-hidden relative gap-2.5">
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={isFocused ? '#4A0F3A' : Palette.inkMuted}
          />
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Palette.inkMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="flex-1 text-ink text-base py-0"
          style={{ color: '#1A1416' }}
          {...props}
        />

        {value && onClear ? (
          <Pressable
            accessibilityLabel="Clear input"
            accessibilityRole="button"
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              }
              onClear();
            }}
            className="w-6 h-6 rounded-full items-center justify-center bg-black/5 dark:bg-white/10 active:opacity-60">
            <Ionicons name="close-circle" size={16} color={colors.secondaryText} />
          </Pressable>
        ) : null}
      </Animated.View>
    </View>
  );
}
