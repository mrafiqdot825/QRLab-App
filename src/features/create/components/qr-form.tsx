import * as Clipboard from 'expo-clipboard';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ds/app-text';
import { Button, IconButton } from '@/components/ds/controls';
import { Field } from '@/components/ds/field';
import { Segmented } from '@/components/ds/segmented';
import { PlainTextEditorModal } from '@/components/plain-text-editor-modal';
import { C } from '@/constants/design';
import { useQRGenerator } from '@/hooks/use-qr-generator';
import { haptic } from '@/services/preferences';
import { QRType } from '@/types/qr';
import { openInDefaultTextEditor } from '@/utils/qr-exporter';

type FormFields = ReturnType<typeof useQRGenerator>['formFields'];
type WifiEnc = FormFields['wifiEnc'];

const WIFI_SECURITY = [
  { value: 'WPA', label: 'WPA' },
  { value: 'WEP', label: 'WEP' },
  { value: 'nopass', label: 'None' },
] as const satisfies readonly { value: WifiEnc; label: string }[];

const PasteChip = React.memo(function PasteChip({ onPaste }: { onPaste: (text: string) => void }) {
  const handlePress = useCallback(async () => {
    try {
      const text = (await Clipboard.getStringAsync()).trim();
      if (text) {
        haptic('light');
        onPaste(text);
      }
    } catch {
      // Clipboard unavailable; nothing to paste.
    }
  }, [onPaste]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="Paste from clipboard"
      style={({ pressed }) => [styles.chip, pressed && styles.pressed]}>
      <AppText weight="semibold" size={13}>
        Paste
      </AppText>
    </Pressable>
  );
});

/** Input fields for the selected code type. */
export const QRForm = React.memo(function QRForm({ type, fields }: { type: QRType; fields: FormFields }) {
  const [showPassword, setShowPassword] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  const openEditor = useCallback(() => {
    haptic('medium');
    setEditorOpen(true);
  }, []);
  const closeEditor = useCallback(() => setEditorOpen(false), []);
  const openPhoneEditor = useCallback(() => {
    haptic('light');
    openInDefaultTextEditor(fields.text);
  }, [fields.text]);

  switch (type) {
    case 'url':
      return (
        <View style={styles.form}>
          <Field
            label="Website URL"
            icon="link-outline"
            value={fields.url}
            onChangeText={fields.setUrl}
            placeholder="https://yourwebsite.com"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            trailing={<PasteChip onPaste={fields.setUrl} />}
          />
        </View>
      );

    case 'text':
      return (
        <View style={styles.form}>
          <Field
            label="Message"
            icon="text-outline"
            value={fields.text}
            onChangeText={fields.setText}
            placeholder="Type a note, instructions or any text"
            multiline
          />
          <View style={styles.textTools}>
            <AppText size={12.5} color={C.muted} style={styles.flex}>
              {fields.text.length} characters
            </AppText>
            <Button
              title="Open in editor"
              icon="open-outline"
              size="sm"
              variant="secondary"
              onPress={openPhoneEditor}
            />
            <IconButton
              icon="expand-outline"
              label="Expand text editor"
              size={40}
              iconSize={18}
              onPress={openEditor}
            />
          </View>
          <PlainTextEditorModal
            visible={editorOpen}
            onClose={closeEditor}
            value={fields.text}
            onChangeValue={fields.setText}
          />
        </View>
      );

    case 'wifi':
      return (
        <View style={styles.form}>
          <Field
            label="Network name"
            icon="wifi-outline"
            value={fields.wifiSSID}
            onChangeText={fields.setWifiSSID}
            placeholder="e.g. Office_Guest_5G"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Field
            label="Password"
            icon="lock-closed-outline"
            value={fields.wifiPass}
            onChangeText={fields.setWifiPass}
            placeholder="Wi‑Fi password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            trailing={
              <IconButton
                icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                label={showPassword ? 'Hide password' : 'Show password'}
                variant="plain"
                iconSize={19}
                color={C.strong}
                onPress={() => setShowPassword((v) => !v)}
              />
            }
          />
          <View style={styles.inlineRow}>
            <AppText weight="semibold" size={13} color={C.muted} style={styles.inlineLabel}>
              Security
            </AppText>
            <View style={styles.flex}>
              <Segmented
                options={WIFI_SECURITY}
                value={fields.wifiEnc}
                onChange={fields.setWifiEnc}
                accessibilityLabel="Wi-Fi security"
              />
            </View>
          </View>
        </View>
      );

    case 'vcard':
      return (
        <View style={styles.form}>
          <Field
            label="Full name"
            icon="person-outline"
            value={fields.vName}
            onChangeText={fields.setVName}
            placeholder="Your name"
          />
          <Field
            label="Phone"
            icon="call-outline"
            value={fields.vPhone}
            onChangeText={fields.setVPhone}
            placeholder="+1 555 010 2030"
            keyboardType="phone-pad"
          />
          <Field
            label="Email"
            icon="mail-outline"
            value={fields.vEmail}
            onChangeText={fields.setVEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Field
            label="Company"
            icon="briefcase-outline"
            value={fields.vOrg}
            onChangeText={fields.setVOrg}
            placeholder="Company or studio"
          />
        </View>
      );

    case 'email':
      return (
        <View style={styles.form}>
          <Field
            label="Send to"
            icon="mail-outline"
            value={fields.emailTo}
            onChangeText={fields.setEmailTo}
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Field
            label="Subject"
            icon="create-outline"
            value={fields.emailSubject}
            onChangeText={fields.setEmailSubject}
            placeholder="What is it about?"
          />
        </View>
      );

    case 'phone':
      return (
        <View style={styles.form}>
          <Field
            label="Phone number"
            icon="call-outline"
            value={fields.phoneNum}
            onChangeText={fields.setPhoneNum}
            placeholder="+1 555 010 2030"
            keyboardType="phone-pad"
          />
        </View>
      );

    default:
      return null;
  }
});

const styles = StyleSheet.create({
  form: {
    marginTop: 20,
    gap: 14,
  },
  chip: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: C.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  textTools: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inlineLabel: {
    width: 64,
  },
  flex: {
    flex: 1,
  },
});
