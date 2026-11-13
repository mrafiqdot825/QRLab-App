import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ds/app-text';
import { IconButton } from '@/components/ds/controls';
import { C, PAD } from '@/constants/design';

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Wrap the body in a ScrollView for long content. */
  scroll?: boolean;
}

/** Bottom sheet with a dimmed backdrop, grabber, title and close button. */
export function Sheet({ visible, onClose, title, children, scroll }: SheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        />
        <Animated.View
          entering={SlideInDown.duration(260)}
          aria-modal
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 12) + 16 }]}>
          <View style={styles.grabber} />
          <View style={styles.header}>
            <AppText weight="bold" size={20} tracking={-0.4} accessibilityRole="header">
              {title}
            </AppText>
            <IconButton
              icon="close"
              label="Close"
              size={32}
              iconSize={18}
              onPress={onClose}
              style={styles.close}
            />
          </View>
          {scroll ? (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}>
              {children}
            </ScrollView>
          ) : (
            children
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: C.scrim,
  },
  sheet: {
    maxHeight: '90%',
    backgroundColor: C.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: PAD,
    paddingTop: 8,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
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
  close: {
    marginRight: 2,
  },
  scroll: {
    marginTop: 8,
  },
  scrollContent: {
    paddingBottom: 8,
  },
});
