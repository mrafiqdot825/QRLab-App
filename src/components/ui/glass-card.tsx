import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, Pressable, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Palette, SpringConfigs } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  interactive?: boolean;
  glassTint?: 'dark' | 'light' | 'default' | 'extraLight';
  hasGlow?: boolean;
  glowColor?: string;
  isInteractive?: boolean;
}

interface InteractiveGlassCardProps extends GlassCardProps {
  containerStyle: any;
  outerLayoutStyle?: ViewStyle;
  colors: any;
  resolvedInteractive: boolean;
}

const InteractiveGlassCard = React.memo(function InteractiveGlassCard({
  children,
  className = '',
  onPress,
  containerStyle,
  outerLayoutStyle,
  style: _style,
  ...props
}: InteractiveGlassCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, SpringConfigs.gentle);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SpringConfigs.gentle);
  };

  const handlePress = () => {
    if (onPress) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      onPress();
    }
  };

  return (
    <Animated.View style={[animatedStyle, outerLayoutStyle]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.cardShadow, containerStyle]}
        className={`rounded-[26px] overflow-hidden relative ${className}`}
        {...props}>
        {children}
      </Pressable>
    </Animated.View>
  );
});

export const GlassCard = React.memo(function GlassCard({
  children,
  className = '',
  onPress,
  interactive = false,
  glassTint: _glassTint = 'light',
  hasGlow: _hasGlow = false,
  glowColor: _glowColor = Palette.accent,
  isInteractive,
  style,
  ...props
}: GlassCardProps) {
  const { colors } = useTheme();

  const containerStyle = React.useMemo(
    () => [{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }, style],
    [colors.surface, colors.border, style]
  );

  const outerLayoutStyle = React.useMemo((): ViewStyle | undefined => {
    if (!style) return undefined;
    const flat = (StyleSheet.flatten(style) ?? {}) as ViewStyle;
    const { flexBasis, flexGrow, flexShrink, width, minWidth, maxWidth } = flat;
    if (
      flexBasis === undefined &&
      flexGrow === undefined &&
      flexShrink === undefined &&
      width === undefined &&
      minWidth === undefined &&
      maxWidth === undefined
    ) {
      return undefined;
    }
    return { flexBasis, flexGrow, flexShrink, width, minWidth, maxWidth };
  }, [style]);

  const resolvedInteractive = isInteractive ?? (interactive || !!onPress);

  if (onPress || interactive) {
    return (
      <InteractiveGlassCard
        className={className}
        onPress={onPress}
        containerStyle={containerStyle}
        outerLayoutStyle={outerLayoutStyle}
        colors={colors}
        resolvedInteractive={resolvedInteractive}
        style={style}
        {...props}>
        {children}
      </InteractiveGlassCard>
    );
  }

  return (
    <View
      style={[styles.cardShadow, containerStyle]}
      className={`rounded-[26px] overflow-hidden relative ${className}`}
      {...props}>
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#4A0F3A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 8px 24px rgba(74, 15, 58, 0.05)',
      },
    }),
  },
});

