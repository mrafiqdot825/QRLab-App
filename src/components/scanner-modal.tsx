import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Linking, Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ds/app-text';
import { Button, IconButton } from '@/components/ds/controls';
import { C, PAD } from '@/constants/design';
import { haptic } from '@/services/preferences';
import { openInDefaultTextEditor } from '@/utils/qr-exporter';

interface ScannerModalProps {
  visible: boolean;
  onClose: () => void;
}

type ScanResult = { kind: 'url' | 'text'; value: string };

const SAMPLE_TEXT =
  'Important Plain Text Note:\nScanned directly from QRLab Camera Scanner!\n\nUse this mobile text editor to modify or re-generate your QR code.';
const SAMPLE_URL = 'https://qrlab.me/demo-scanned-access';

const FRAME = 248;

export function ScannerModal({ visible, onClose }: ScannerModalProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [torch, setTorch] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [copied, setCopied] = useState(false);
  const lineY = useSharedValue(0);

  useEffect(() => {
    if (visible && !result) {
      lineY.value = 0;
      lineY.value = withRepeat(withTiming(FRAME - 40, { duration: 2000 }), -1, true);
    } else {
      cancelAnimation(lineY);
    }
    return () => cancelAnimation(lineY);
  }, [visible, result, lineY]);

  const lineStyle = useAnimatedStyle(() => ({ transform: [{ translateY: lineY.value }] }));

  const scan = useCallback((kind: ScanResult['kind']) => {
    haptic('success');
    setCopied(false);
    setResult({ kind, value: kind === 'url' ? SAMPLE_URL : SAMPLE_TEXT });
  }, []);

  const close = useCallback(() => {
    haptic('light');
    setResult(null);
    onClose();
  }, [onClose]);

  const editInCreate = useCallback(() => {
    if (!result) return;
    setResult(null);
    onClose();
    router.navigate({
      pathname: '/studio',
      params: { initialType: result.kind, initialValue: result.value },
    });
  }, [result, onClose, router]);

  const openResult = useCallback(async () => {
    if (!result) return;
    haptic('light');
    if (result.kind === 'url') {
      await Linking.openURL(result.value).catch(() => {});
    } else {
      await openInDefaultTextEditor(result.value);
    }
  }, [result]);

  const copy = useCallback(async () => {
    if (!result) return;
    await Clipboard.setStringAsync(result.value).catch(() => {});
    haptic('success');
    setCopied(true);
  }, [result]);

  if (!visible) return null;

  const isUrl = result?.kind === 'url';

  return (
    <Modal visible animationType="slide" statusBarTranslucent navigationBarTranslucent onRequestClose={close}>
      <View style={styles.root}>
        {/* Viewfinder */}
        <View style={styles.finderWrap} pointerEvents="none">
          <View style={styles.frame}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
            {!result ? <Animated.View style={[styles.scanLine, lineStyle]} /> : null}
            {result ? (
              <View style={styles.found}>
                <Ionicons name="checkmark" size={30} color={C.white} />
              </View>
            ) : null}
          </View>
          <AppText size={14} color="rgba(255,255,255,0.78)" align="center" style={styles.hint}>
            {result ? 'Code found' : 'Point at a QR code. It scans on its own.'}
          </AppText>
        </View>

        {/* Top bar */}
        <View style={[styles.top, { top: insets.top + 12 }]}>
          <IconButton icon="close" label="Close scanner" variant="block" onPress={close} />
          <AppText weight="semibold" size={17} color={C.white} accessibilityRole="header">
            Scan a code
          </AppText>
          <IconButton
            icon={torch ? 'flash' : 'flash-outline'}
            label={torch ? 'Turn off torch' : 'Turn on torch'}
            variant="block"
            color={torch ? C.ink : C.white}
            style={torch ? styles.torchOn : undefined}
            onPress={() => {
              haptic('medium');
              setTorch((t) => !t);
            }}
          />
        </View>

        {/* Bottom */}
        <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, 16) + 12 }]}>
          {result ? (
            <Animated.View
              entering={FadeInDown.duration(200)}
              style={styles.card}
              aria-live="polite">
              <View style={styles.cardHead}>
                <View style={styles.cardIcon}>
                  <Ionicons name={isUrl ? 'link' : 'text'} size={20} color={C.okText} />
                </View>
                <View style={styles.cardText}>
                  <AppText weight="semibold" size={12.5} color={C.okText}>
                    {isUrl ? 'Link found' : 'Text found'}
                  </AppText>
                  <AppText weight="bold" size={16} tracking={-0.2} numberOfLines={2}>
                    {isUrl ? result.value.replace(/^https?:\/\//, '') : result.value.replace(/\s+/g, ' ')}
                  </AppText>
                </View>
                <IconButton
                  icon={copied ? 'checkmark' : 'copy-outline'}
                  label={copied ? 'Copied' : 'Copy'}
                  iconSize={19}
                  onPress={copy}
                />
              </View>
              <View style={styles.cardActions}>
                <Button
                  title="Edit in Create"
                  icon="create-outline"
                  variant="secondary"
                  onPress={editInCreate}
                  style={styles.flex}
                />
                <Button
                  title={isUrl ? 'Open link' : 'Open in editor'}
                  icon="open-outline"
                  onPress={openResult}
                  style={styles.flex}
                />
              </View>
              <Pressable onPress={() => setResult(null)} accessibilityRole="button" style={styles.again}>
                <AppText weight="semibold" size={14} color={C.muted}>
                  Scan another
                </AppText>
              </Pressable>
            </Animated.View>
          ) : (
            <View style={styles.samples}>
              <Button
                title="Scan text"
                icon="text-outline"
                variant="white"
                onPress={() => scan('text')}
                style={styles.flex}
              />
              <Button
                title="Scan link"
                icon="link-outline"
                variant="white"
                onPress={() => scan('url')}
                style={styles.flex}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const CORNER = 40;
const BORDER = 4;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0B0C',
  },
  finderWrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  frame: {
    width: FRAME,
    height: FRAME,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: C.white,
  },
  tl: { top: -2, left: -2, borderTopWidth: BORDER, borderLeftWidth: BORDER, borderTopLeftRadius: 30 },
  tr: { top: -2, right: -2, borderTopWidth: BORDER, borderRightWidth: BORDER, borderTopRightRadius: 30 },
  bl: {
    bottom: -2,
    left: -2,
    borderBottomWidth: BORDER,
    borderLeftWidth: BORDER,
    borderBottomLeftRadius: 30,
  },
  br: {
    bottom: -2,
    right: -2,
    borderBottomWidth: BORDER,
    borderRightWidth: BORDER,
    borderBottomRightRadius: 30,
  },
  scanLine: {
    position: 'absolute',
    top: 20,
    left: 18,
    right: 18,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  found: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: C.okDot,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    marginTop: 24,
    paddingHorizontal: PAD,
  },
  top: {
    position: 'absolute',
    left: PAD,
    right: PAD,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  torchOn: {
    backgroundColor: '#FCD34D',
  },
  bottom: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 0,
  },
  samples: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: PAD - 12,
  },
  card: {
    padding: 16,
    paddingBottom: 6,
    borderRadius: 24,
    backgroundColor: C.white,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.okBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  cardActions: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
  },
  again: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
});
