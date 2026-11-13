import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { AppText } from '@/components/ds/app-text';
import { C } from '@/constants/design';

export type IconName = keyof typeof Ionicons.glyphMap;

const pressedStyle = { opacity: 0.7 };

/* -------------------------------------------------------------------------- */
/* Pill — type selectors and category filters                                 */
/* -------------------------------------------------------------------------- */

interface PillProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** `block` sits on the black block, `light` on white. */
  tone?: 'block' | 'light';
  role?: 'tab' | 'button';
}

export const Pill = React.memo(function Pill({
  label,
  selected,
  onPress,
  tone = 'light',
  role = 'tab',
}: PillProps) {
  const palette =
    tone === 'block'
      ? selected
        ? { bg: C.white, fg: C.brand }
        : { bg: C.onBlockFill, fg: C.onBlock }
      : selected
        ? { bg: C.brand, fg: C.white }
        : { bg: C.soft, fg: C.strong };

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={role}
      accessibilityState={{ selected }}
      style={({ pressed }) => [styles.pill, { backgroundColor: palette.bg }, pressed && pressedStyle]}>
      <AppText weight={selected ? 'bold' : 'semibold'} size={14} color={palette.fg}>
        {label}
      </AppText>
    </Pressable>
  );
});

/* -------------------------------------------------------------------------- */
/* Button                                                                     */
/* -------------------------------------------------------------------------- */

interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  title: string;
  icon?: IconName;
  variant?: 'primary' | 'secondary' | 'white';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Button = React.memo(function Button({
  title,
  icon,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const fg = variant === 'primary' ? C.white : C.ink;
  const bg = variant === 'primary' ? C.brand : variant === 'white' ? C.white : C.soft;
  const dims = SIZES[size];

  return (
    <Pressable
      {...rest}
      disabled={disabled || loading}
      accessibilityLabel={rest.accessibilityLabel ?? title}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!(disabled || loading), busy: !!loading }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, height: dims.height, borderRadius: dims.radius, paddingHorizontal: dims.padX },
        pressed && pressedStyle,
        (disabled || loading) && styles.dimmed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator size="small" color={fg} />
      ) : icon ? (
        <Ionicons name={icon} size={dims.icon} color={fg} />
      ) : null}
      <AppText weight="bold" size={dims.font} color={fg}>
        {title}
      </AppText>
    </Pressable>
  );
});

const SIZES = {
  sm: { height: 40, radius: 12, padX: 14, font: 14, icon: 16 },
  md: { height: 48, radius: 14, padX: 16, font: 15, icon: 18 },
  lg: { height: 52, radius: 16, padX: 18, font: 15, icon: 18 },
} as const;

/* -------------------------------------------------------------------------- */
/* IconButton                                                                 */
/* -------------------------------------------------------------------------- */

interface IconButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  icon: IconName;
  label: string;
  variant?: 'block' | 'soft' | 'plain' | 'square';
  size?: number;
  iconSize?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const IconButton = React.memo(function IconButton({
  icon,
  label,
  variant = 'soft',
  size = 44,
  iconSize = 20,
  color,
  style,
  ...rest
}: IconButtonProps) {
  const bg = variant === 'block' ? C.onBlockFill : variant === 'plain' ? 'transparent' : C.soft;
  const fg = color ?? (variant === 'block' ? C.onBlock : C.ink);
  const radius = variant === 'square' ? 14 : size / 2;

  return (
    <Pressable
      {...rest}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={size < 44 ? (44 - size) / 2 : undefined}
      style={({ pressed }) => [
        styles.iconButton,
        { width: size, height: size, borderRadius: radius, backgroundColor: bg },
        pressed && pressedStyle,
        style,
      ]}>
      <Ionicons name={icon} size={iconSize} color={fg} />
    </Pressable>
  );
});

/* -------------------------------------------------------------------------- */
/* Status pill                                                                */
/* -------------------------------------------------------------------------- */

export const StatusPill = React.memo(function StatusPill({
  label,
  tone = 'ok',
}: {
  label: string;
  tone?: 'ok' | 'muted';
}) {
  const ok = tone === 'ok';
  return (
    <View style={[styles.status, { backgroundColor: ok ? C.okBg : C.soft }]}>
      <View style={[styles.statusDot, { backgroundColor: ok ? C.okDot : C.inactive }]} />
      <AppText weight="bold" size={12} color={ok ? C.okText : C.strong}>
        {label}
      </AppText>
    </View>
  );
});

/* -------------------------------------------------------------------------- */
/* Section label                                                              */
/* -------------------------------------------------------------------------- */

export const SectionLabel = React.memo(function SectionLabel({
  children,
  style,
}: {
  children: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={style}>
      <AppText weight="semibold" size={13} color={C.muted} accessibilityRole="header">
        {children}
      </AppText>
    </View>
  );
});

const styles = StyleSheet.create({
  pill: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dimmed: {
    opacity: 0.6,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
