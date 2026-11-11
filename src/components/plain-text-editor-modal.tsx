import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { GlassBadge } from '@/components/ui/glass-badge';
import { GlassButton } from '@/components/ui/glass-button';
import { useTheme } from '@/hooks/use-theme';
import { openInDefaultTextEditor } from '@/utils/qr-exporter';

interface PlainTextEditorModalProps {
  visible: boolean;
  onClose: () => void;
  value: string;
  onChangeValue: (text: string) => void;
}

export const PlainTextEditorModal = React.memo(function PlainTextEditorModal({
  visible,
  onClose,
  value,
  onChangeValue,
}: PlainTextEditorModalProps) {
  const { colors, shadows } = useTheme();

  const charCount = value ? value.length : 0;
  const wordCount = useMemo(() => {
    if (!value || !value.trim()) return 0;
    return value.trim().split(/\s+/).length;
  }, [value]);

  const lineCount = useMemo(() => {
    if (!value) return 0;
    return value.split('\n').length;
  }, [value]);

  const handleClear = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
    onChangeValue('');
  }, [onChangeValue]);

  const handleCopy = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard && value) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
  }, [value]);

  const handleOpenPhoneEditor = useCallback(async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
    await openInDefaultTextEditor(value);
  }, [value]);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end items-center bg-black/40 relative">
        <Pressable
          accessibilityLabel="Backdrop"
          accessibilityRole="button"
          onPress={onClose}
          className="absolute inset-0 bg-black/40"
        />

        <View
          style={[
            shadows.modal,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
            },
          ]}
          className="w-full max-w-[640px] h-[85%] rounded-t-3xl overflow-hidden relative flex-col">
          {/* Sheet Handle */}
          <View style={{ backgroundColor: colors.border }} className="w-12 h-1.5 rounded-full self-center mt-3 mb-1" />

          {/* Header */}
          <View
            style={{ borderColor: colors.border }}
            className="flex-row items-center justify-between px-6 py-4 border-b">
            <View className="flex-row items-center gap-2">
              <Ionicons name="document-text-outline" size={22} color={colors.accent} />
              <Text className="text-on-surface text-lg font-extrabold tracking-tight">
                Mobile Text Editor
              </Text>
            </View>

            <Pressable
              accessibilityLabel="Close editor"
              accessibilityRole="button"
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                }
                onClose();
              }}
              style={{ backgroundColor: colors.glassSurfaceSubtle }}
              className="w-9 h-9 rounded-full items-center justify-center active:opacity-70">
              <Ionicons name="close" size={20} color={colors.secondaryText} />
            </Pressable>
          </View>

          {/* Stats Bar */}
          <View
            style={{ backgroundColor: colors.surface }}
            className="flex-row items-center justify-between px-6 py-2 border-b border-white/10">
            <View className="flex-row items-center gap-2">
              <GlassBadge label={`${charCount} Chars`} variant="primary" />
              <GlassBadge label={`${wordCount} Words`} variant="secondary" />
              <GlassBadge label={`${lineCount} Lines`} variant="warning" />
            </View>

            <View className="flex-row items-center gap-2">
              {value.length > 0 && (
                <Pressable
                  accessibilityLabel="Copy text"
                  accessibilityRole="button"
                  onPress={handleCopy}
                  className="flex-row items-center gap-1 px-2.5 py-1 rounded-none bg-accent/10 active:opacity-70">
                  <Ionicons name="copy-outline" size={14} color={colors.accent} />
                  <Text className="text-accent font-semibold text-xs">Copy</Text>
                </Pressable>
              )}
              {value.length > 0 && (
                <Pressable
                  accessibilityLabel="Clear text"
                  accessibilityRole="button"
                  onPress={handleClear}
                  className="flex-row items-center gap-1 px-2.5 py-1 rounded-none bg-red-500/10 active:opacity-70">
                  <Ionicons name="trash-outline" size={14} color="#EF4444" />
                  <Text className="text-red-400 font-semibold text-xs">Clear</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Text Editor Body */}
          <ScrollView
            className="flex-1 p-6"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled">
            <TextInput
              multiline
              autoFocus
              className="flex-1 text-on-surface font-medium text-base leading-6 text-top p-0 m-0"
              placeholder="Type or paste plain text payload here..."
              placeholderTextColor={colors.secondaryText}
              selectionColor={colors.accent}
              cursorColor={colors.accent}
              value={value}
              onChangeText={onChangeValue}
              textAlignVertical="top"
            />
          </ScrollView>

          {/* Footer Actions */}
          <View
            style={{ borderColor: colors.border, backgroundColor: colors.surface }}
            className="p-4 border-t flex-row items-center justify-between gap-3 z-10">
            <GlassButton
              title="Open in Phone Editor"
              icon="open-outline"
              variant="secondary"
              onPress={handleOpenPhoneEditor}
            />
            <GlassButton
              title="Save & Use Text"
              icon="checkmark-circle-outline"
              variant="primary"
              onPress={onClose}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
});
