import { GlassCard } from '@/components/ui/glass-card';
import { GlassModal } from '@/components/ui/glass-modal';
import { GlassToast } from '@/components/ui/glass-toast';
import { CinematicPresets, Palette, PresetId } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { withAlpha } from '@/utils/color';
import {
  ExportFormat,
  openInDefaultTextEditor,
  saveToFile,
  shareGeneral,
  shareToInstagram,
  shareToWhatsApp,
} from '@/utils/qr-exporter';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Text, View } from 'react-native';

import { CustomizationOptions } from '@/types/qr';

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
  payloadValue: string;
  qrRef: React.RefObject<unknown>;
  presetId: PresetId;
  typeLabel: string;
  fgColor?: string;
  options?: CustomizationOptions;
}

export function ExportModal({
  visible,
  onClose,
  payloadValue,
  qrRef,
  presetId,
  typeLabel: _typeLabel,
  fgColor,
  options,
}: ExportModalProps) {
  const { colors } = useTheme();
  const [isExporting, setIsExporting] = useState(false);
  const [exportingText, setExportingText] = useState('Rendering QR Code...');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const effectiveFgColor = useMemo(() => {
    if (fgColor) return fgColor;
    if (options?.fgColor) return options.fgColor;
    const preset = CinematicPresets.find((p) => p.id === presetId);
    return preset?.qrColor || '#1E2A38';
  }, [fgColor, options?.fgColor, presetId]);

  const exportOpts = useMemo(
    () => ({
      payloadValue,
      fgColor: effectiveFgColor,
      bgColor: options?.bgColor || '#FFFFFF',
      moduleShape: options?.moduleShape,
      eyeStyle: options?.eyeStyle,
      logo: options?.logo,
    }),
    [payloadValue, effectiveFgColor, options]
  );

  const triggerHaptics = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
  }, []);

  const handleSelectFormat = useCallback(
    (format: ExportFormat) => {
      triggerHaptics();
      setSelectedFormat(format);
    },
    [triggerHaptics]
  );

  const handleSaveFile = async () => {
    triggerHaptics();
    setIsExporting(true);
    setExportingText('Saving QR image to device files...');

    const res = await saveToFile(qrRef as any, exportOpts);
    setIsExporting(false);
    setToastMsg(res.message);
  };

  const handleShareWhatsApp = async () => {
    triggerHaptics();
    setIsExporting(true);
    setExportingText('Preparing WhatsApp share...');

    const res = await shareToWhatsApp(qrRef as any, payloadValue, exportOpts);
    setIsExporting(false);
    setToastMsg(res.message);
  };

  const handleShareInstagram = async () => {
    triggerHaptics();
    setIsExporting(true);
    setExportingText('Preparing Instagram share...');

    const res = await shareToInstagram(qrRef as any, exportOpts);
    setIsExporting(false);
    setToastMsg(res.message);
  };

  const handleOpenTextEditor = async () => {
    triggerHaptics();
    setIsExporting(true);
    setExportingText('Opening text in phone editor...');

    const res = await openInDefaultTextEditor(payloadValue);
    setIsExporting(false);
    setToastMsg(res.message);
  };

  const handleShareSystem = async (formatOverride?: ExportFormat) => {
    triggerHaptics();
    const fmt = formatOverride || selectedFormat;
    setIsExporting(true);
    setExportingText(`Exporting ${fmt.toUpperCase()} format...`);

    const res = await shareGeneral(qrRef as any, fmt, payloadValue, effectiveFgColor, options);
    setIsExporting(false);
    setToastMsg(res.message);
  };

  return (
    <GlassModal visible={visible} onClose={onClose} title="Export & Share Code Studio" variant="sheet">
      <GlassToast visible={!!toastMsg} message={toastMsg || ''} onHide={() => setToastMsg(null)} />

      <View className="gap-5">
        <Text className="text-on-surface-variant text-xs leading-5">
          Select vector or high-resolution format, then save to device files or share to apps.
        </Text>

        {isExporting && (
          <View style={{ backgroundColor: withAlpha(colors.accent, 0.10), borderColor: withAlpha(colors.accent, 0.20) }} className="flex-row items-center justify-center gap-3 py-4 rounded-2xl border">
            <ActivityIndicator size="small" color={colors.accent} />
            <Text className="text-accent font-bold text-sm">{exportingText}</Text>
          </View>
        )}

        {/* EXPORT FORMAT CATEGORIES */}
        <View className="gap-2">
          <Text className="text-on-surface text-xs font-bold uppercase tracking-wider">
            1. Select Export Format Category
          </Text>
          <View className="flex-row gap-2.5">
            <GlassCard
              onPress={() => handleSelectFormat('png')}
              interactive
              style={{
                flex: 1,
                borderColor: selectedFormat === 'png' ? '#4A0F3A' : 'rgba(74, 15, 58, 0.08)',
                borderWidth: selectedFormat === 'png' ? 2 : 1,
                backgroundColor: selectedFormat === 'png' ? '#FDF6F2' : '#FFFFFF',
              }}
              className="p-3 items-center gap-1.5"
            >
              <Ionicons
                name="image-outline"
                size={20}
                color={selectedFormat === 'png' ? '#4A0F3A' : Palette.inkMuted}
              />
              <Text
                className={`text-xs font-bold ${
                  selectedFormat === 'png' ? 'text-plum' : 'text-ink-muted'
                }`}
              >
                PNG Image
              </Text>
              <Text className="text-[10px] text-ink-muted text-center" numberOfLines={1}>
                HD 2048px
              </Text>
            </GlassCard>

            <GlassCard
              onPress={() => handleSelectFormat('svg')}
              interactive
              style={{
                flex: 1,
                borderColor: selectedFormat === 'svg' ? '#4A0F3A' : 'rgba(74, 15, 58, 0.08)',
                borderWidth: selectedFormat === 'svg' ? 2 : 1,
                backgroundColor: selectedFormat === 'svg' ? '#FDF6F2' : '#FFFFFF',
              }}
              className="p-3 items-center gap-1.5"
            >
              <Ionicons
                name="code-slash-outline"
                size={20}
                color={selectedFormat === 'svg' ? '#4A0F3A' : Palette.inkMuted}
              />
              <Text
                className={`text-xs font-bold ${
                  selectedFormat === 'svg' ? 'text-plum' : 'text-ink-muted'
                }`}
              >
                SVG Vector
              </Text>
              <Text className="text-[10px] text-ink-muted text-center" numberOfLines={1}>
                Infinite scale
              </Text>
            </GlassCard>

            <GlassCard
              onPress={() => handleSelectFormat('pdf')}
              interactive
              style={{
                flex: 1,
                borderColor: selectedFormat === 'pdf' ? '#4A0F3A' : 'rgba(74, 15, 58, 0.08)',
                borderWidth: selectedFormat === 'pdf' ? 2 : 1,
                backgroundColor: selectedFormat === 'pdf' ? '#FDF6F2' : '#FFFFFF',
              }}
              className="p-3 items-center gap-1.5"
            >
              <Ionicons
                name="document-text-outline"
                size={20}
                color={selectedFormat === 'pdf' ? '#4A0F3A' : Palette.inkMuted}
              />
              <Text
                className={`text-xs font-bold ${
                  selectedFormat === 'pdf' ? 'text-plum' : 'text-ink-muted'
                }`}
              >
                PDF Document
              </Text>
              <Text className="text-[10px] text-ink-muted text-center" numberOfLines={1}>
                Print ready
              </Text>
            </GlassCard>
          </View>
        </View>

        {/* SHARE & SAVE DESTINATION OPTIONS */}
        <View className="gap-2 mt-1">
          <Text className="text-on-surface text-xs font-bold uppercase tracking-wider">
            2. Choose Share or Save Destination
          </Text>

          <View className="flex-row flex-wrap gap-3">
            {/* SAVE TO FILES */}
            <GlassCard
              onPress={handleSaveFile}
              interactive
              style={{ flexBasis: '48%', flexGrow: 1 }}
              className="p-3.5 gap-2"
            >
              <View className="flex-row items-center gap-2.5">
                <View style={{ backgroundColor: withAlpha(colors.accent, 0.12) }} className="w-9 h-9 rounded-xl items-center justify-center">
                  <Ionicons name="download-outline" size={18} color={colors.accent} />
                </View>
                <View className="flex-1">
                  <Text className="text-on-surface font-extrabold text-sm" numberOfLines={1}>
                    Save to Files
                  </Text>
                  <Text className="text-on-surface-variant text-[11px]" numberOfLines={1}>
                    Store on device storage
                  </Text>
                </View>
              </View>
            </GlassCard>

            {/* WHATSAPP */}
            <GlassCard
              onPress={handleShareWhatsApp}
              interactive
              style={{ flexBasis: '48%', flexGrow: 1 }}
              className="p-3.5 gap-2"
            >
              <View className="flex-row items-center gap-2.5">
                <View className="w-9 h-9 rounded-xl bg-emerald-500/15 items-center justify-center">
                  <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                </View>
                <View className="flex-1">
                  <Text className="text-on-surface font-extrabold text-sm" numberOfLines={1}>
                    WhatsApp
                  </Text>
                  <Text className="text-on-surface-variant text-[11px]" numberOfLines={1}>
                    Share to chat or status
                  </Text>
                </View>
              </View>
            </GlassCard>

            {/* INSTAGRAM */}
            <GlassCard
              onPress={handleShareInstagram}
              interactive
              style={{ flexBasis: '48%', flexGrow: 1 }}
              className="p-3.5 gap-2"
            >
              <View className="flex-row items-center gap-2.5">
                <View className="w-9 h-9 rounded-xl bg-pink-500/15 items-center justify-center">
                  <Ionicons name="logo-instagram" size={18} color="#E1306C" />
                </View>
                <View className="flex-1">
                  <Text className="text-on-surface font-extrabold text-sm" numberOfLines={1}>
                    Instagram
                  </Text>
                  <Text className="text-on-surface-variant text-[11px]" numberOfLines={1}>
                    Post to Stories or DM
                  </Text>
                </View>
              </View>
            </GlassCard>

            {/* PHONE DEFAULT TEXT EDITOR */}
            <GlassCard
              onPress={handleOpenTextEditor}
              interactive
              style={{ flexBasis: '48%', flexGrow: 1 }}
              className="p-3.5 gap-2"
            >
              <View className="flex-row items-center gap-2.5">
                <View className="w-9 h-9 rounded-xl bg-emerald-500/15 items-center justify-center">
                  <Ionicons name="document-text-outline" size={18} color={Palette.emerald} />
                </View>
                <View className="flex-1">
                  <Text className="text-on-surface font-extrabold text-sm" numberOfLines={1}>
                    Phone Text Editor
                  </Text>
                  <Text className="text-on-surface-variant text-[11px]" numberOfLines={1}>
                    Notes, Keep, or Files
                  </Text>
                </View>
              </View>
            </GlassCard>

            {/* GENERAL SHARE SYSTEM SHEET */}
            <GlassCard
              onPress={() => handleShareSystem()}
              interactive
              style={{ flexBasis: '48%', flexGrow: 1 }}
              className="p-3.5 gap-2"
            >
              <View className="flex-row items-center gap-2.5">
                <View className="w-9 h-9 rounded-xl bg-violet-500/15 items-center justify-center">
                  <Ionicons name="share-social-outline" size={18} color="#A78BFA" />
                </View>
                <View className="flex-1">
                  <Text className="text-on-surface font-extrabold text-sm" numberOfLines={1}>
                    System Share Sheet
                  </Text>
                  <Text className="text-on-surface-variant text-[11px]" numberOfLines={1}>
                    AirDrop, Mail, or More
                  </Text>
                </View>
              </View>
            </GlassCard>
          </View>
        </View>
      </View>
    </GlassModal>
  );
}
