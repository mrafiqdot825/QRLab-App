import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import { AppText } from '@/components/ds/app-text';
import { C } from '@/constants/design';

export interface ToastMessage {
  text: string;
  ok: boolean;
}

/** Small dark toast that hides itself after a few seconds. `bottom` sets its distance from the screen bottom. */
export function Toast({
  message,
  onHide,
  bottom,
}: {
  message: ToastMessage | null;
  onHide: () => void;
  bottom: number;
}) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onHide, 2600);
    return () => clearTimeout(t);
  }, [message, onHide]);

  if (!message) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(180)}
      exiting={FadeOutDown.duration(160)}
      aria-live="polite"
      accessibilityRole="alert"
      pointerEvents="none"
      style={[styles.toast, { bottom }]}>
      <Ionicons
        name={message.ok ? 'checkmark-circle' : 'alert-circle'}
        size={18}
        color={message.ok ? '#4ADE80' : '#FCA5A5'}
      />
      <AppText weight="semibold" size={14} color={C.white} style={styles.text} numberOfLines={2}>
        {message.text}
      </AppText>
    </Animated.View>
  );
}

/** Local toast state helper. */
export function useToast() {
  const [message, setMessage] = useState<ToastMessage | null>(null);
  const show = useCallback((text: string, ok = true) => setMessage({ text, ok }), []);
  const hide = useCallback(() => setMessage(null), []);
  return { message, show, hide };
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 20,
    right: 20,
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: C.brand,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 50,
    boxShadow: '0px 10px 24px -8px rgba(0,0,0,0.45)',
  },
  text: {
    flex: 1,
  },
});
