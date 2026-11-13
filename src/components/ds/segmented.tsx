import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ds/app-text';
import { C } from '@/constants/design';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  badge?: string | number;
}

interface SegmentedProps<T extends string> {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** `block` sits on the black block, `light` on white. */
  tone?: 'block' | 'light';
  accessibilityLabel?: string;
}

function SegmentedInner<T extends string>({
  options,
  value,
  onChange,
  tone = 'light',
  accessibilityLabel,
}: SegmentedProps<T>) {
  const onBlock = tone === 'block';
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={[styles.track, { backgroundColor: onBlock ? C.onBlockFillSubtle : C.soft }]}>
      {options.map((opt) => {
        const selected = opt.value === value;
        const fg = selected ? C.ink : onBlock ? 'rgba(255,255,255,0.86)' : C.strong;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            style={[styles.segment, selected && styles.segmentOn]}>
            <AppText weight={selected ? 'bold' : 'semibold'} size={14} color={fg}>
              {opt.label}
            </AppText>
            {opt.badge !== undefined ? (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: selected ? C.tint : onBlock ? 'rgba(255,255,255,0.18)' : C.white,
                  },
                ]}>
                <AppText weight="bold" size={12} color={selected ? C.ink : onBlock ? C.white : C.strong}>
                  {String(opt.badge)}
                </AppText>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

export const Segmented = React.memo(SegmentedInner) as typeof SegmentedInner;

const styles = StyleSheet.create({
  track: {
    height: 44,
    padding: 4,
    borderRadius: 13,
    flexDirection: 'row',
    gap: 4,
  },
  segment: {
    flex: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  segmentOn: {
    backgroundColor: C.white,
    boxShadow: '0px 1px 3px rgba(0,0,0,0.12)',
  },
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
