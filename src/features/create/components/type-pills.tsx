import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Pill } from '@/components/ds/controls';
import { PAD } from '@/constants/design';
import { QR_TYPES } from '@/constants/qr-types';
import { QRType } from '@/types/qr';

/** Horizontal type selector on the black block. Keeps the selected pill in view. */
export const TypePills = React.memo(function TypePills({
  value,
  onChange,
}: {
  value: QRType;
  onChange: (type: QRType) => void;
}) {
  const scrollRef = useRef<ScrollView>(null);
  const offsets = useRef<Partial<Record<QRType, number>>>({});

  useEffect(() => {
    const x = offsets.current[value];
    if (x !== undefined) {
      scrollRef.current?.scrollTo({ x: Math.max(0, x - PAD), animated: true });
    }
  }, [value]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityRole="tablist"
      accessibilityLabel="Code type"
      style={styles.scroll}
      contentContainerStyle={styles.content}>
      {QR_TYPES.map((t) => (
        <View
          key={t.id}
          onLayout={(e) => {
            offsets.current[t.id] = e.nativeEvent.layout.x;
          }}>
          <Pill label={t.label} tone="block" selected={value === t.id} onPress={() => onChange(t.id)} />
        </View>
      ))}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scroll: {
    marginTop: 14,
    marginHorizontal: -PAD,
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: PAD,
    gap: 8,
  },
});
