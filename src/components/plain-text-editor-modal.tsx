import * as Clipboard from 'expo-clipboard';
import React, { useCallback, useMemo } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ds/app-text';
import { Button, IconButton } from '@/components/ds/controls';
import { C, FONT, PAD } from '@/constants/design';
import { haptic } from '@/services/preferences';
import { openInDefaultTextEditor } from '@/utils/qr-exporter';

interface PlainTextEditorModalProps {
  visible: boolean;
  onClose: () => void;
  value: string;
  onChangeValue: (text: string) => void;
}

/** Full-height editor for long plain-text codes. */
export const PlainTextEditorModal = React.memo(function PlainTextEditorModal({
  visible,
  onClose,
  value,
  onChangeValue,
}: PlainTextEditorModalProps) {
  const insets = useSafeAreaInsets();

  const stats = useMemo(() => {
    const chars = value?.length ?? 0;
    const words = value?.trim() ? value.trim().split(/\s+/).length : 0;
    const lines = value ? value.split('\n').length : 0;
    return `${chars} characters · ${words} words · ${lines} lines`;
  }, [value]);

  const handleClear = useCallback(() => {
    haptic('medium');
    onChangeValue('');
  }, [onChangeValue]);

  const handleCopy = useCallback(async () => {
    if (!value) return;
    await Clipboard.setStringAsync(value).catch(() => {});
    haptic('success');
  }, [value]);

  const handleOpenPhoneEditor = useCallback(async () => {
    haptic('medium');
    await openInDefaultTextEditor(value);
  }, [value]);

  if (!visible) return null;

  return (
    <Modal visible animationType="slide" transparent statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close editor" />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 12) + 12 }]}>
          <View style={styles.grabber} />
          <View style={styles.header}>
            <AppText weight="bold" size={20} tracking={-0.4} accessibilityRole="header">
              Text
            </AppText>
            <View style={styles.headerActions}>
              <IconButton
                icon="copy-outline"
                label="Copy text"
                size={36}
                iconSize={18}
                onPress={handleCopy}
              />
              <IconButton
                icon="trash-outline"
                label="Clear text"
                size={36}
                iconSize={18}
                onPress={handleClear}
              />
              <IconButton icon="close" label="Close" size={36} iconSize={18} onPress={onClose} />
            </View>
          </View>
          <AppText size={12.5} color={C.muted} style={styles.stats}>
            {stats}
          </AppText>

          <TextInput
            multiline
            autoFocus
            value={value}
            onChangeText={onChangeValue}
            placeholder="Type or paste your text"
            placeholderTextColor={C.inactive}
            selectionColor={C.brand}
            cursorColor={C.brand}
            textAlignVertical="top"
            accessibilityLabel="Text for the QR code"
            style={styles.input}
          />

          <View style={styles.footer}>
            <Button
              title="Open in editor"
              icon="open-outline"
              variant="secondary"
              onPress={handleOpenPhoneEditor}
              style={styles.flex}
            />
            <Button title="Done" icon="checkmark" onPress={onClose} style={styles.flex} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: C.scrim,
  },
  sheet: {
    height: '88%',
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    backgroundColor: C.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: PAD,
    paddingTop: 8,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.switchOff,
  },
  header: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  stats: {
    marginTop: 4,
  },
  input: {
    flex: 1,
    marginTop: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    fontFamily: FONT.regular,
    fontSize: 16,
    lineHeight: 23,
    color: C.ink,
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
  flex: {
    flex: 1,
  },
});
