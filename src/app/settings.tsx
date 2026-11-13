import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/ds/app-text';
import { IconName, SectionLabel } from '@/components/ds/controls';
import { QrGlyph } from '@/components/ds/qr-glyph';
import { StatusScrim, TopBlock, useHeaderTop } from '@/components/ds/top-block';
import { APP_CONFIG } from '@/config/app.config';
import { C, PAD, SHADOW_CARD } from '@/constants/design';
import { Policy, PolicySheet } from '@/features/settings/components/policy-sheet';
import { haptic, setPreference, usePreferences } from '@/services/preferences';
import { DEVELOPER_SITE, openExternal, openSupportEmail } from '@/utils/links';

// React Native Web colours the active thumb teal unless told otherwise.
const WEB_SWITCH = Platform.OS === 'web' ? ({ activeThumbColor: C.white } as object) : {};

function RowIcon({ name }: { name: IconName }) {
  return (
    <View style={styles.rowIcon}>
      <Ionicons name={name} size={18} color={C.brand} />
    </View>
  );
}

function RowText({ title, sub }: { title: string; sub?: string }) {
  return (
    <View style={styles.rowText}>
      <AppText weight="semibold" size={15}>
        {title}
      </AppText>
      {sub ? (
        <AppText size={12.5} color={C.muted} numberOfLines={1}>
          {sub}
        </AppText>
      ) : null}
    </View>
  );
}

function ToggleRow({
  icon,
  title,
  sub,
  value,
  onChange,
  first,
}: {
  icon: IconName;
  title: string;
  sub: string;
  value: boolean;
  onChange: (v: boolean) => void;
  first?: boolean;
}) {
  return (
    <View style={[styles.row, !first && styles.rowDivider]}>
      <RowIcon name={icon} />
      <RowText title={title} sub={sub} />
      <Switch
        value={value}
        onValueChange={onChange}
        accessibilityLabel={title}
        trackColor={{ false: C.switchOff, true: C.brand }}
        thumbColor={C.white}
        ios_backgroundColor={C.switchOff}
        {...WEB_SWITCH}
      />
    </View>
  );
}

function LinkRow({
  icon,
  title,
  sub,
  external,
  onPress,
  first,
}: {
  icon: IconName;
  title: string;
  sub?: string;
  external?: boolean;
  onPress: () => void;
  first?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={external ? 'link' : 'button'}
      accessibilityLabel={sub ? `${title}, ${sub}` : title}
      style={({ pressed }) => [styles.row, !first && styles.rowDivider, pressed && styles.pressed]}>
      <RowIcon name={icon} />
      <RowText title={title} sub={sub} />
      <Ionicons
        name={external ? 'open-outline' : 'chevron-forward'}
        size={external ? 17 : 18}
        color={C.inactive}
      />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const headerTop = useHeaderTop();
  const prefs = usePreferences();
  const [policy, setPolicy] = useState<Policy | null>(null);

  const toggleHaptics = useCallback((v: boolean) => {
    setPreference('haptics', v);
    if (v) haptic('light');
  }, []);
  const toggleHd = useCallback((v: boolean) => {
    haptic('light');
    setPreference('hdExport', v);
  }, []);
  const closePolicy = useCallback(() => setPolicy(null), []);

  return (
    <View style={styles.screen}>
      <StatusScrim />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: headerTop }]}
        showsVerticalScrollIndicator={false}>
        <TopBlock below={102} />

        <View style={styles.header}>
          <AppText weight="bold" size={26} color={C.white} tracking={-0.8} accessibilityRole="header">
            Settings
          </AppText>
        </View>

        <View
          style={styles.about}
          accessible
          accessibilityLabel={`QRLab, version ${APP_CONFIG.version}. Private, works offline.`}>
          <View style={styles.appIcon}>
            <QrGlyph size={24} color={C.white} />
          </View>
          <View style={styles.rowText}>
            <AppText weight="bold" size={17} tracking={-0.3}>
              {APP_CONFIG.name}
            </AppText>
            <AppText size={13} color={C.muted}>
              Version {APP_CONFIG.version}
            </AppText>
          </View>
          <View style={styles.private}>
            <Ionicons name="lock-closed" size={11} color={C.okText} />
            <AppText weight="bold" size={12} color={C.okText}>
              Private
            </AppText>
          </View>
        </View>

        <SectionLabel style={styles.label}>Preferences</SectionLabel>
        <View style={styles.group}>
          <ToggleRow
            first
            icon="phone-portrait-outline"
            title="Haptic feedback"
            sub="Light vibration on taps"
            value={prefs.haptics}
            onChange={toggleHaptics}
          />
          <ToggleRow
            icon="image-outline"
            title="High-resolution export"
            sub={prefs.hdExport ? 'PNG at 2048 px' : 'PNG at 1024 px'}
            value={prefs.hdExport}
            onChange={toggleHd}
          />
        </View>

        <SectionLabel style={styles.label}>Support</SectionLabel>
        <View style={styles.group}>
          <LinkRow
            first
            icon="mail-outline"
            title="Email support"
            sub="Get help or send feedback"
            onPress={openSupportEmail}
          />
          <LinkRow
            icon="globe-outline"
            title="Developer website"
            sub={DEVELOPER_SITE.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            external
            onPress={() => openExternal(DEVELOPER_SITE, 'Developer site')}
          />
        </View>

        <SectionLabel style={styles.label}>Legal</SectionLabel>
        <View style={styles.group}>
          <LinkRow
            first
            icon="shield-checkmark-outline"
            title="Privacy policy"
            onPress={() => setPolicy('privacy')}
          />
          <LinkRow icon="document-text-outline" title="Terms of service" onPress={() => setPolicy('terms')} />
          <LinkRow
            icon="code-slash-outline"
            title="Open-source licences"
            onPress={() => setPolicy('licenses')}
          />
        </View>

        <AppText size={12.5} color={C.muted} align="center" style={styles.footer}>
          Everything stays on this device
        </AppText>
      </ScrollView>

      <PolicySheet policy={policy} onClose={closePolicy} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.white,
  },
  content: {
    paddingHorizontal: PAD,
    paddingBottom: 28,
  },
  header: {
    height: 44,
    justifyContent: 'center',
  },
  about: {
    marginTop: 20,
    height: 76,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    boxShadow: SHADOW_CARD,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: C.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  private: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: C.okBg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  label: {
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 4,
  },
  group: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    backgroundColor: C.white,
    overflow: 'hidden',
  },
  row: {
    minHeight: 58,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: C.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  footer: {
    marginTop: 24,
  },
  pressed: {
    opacity: 0.7,
  },
});
