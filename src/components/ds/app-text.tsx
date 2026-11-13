import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import { C, FONT, FontWeight } from '@/constants/design';

export interface AppTextProps extends TextProps {
  weight?: FontWeight;
  size?: number;
  color?: string;
  /** Tight tracking for headings, in px. */
  tracking?: number;
  lineHeight?: number;
  align?: 'left' | 'center' | 'right';
}

/**
 * The only text component used by the UI. Custom fonts on Android do not
 * synthesise weights, so the weight is picked by font family, never fontWeight.
 */
export const AppText = React.memo(function AppText({
  weight = 'regular',
  size = 15,
  color = C.ink,
  tracking,
  lineHeight,
  align,
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text
      {...rest}
      style={[
        styles.base,
        {
          fontFamily: FONT[weight],
          fontSize: size,
          color,
          letterSpacing: tracking,
          lineHeight,
          textAlign: align,
        },
        style,
      ]}
    />
  );
});

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
