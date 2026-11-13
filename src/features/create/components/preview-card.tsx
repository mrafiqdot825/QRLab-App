import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ds/app-text';
import { IconButton, StatusPill } from '@/components/ds/controls';
import { CustomStyledQRCode } from '@/components/ui/custom-styled-qr-code';
import { PREVIEW_QR_SIZE, qrRenderProps } from '@/components/ui/qr-render-props';
import { C, SHADOW_CARD } from '@/constants/design';
import { CustomizationOptions } from '@/types/qr';

interface PreviewCardProps {
  value: string;
  options: CustomizationOptions;
  qrRef: React.RefObject<unknown>;
  title: string;
  subtitle?: string;
  scannable: boolean;
  compact: boolean;
  /** Shown for multi-field types so the preview can grow or shrink. */
  onToggleSize?: () => void;
  accessibilityLabel: string;
}

const LARGE = PREVIEW_QR_SIZE;
const SMALL = 76;

/**
 * Live QR preview. The SVG ref is handed to the exporter, which renders it at
 * export resolution regardless of the size shown here.
 */
export const PreviewCard = React.memo(function PreviewCard({
  value,
  options,
  qrRef,
  title,
  subtitle,
  scannable,
  compact,
  onToggleSize,
  accessibilityLabel,
}: PreviewCardProps) {
  const setRef = React.useCallback(
    (ref: unknown) => {
      (qrRef as React.MutableRefObject<unknown>).current = ref;
    },
    [qrRef]
  );

  const size = compact ? SMALL : LARGE;
  const qr = (
    <CustomStyledQRCode
      value={value || 'https://qrlab.me'}
      {...qrRenderProps(options, size)}
      getRef={setRef}
    />
  );

  const status = (
    <StatusPill label={scannable ? 'Scannable' : 'Add details'} tone={scannable ? 'ok' : 'muted'} />
  );

  if (compact) {
    return (
      <View style={[styles.card, styles.compact]}>
        <View
          style={styles.qrWrap}
          accessible
          accessibilityRole="image"
          accessibilityLabel={accessibilityLabel}>
          {qr}
        </View>
        <View style={styles.compactText}>
          <AppText weight="bold" size={16} tracking={-0.2} numberOfLines={1}>
            {title || 'Untitled'}
          </AppText>
          {subtitle ? (
            <AppText size={13} color={C.muted} numberOfLines={1}>
              {subtitle}
            </AppText>
          ) : null}
          <View style={styles.compactStatus}>{status}</View>
        </View>
        {onToggleSize ? (
          <IconButton icon="expand-outline" label="Enlarge preview" iconSize={18} onPress={onToggleSize} />
        ) : null}
      </View>
    );
  }

  return (
    <View style={[styles.card, styles.large]}>
      {onToggleSize ? (
        <IconButton
          icon="contract-outline"
          label="Shrink preview"
          size={36}
          iconSize={16}
          onPress={onToggleSize}
          style={styles.shrink}
        />
      ) : null}
      <View
        style={styles.qrWrap}
        accessible
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel}>
        {qr}
      </View>
      <View style={styles.caption}>
        <AppText size={13} color={C.muted} numberOfLines={1} style={styles.captionText}>
          {title || 'Nothing to encode yet'}
        </AppText>
        {status}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    borderRadius: 20,
    backgroundColor: C.white,
    boxShadow: SHADOW_CARD,
    borderWidth: 1,
    borderColor: C.border,
  },
  large: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  compact: {
    height: 100,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  qrWrap: {
    overflow: 'hidden',
  },
  compactText: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  compactStatus: {
    marginTop: 2,
  },
  caption: {
    marginTop: 12,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  captionText: {
    flex: 1,
  },
  shrink: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
  },
});
