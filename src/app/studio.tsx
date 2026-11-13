import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ds/app-text';
import { Button, IconButton } from '@/components/ds/controls';
import { Toast, useToast } from '@/components/ds/toast';
import { StatusScrim, TopBlock, useHeaderTop } from '@/components/ds/top-block';
import { ExportSheet } from '@/components/export-sheet';
import { C, CTA_BAR_HEIGHT, PAD, QR_COLORS } from '@/constants/design';
import { isQRType, QR_TYPE_LABEL } from '@/constants/qr-types';
import { PreviewCard } from '@/features/create/components/preview-card';
import { QRForm } from '@/features/create/components/qr-form';
import { StyleControls } from '@/features/create/components/style-controls';
import { TypePills } from '@/features/create/components/type-pills';
import { useKeyboardVisible } from '@/hooks/use-keyboard-visible';
import { useQRGenerator } from '@/hooks/use-qr-generator';
import { haptic } from '@/services/preferences';
import { QRType } from '@/types/qr';
import { displayPayload } from '@/utils/links';
import { saveToFile } from '@/utils/qr-exporter';

/** Types with several fields get a compact preview so the form stays in view. */
const MULTI_FIELD: QRType[] = ['wifi', 'vcard'];

const SHAPE_LABEL = { square: 'Square', rounded: 'Rounded', dots: 'Dots' } as const;

export default function CreateScreen() {
  const params = useLocalSearchParams<{ initialType?: string; initialValue?: string }>();
  const initialType: QRType = isQRType(params.initialType) ? params.initialType : 'url';

  const {
    selectedType,
    setSelectedType,
    customOpts,
    setCustomOpts,
    payloadValue,
    deferredPayloadValue,
    qrRef,
    handleClearInputs,
    formFields: f,
  } = useQRGenerator({ initialType, initialValue: params.initialValue });

  const headerTop = useHeaderTop();
  const keyboardOpen = useKeyboardVisible();
  const { message: toastMessage, show: showToast, hide: hideToast } = useToast();
  const [exportOpen, setExportOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [enlarged, setEnlarged] = useState(false);

  const multiField = MULTI_FIELD.includes(selectedType);
  const compact = multiField && !enlarged;

  // Caption text for the preview and export summary.
  const { title, subtitle } = useMemo(() => {
    switch (selectedType) {
      case 'wifi':
        return {
          title: f.wifiSSID,
          subtitle: `Wi‑Fi · ${f.wifiEnc === 'nopass' ? 'No password' : f.wifiEnc}`,
        };
      case 'vcard':
        return { title: f.vName, subtitle: f.vOrg || f.vPhone || 'Contact' };
      case 'text':
        return { title: f.text.split('\n')[0], subtitle: 'Text' };
      case 'email':
        return { title: f.emailTo, subtitle: f.emailSubject || 'Email' };
      case 'phone':
        return { title: f.phoneNum, subtitle: 'Phone' };
      default:
        return { title: displayPayload(f.url), subtitle: 'Link' };
    }
  }, [selectedType, f]);

  const hasContent = useMemo(() => {
    switch (selectedType) {
      case 'wifi':
        return !!f.wifiSSID.trim();
      case 'vcard':
        return !!f.vName.trim();
      default:
        return !!displayPayload(payloadValue);
    }
  }, [selectedType, f.wifiSSID, f.vName, payloadValue]);

  const summary = useMemo(() => {
    const colour = QR_COLORS.find((c) => c.value.toLowerCase() === (customOpts.fgColor ?? '').toLowerCase());
    return [QR_TYPE_LABEL[selectedType], SHAPE_LABEL[customOpts.moduleShape], colour?.label]
      .filter(Boolean)
      .join(' · ');
  }, [selectedType, customOpts.moduleShape, customOpts.fgColor]);

  const handleType = useCallback(
    (type: QRType) => {
      haptic('light');
      setSelectedType(type);
    },
    [setSelectedType]
  );

  const handleClear = useCallback(() => {
    haptic('medium');
    handleClearInputs();
  }, [handleClearInputs]);

  const toggleSize = useCallback(() => setEnlarged((v) => !v), []);
  const openExport = useCallback(() => {
    haptic('light');
    setExportOpen(true);
  }, []);
  const closeExport = useCallback(() => setExportOpen(false), []);

  const handleDownload = useCallback(async () => {
    haptic('medium');
    setSaving(true);
    try {
      const res = await saveToFile(qrRef as React.RefObject<any>, {
        payloadValue,
        fgColor: customOpts.fgColor ?? C.ink,
        bgColor: customOpts.bgColor || '#FFFFFF',
        moduleShape: customOpts.moduleShape,
        eyeStyle: customOpts.eyeStyle,
        logo: customOpts.logo,
      });
      showToast(res.message, res.success);
    } finally {
      setSaving(false);
    }
  }, [qrRef, payloadValue, customOpts, showToast]);

  const showCta = !keyboardOpen;

  return (
    <View style={styles.screen}>
      <StatusScrim />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerTop, paddingBottom: CTA_BAR_HEIGHT + 28 },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}>
        <TopBlock below={compact ? 164 : 180} />

        <View style={styles.header}>
          <AppText weight="bold" size={26} color={C.white} tracking={-0.8} accessibilityRole="header">
            Create
          </AppText>
          <Pressable onPress={handleClear} accessibilityRole="button" hitSlop={8} style={styles.clear}>
            <AppText weight="semibold" size={14} color={C.onBlockMuted}>
              Clear
            </AppText>
          </Pressable>
        </View>

        <TypePills value={selectedType} onChange={handleType} />

        <PreviewCard
          value={deferredPayloadValue}
          options={customOpts}
          qrRef={qrRef}
          title={title}
          subtitle={subtitle}
          scannable={hasContent}
          compact={compact}
          onToggleSize={multiField ? toggleSize : undefined}
          accessibilityLabel={`QR code preview for ${QR_TYPE_LABEL[selectedType]}${title ? `: ${title}` : ''}`}
        />

        <QRForm type={selectedType} fields={f} />

        <StyleControls options={customOpts} onChange={setCustomOpts} />
      </ScrollView>

      {showCta ? (
        <View style={styles.cta}>
          <IconButton
            icon="share-outline"
            label="More export options"
            variant="square"
            size={48}
            onPress={openExport}
          />
          <Button
            title="Download PNG"
            icon="download-outline"
            loading={saving}
            onPress={handleDownload}
            style={styles.ctaPrimary}
          />
        </View>
      ) : null}

      <Toast message={toastMessage} onHide={hideToast} bottom={CTA_BAR_HEIGHT + 12} />

      <ExportSheet
        visible={exportOpen}
        onClose={closeExport}
        payloadValue={payloadValue}
        qrRef={qrRef}
        options={customOpts}
        title={title}
        summary={summary}
      />
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
  },
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clear: {
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cta: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: CTA_BAR_HEIGHT,
    paddingHorizontal: PAD,
    paddingVertical: 12,
    backgroundColor: C.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.border,
    flexDirection: 'row',
    gap: 10,
  },
  ctaPrimary: {
    flex: 1,
  },
});
