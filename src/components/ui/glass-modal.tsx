import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { SpringConfigs } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface GlassModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  variant?: 'modal' | 'sheet';
}

export function GlassModal({
  visible,
  onClose,
  title,
  children,
  variant = 'modal',
}: GlassModalProps) {
  const { colors, shadows } = useTheme();
  const translateY = useSharedValue(300);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withSpring(1, SpringConfigs.gentle);
      translateY.value = withSpring(0, SpringConfigs.modal);
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      }
    } else {
      opacity.value = withSpring(0, SpringConfigs.gentle);
      translateY.value = withSpring(300, SpringConfigs.gentle);
    }
  }, [visible, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  if (!visible) return null;

  const isSheet = variant === 'sheet';

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="fade">
      <View className="flex-1 justify-end items-center relative">
        {/* Backdrop Scrim */}
        <Pressable
          accessibilityLabel="Close modal overlay"
          accessibilityRole="button"
          onPress={onClose}
          className="absolute inset-0 bg-black/40"
        />

        {/* Floating Solid Container */}
        <Animated.View
          style={[
            shadows.modal,
            { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
            animatedStyle,
            isSheet ? styles.sheetRadius : styles.modalRadius,
          ]}
          className="w-full max-w-[540px] overflow-hidden mb-0 sm:mb-6 relative max-h-[85%]">
          {/* Sheet Handle */}
          {isSheet && <View style={{ backgroundColor: colors.border }} className="w-12 h-1.5 rounded-full self-center mt-3 mb-1" />}

          {/* Header */}
          <View style={{ borderColor: 'rgba(74, 15, 58, 0.06)' }} className="flex-row items-center justify-between px-6 pt-4 pb-3 border-b">
            {title ? (
              <Text className="text-ink text-2xl font-serif font-bold tracking-tight">{title}</Text>
            ) : (
              <View />
            )}
            <Pressable
              accessibilityLabel="Close button"
              accessibilityRole="button"
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                }
                onClose();
              }}
              style={{ backgroundColor: '#FDF6F2', borderWidth: 1, borderColor: 'rgba(74, 15, 58, 0.08)' }}
              className="w-9 h-9 rounded-full items-center justify-center active:opacity-70">
              <Ionicons name="close" size={18} color="#1A1416" />
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView
            className="flex-shrink"
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}>
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 24,
    paddingTop: 16,
  },
  sheetRadius: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  modalRadius: {
    borderRadius: 32,
  },
});
