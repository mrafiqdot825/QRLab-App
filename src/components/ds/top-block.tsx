import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BLOCK_RADIUS, C, HEADER_GAP } from '@/constants/design';

/** Extra black area above the block so iOS over-scroll never shows white. */
const OVERSCROLL = 600;

/**
 * The black block across the top of a screen. Place it as the first child of
 * the scroll content; it scrolls with the page. `below` is how far the block
 * reaches below the first header row.
 */
export const TopBlock = React.memo(function TopBlock({ below }: { below: number }) {
  const top = useHeaderTop();
  return (
    <View
      pointerEvents="none"
      style={[styles.block, { top: -OVERSCROLL, height: OVERSCROLL + top + below }]}
    />
  );
});

/** Black strip behind the status bar so light status text stays readable while scrolling. */
export const StatusScrim = React.memo(function StatusScrim() {
  const insets = useSafeAreaInsets();
  return <View pointerEvents="none" style={[styles.scrim, { height: insets.top }]} />;
});

/** Y position of the first header row on a screen. */
export function useHeaderTop() {
  const insets = useSafeAreaInsets();
  return insets.top + HEADER_GAP;
}

const styles = StyleSheet.create({
  block: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: C.brand,
    borderBottomLeftRadius: BLOCK_RADIUS,
    borderBottomRightRadius: BLOCK_RADIUS,
  },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: C.brand,
    zIndex: 10,
  },
});
