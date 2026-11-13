import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ds/app-text';
import { Button, IconName } from '@/components/ds/controls';
import { QrThumb } from '@/components/ds/qr-thumb';
import { Sheet } from '@/components/ds/sheet';
import { C } from '@/constants/design';
import { haptic } from '@/services/preferences';
import { CustomizationOptions } from '@/types/qr';
import {
  ExportFormat,
  ExportResult,
  openInDefaultTextEditor,
  saveToFile,
  shareGeneral,
  shareToInstagram,
  shareToWhatsApp,
} from '@/utils/qr-exporter';

interface ExportSheetProps {
  visible: boolean;
  onClose: () => void;
  payloadValue: string;
  qrRef: React.RefObject<unknown>;
  options: CustomizationOptions;
  /** e.g. "qrlab.me/menu-demo" */
  title: string;
  /** e.g. "Link · Rounded · Black" */
  summary: string;
}

const FORMATS: { value: ExportFormat; label: string; sub: string; icon: IconName }[] = [
  { value: 'png', label: 'PNG', sub: 'Image', icon: 'image-outline' },
  { value: 'svg', label: 'SVG', sub: 'Any size', icon: 'code-slash-outline' },
  { value: 'pdf', label: 'PDF', sub: 'Print-ready', icon: 'document-text-outline' },
];

type Job = 'save' | 'whatsapp' | 'instagram' | 'editor' | 'more';

export function ExportSheet({
  visible,
  onClose,
  payloadValue,
  qrRef,
  options,
  title,
  summary,
}: ExportSheetProps) {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [busy, setBusy] = useState<Job | null>(null);
  const [result, setResult] = useState<ExportResult | null>(null);

  const fgColor = options.fgColor ?? C.ink;
  const exportOpts = useMemo(
    () => ({
      payloadValue,
      fgColor,
      bgColor: options.bgColor || '#FFFFFF',
      moduleShape: options.moduleShape,
      eyeStyle: options.eyeStyle,
      logo: options.logo,
    }),
    [payloadValue, fgColor, options]
  );

  const run = useCallback(async (job: Job, task: () => Promise<ExportResult>) => {
    haptic('medium');
    setResult(null);
    setBusy(job);
    try {
      setResult(await task());
    } catch (e: any) {
      setResult({ success: false, message: e?.message || 'Something went wrong.' });
    } finally {
      setBusy(null);
    }
  }, []);

  const ref = qrRef as React.RefObject<any>;

  const handleSave = () =>
    run('save', () =>
      format === 'png'
        ? saveToFile(ref, exportOpts)
        : shareGeneral(ref, format, payloadValue, fgColor, options)
    );

  const targets: { job: Job; label: string; icon: IconName; onPress: () => void }[] = [
    {
      job: 'whatsapp',
      label: 'WhatsApp',
      icon: 'logo-whatsapp',
      onPress: () => run('whatsapp', () => shareToWhatsApp(ref, payloadValue, exportOpts)),
    },
    {
      job: 'instagram',
      label: 'Instagram',
      icon: 'logo-instagram',
      onPress: () => run('instagram', () => shareToInstagram(ref, exportOpts)),
    },
    {
      job: 'editor',
      label: 'Text editor',
      icon: 'create-outline',
      onPress: () => run('editor', () => openInDefaultTextEditor(payloadValue)),
    },
    {
      job: 'more',
      label: 'More',
      icon: 'ellipsis-horizontal',
      onPress: () => run('more', () => shareGeneral(ref, format, payloadValue, fgColor, options)),
    },
  ];

  const handleClose = useCallback(() => {
    setResult(null);
    onClose();
  }, [onClose]);

  return (
    <Sheet visible={visible} onClose={handleClose} title="Export">
      <View style={styles.summary}>
        <View style={styles.summaryQr}>
          <QrThumb value={payloadValue || 'https://qrlab.me'} size={44} color={fgColor} />
        </View>
        <View style={styles.flex}>
          <AppText weight="bold" size={15} numberOfLines={1}>
            {title || 'Untitled code'}
          </AppText>
          <AppText size={12.5} color={C.muted} numberOfLines={1}>
            {summary}
          </AppText>
        </View>
      </View>

      <AppText weight="semibold" size={13} color={C.muted} style={styles.label}>
        Format
      </AppText>
      <View style={styles.formats} accessibilityRole="radiogroup" accessibilityLabel="Format">
        {FORMATS.map((f) => {
          const on = f.value === format;
          return (
            <Pressable
              key={f.value}
              onPress={() => {
                haptic('light');
                setFormat(f.value);
              }}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              accessibilityLabel={`${f.label}, ${f.sub}`}
              style={({ pressed }) => [
                styles.format,
                on ? styles.formatOn : styles.formatOff,
                pressed && styles.pressed,
              ]}>
              <Ionicons name={f.icon} size={20} color={on ? C.ink : C.strong} />
              <AppText weight="bold" size={14}>
                {f.label}
              </AppText>
              <AppText size={12} color={C.muted}>
                {f.sub}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <AppText weight="semibold" size={13} color={C.muted} style={styles.label}>
        Share to
      </AppText>
      <View style={styles.targets}>
        {targets.map((t) => (
          <Pressable
            key={t.job}
            onPress={t.onPress}
            disabled={!!busy}
            accessibilityRole="button"
            accessibilityLabel={t.label}
            style={({ pressed }) => [styles.target, pressed && styles.pressed]}>
            <View style={styles.targetIcon}>
              {busy === t.job ? (
                <ActivityIndicator size="small" color={C.ink} />
              ) : (
                <Ionicons name={t.icon} size={22} color={C.ink} />
              )}
            </View>
            <AppText weight="semibold" size={12} color={C.strong} numberOfLines={1}>
              {t.label}
            </AppText>
          </Pressable>
        ))}
      </View>

      {result ? (
        <View
          aria-live="polite"
          style={[styles.result, { backgroundColor: result.success ? C.okBg : C.warnBg }]}>
          <Ionicons
            name={result.success ? 'checkmark-circle' : 'alert-circle'}
            size={17}
            color={result.success ? C.okText : C.warnText}
          />
          <AppText
            weight="semibold"
            size={13}
            color={result.success ? C.okText : C.warnText}
            style={styles.flex}>
            {result.message}
          </AppText>
        </View>
      ) : null}

      <Button
        title={`Save ${format.toUpperCase()} to Files`}
        icon="download-outline"
        size="lg"
        loading={busy === 'save'}
        disabled={!!busy && busy !== 'save'}
        onPress={handleSave}
        style={styles.primary}
      />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    minWidth: 0,
  },
  summary: {
    marginTop: 12,
    padding: 10,
    borderRadius: 16,
    backgroundColor: C.soft,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryQr: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 20,
    marginBottom: 8,
  },
  formats: {
    flexDirection: 'row',
    gap: 8,
  },
  format: {
    flex: 1,
    height: 80,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  formatOn: {
    borderWidth: 1.5,
    borderColor: C.brand,
    backgroundColor: C.soft,
  },
  formatOff: {
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  targets: {
    flexDirection: 'row',
    gap: 8,
  },
  target: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  targetIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: C.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  result: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primary: {
    marginTop: 20,
  },
  pressed: {
    opacity: 0.7,
  },
});
