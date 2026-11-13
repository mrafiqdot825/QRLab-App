import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ds/app-text';
import { Sheet } from '@/components/ds/sheet';
import { C } from '@/constants/design';

export type Policy = 'privacy' | 'terms' | 'licenses';

const TITLES: Record<Policy, string> = {
  privacy: 'Privacy policy',
  terms: 'Terms of service',
  licenses: 'Open-source licences',
};

function Section({ title, children }: { title: string; children: string }) {
  return (
    <View style={styles.section}>
      <AppText weight="bold" size={15} accessibilityRole="header">
        {title}
      </AppText>
      <AppText size={14} lineHeight={21} color={C.strong}>
        {children}
      </AppText>
    </View>
  );
}

const LICENSES = [
  'Expo SDK 57 (MIT License)',
  'React Native 0.86 (MIT License)',
  'React Native Reanimated 4 (MIT License)',
  'React Native SVG & QRCode (MIT License)',
  'Expo Vector Icons & Ionicons (MIT License)',
  'Onest typeface (SIL Open Font License)',
];

export function PolicySheet({ policy, onClose }: { policy: Policy | null; onClose: () => void }) {
  return (
    <Sheet visible={!!policy} onClose={onClose} title={policy ? TITLES[policy] : ''} scroll>
      {policy === 'privacy' ? (
        <>
          <Section title="No cloud data collection">
            QRLab works entirely on your device. Your QR codes, payloads, Wi‑Fi keys and contact cards stay on
            your phone. We do not track, collect or send your data to any server.
          </Section>
          <Section title="Camera and flash">
            Camera access is only used to scan physical QR codes. No video or images leave your device.
          </Section>
          <Section title="Analytics">
            QRLab has no third-party tracking, advertising IDs or behavioural analytics.
          </Section>
        </>
      ) : null}

      {policy === 'terms' ? (
        <>
          <Section title="Your codes are yours">
            Every QR code you make in QRLab, including SVG, PNG and PDF exports, belongs to you. Use them for
            personal, educational or commercial work.
          </Section>
          <Section title="Check before you print">
            QRLab encodes exactly what you type. Please check details such as Wi‑Fi passwords and payment
            links before printing large runs.
          </Section>
        </>
      ) : null}

      {policy === 'licenses' ? (
        <View style={styles.section}>
          <AppText size={14} lineHeight={21} color={C.strong}>
            QRLab is built with these open-source projects:
          </AppText>
          <View style={styles.licenses}>
            {LICENSES.map((l) => (
              <AppText key={l} weight="medium" size={14}>
                {l}
              </AppText>
            ))}
          </View>
        </View>
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
    gap: 6,
  },
  licenses: {
    marginTop: 6,
    padding: 14,
    borderRadius: 14,
    backgroundColor: C.soft,
    gap: 8,
  },
});
