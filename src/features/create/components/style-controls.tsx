import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';

import { AppText } from '@/components/ds/app-text';
import type { IconName } from '@/components/ds/controls';
import { QrGlyph } from '@/components/ds/qr-glyph';
import { C, QR_COLORS } from '@/constants/design';
import { haptic } from '@/services/preferences';
import { CustomizationOptions, EyeStyle, LogoPreset, ModuleShape } from '@/types/qr';

/* ---------------------------------- glyphs --------------------------------- */

function ShapeGlyph({ shape, color }: { shape: ModuleShape; color: string }) {
  const cells = [
    [1, 1],
    [9, 1],
    [1, 9],
    [9, 9],
  ];
  return (
    <Svg width={14} height={14} viewBox="0 0 16 16">
      {cells.map(([x, y]) =>
        shape === 'dots' ? (
          <Circle key={`${x}${y}`} cx={x + 3} cy={y + 3} r={3} fill={color} />
        ) : (
          <Rect
            key={`${x}${y}`}
            x={x}
            y={y}
            width={6}
            height={6}
            rx={shape === 'rounded' ? 2 : 0}
            fill={color}
          />
        )
      )}
    </Svg>
  );
}

function EyeGlyph({ eye, color }: { eye: EyeStyle; color: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 16 16">
      {eye === 'circle' ? (
        <>
          <Circle cx={8} cy={8} r={6.5} stroke={color} strokeWidth={1.6} fill="none" />
          <Circle cx={8} cy={8} r={3} fill={color} />
        </>
      ) : (
        <>
          <Rect
            x={1.5}
            y={1.5}
            width={13}
            height={13}
            rx={eye === 'rounded' ? 4 : 0}
            stroke={color}
            strokeWidth={1.6}
            fill="none"
          />
          <Rect x={5} y={5} width={6} height={6} rx={eye === 'rounded' ? 1.8 : 0} fill={color} />
        </>
      )}
    </Svg>
  );
}

/* --------------------------------- options --------------------------------- */

const SHAPES: { value: ModuleShape; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'dots', label: 'Dots' },
];

const EYES: { value: EyeStyle; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'circle', label: 'Circle' },
];

const LOGOS: { value: LogoPreset; label: string; icon?: IconName }[] = [
  { value: 'none', label: 'No logo', icon: 'ban-outline' },
  { value: 'qrlab', label: 'QRLab logo' },
  { value: 'star', label: 'Star', icon: 'star-outline' },
  { value: 'heart', label: 'Heart', icon: 'heart-outline' },
  { value: 'shield', label: 'Shield', icon: 'shield-outline' },
];

/* -------------------------------- primitives ------------------------------- */

const OptionChip = React.memo(function OptionChip({
  label,
  selected,
  onPress,
  children,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.chipOn : styles.chipOff,
        pressed && styles.pressed,
      ]}>
      {children}
      <AppText weight={selected ? 'bold' : 'semibold'} size={13} color={selected ? C.ink : C.strong}>
        {label}
      </AppText>
    </Pressable>
  );
});

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <AppText weight="semibold" size={13} color={C.muted} style={styles.rowLabel}>
        {label}
      </AppText>
      <View style={styles.rowBody} accessibilityRole="radiogroup" accessibilityLabel={label}>
        {children}
      </View>
    </View>
  );
}

/* ---------------------------------- panel ---------------------------------- */

export const StyleControls = React.memo(function StyleControls({
  options,
  onChange,
}: {
  options: CustomizationOptions;
  onChange: React.Dispatch<React.SetStateAction<CustomizationOptions>>;
}) {
  const set = useCallback(
    <K extends keyof CustomizationOptions>(key: K, value: CustomizationOptions[K]) => {
      haptic('light');
      onChange((prev) => ({ ...prev, [key]: value }));
    },
    [onChange]
  );

  const logo = options.logo === 'qrstudio' ? 'qrlab' : options.logo;

  return (
    <View style={styles.panel}>
      <AppText weight="bold" size={16} tracking={-0.3} accessibilityRole="header">
        Style
      </AppText>

      <Row label="Shape">
        {SHAPES.map((s) => {
          const on = options.moduleShape === s.value;
          return (
            <OptionChip
              key={s.value}
              label={s.label}
              selected={on}
              onPress={() => set('moduleShape', s.value)}>
              <ShapeGlyph shape={s.value} color={on ? C.ink : C.strong} />
            </OptionChip>
          );
        })}
      </Row>

      <Row label="Eyes">
        {EYES.map((e) => {
          const on = options.eyeStyle === e.value;
          return (
            <OptionChip key={e.value} label={e.label} selected={on} onPress={() => set('eyeStyle', e.value)}>
              <EyeGlyph eye={e.value} color={on ? C.ink : C.strong} />
            </OptionChip>
          );
        })}
      </Row>

      <Row label="Logo">
        <View style={styles.logoRow}>
          {LOGOS.map((l) => {
            const on = logo === l.value;
            const color = on ? C.ink : C.strong;
            return (
              <Pressable
                key={l.value}
                onPress={() => set('logo', l.value)}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                accessibilityLabel={l.label}
                style={({ pressed }) => [
                  styles.logoTile,
                  on ? styles.chipOn : styles.chipOff,
                  pressed && styles.pressed,
                ]}>
                {l.icon ? (
                  <Ionicons name={l.icon} size={19} color={color} />
                ) : (
                  <QrGlyph size={18} color={color} />
                )}
              </Pressable>
            );
          })}
        </View>
      </Row>

      <View style={styles.colourBlock}>
        <AppText weight="semibold" size={13} color={C.muted}>
          Colour
        </AppText>
        <View style={styles.swatches} accessibilityRole="radiogroup" accessibilityLabel="Colour">
          {QR_COLORS.map((c) => {
            const hex = c.value;
            const on = (options.fgColor ?? QR_COLORS[0].value).toLowerCase() === hex.toLowerCase();
            return (
              <Pressable
                key={c.id}
                onPress={() => set('fgColor', hex)}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                accessibilityLabel={c.label}
                style={({ pressed }) => [styles.swatchHit, pressed && styles.pressed]}>
                <View style={[styles.swatch, { backgroundColor: hex }, on && styles.swatchOn]}>
                  {on ? <Ionicons name="checkmark" size={15} color={C.white} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  panel: {
    marginTop: 24,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    width: 52,
  },
  rowBody: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  chipOn: {
    borderWidth: 1.5,
    borderColor: C.brand,
    backgroundColor: C.tint,
  },
  chipOff: {
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  logoRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoTile: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colourBlock: {
    marginTop: 4,
    gap: 6,
  },
  swatches: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  swatchHit: {
    width: 42,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchOn: {
    boxShadow: `0px 0px 0px 2px ${C.white}, 0px 0px 0px 4px ${C.brand}`,
  },
  pressed: {
    opacity: 0.7,
  },
});
