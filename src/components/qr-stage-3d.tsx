import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from "expo-haptics";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CustomStyledQRCode } from "@/components/ui/custom-styled-qr-code";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { GlassBadge } from "@/components/ui/glass-badge";
import { GlassShimmer } from "@/components/ui/glass-shimmer";
import {
  CinematicPresets,
  Palette,
  PresetId,
  SpringConfigs,
} from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { CustomizationOptions } from "@/types/qr";

const { width } = Dimensions.get("window");
const STAGE_SIZE = Math.min(width * 0.85, 340);

interface QRStage3DProps {
  value: string;
  presetId: PresetId;
  qrRef: React.RefObject<unknown>;
  title?: string;
  typeLabel?: string;
  onExport?: () => void;
  fgColor?: string;
  options?: CustomizationOptions;
}

export const QRStage3D = React.memo(function QRStage3D({
  value,
  presetId,
  qrRef,
  title = "QRLab Code",
  typeLabel = "URL Link",
  onExport: _onExport,
  fgColor,
  options,
}: QRStage3DProps) {
  const { colors } = useTheme();
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useSharedValue(0);

  const currentPreset =
    CinematicPresets.find((p) => p.id === presetId) || CinematicPresets[0];

  const effectiveQrColor = fgColor || options?.fgColor || currentPreset.qrColor || '#4A0F3A';
  const showLogo = options?.logo && options.logo !== 'none';
  const logoRadius =
    options?.eyeStyle === 'circle'
      ? 9999
      : options?.eyeStyle === 'square'
      ? 0
      : 8;

  const qrContainerRadius =
    options?.eyeStyle === 'circle'
      ? 'rounded-full overflow-hidden aspect-square'
      : options?.eyeStyle === 'square'
      ? 'rounded-none'
      : 'rounded-[24px] overflow-hidden';

  const handleFlip = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
    setIsFlipped((prev) => {
      const nextState = !prev;
      flipAnim.value = withSpring(nextState ? 1 : 0, SpringConfigs.flip);
      return nextState;
    });
  }, [flipAnim]);

  const handleSetQrRef = useCallback(
    (ref: unknown) => {
      if (qrRef) {
        const targetRef = qrRef as React.MutableRefObject<unknown>;
        targetRef.current = ref;
      }
    },
    [qrRef]
  );

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnim.value, [0, 1], [0, 180]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden",
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnim.value, [0, 1], [180, 360]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden",
    };
  });

  const validValue = value.trim() || "https://qrlab.me/business-pro";

  return (
    <View className="items-center justify-center my-4 relative">
      {/* Soft Ambient Background Glow in warm peach */}
      <View
        className="absolute w-80 h-80 rounded-full -z-10"
        style={{ backgroundColor: '#F7B9A5', opacity: 0.22 }}
      />

      <View style={{ width: STAGE_SIZE, height: STAGE_SIZE + 90 }}>
        {/* FRONT SIDE */}
        <Animated.View
          pointerEvents={isFlipped ? "none" : "auto"}
          style={[
            frontAnimatedStyle,
            styles.stageShadow,
            { backgroundColor: '#FFFFFF', borderColor: 'rgba(74, 15, 58, 0.06)', borderWidth: 1 },
          ]}
          className="absolute w-full h-full rounded-[28px] overflow-hidden p-6 justify-between"
        >
          {/* Top Bar */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Ionicons name="qr-code-outline" size={18} color="#4A0F3A" />
              <Text className="text-ink text-base font-bold">
                {title}
              </Text>
            </View>
            <Pressable
              accessibilityLabel="Flip card to view code metadata"
              accessibilityRole="button"
              onPress={handleFlip}
              style={{ backgroundColor: '#FDF6F2', borderColor: 'rgba(74, 15, 58, 0.08)', borderWidth: 1 }}
              className="flex-row items-center gap-1 px-3 py-1.5 rounded-full overflow-hidden relative active:opacity-70"
            >
              <Ionicons
                name="sync-outline"
                size={14}
                color={Palette.inkMuted}
              />
            </Pressable>
          </View>

          {/* QR Code Container */}
          <View
            style={{ borderColor: 'rgba(74, 15, 58, 0.06)', borderWidth: 1, boxShadow: '0px 4px 16px rgba(74, 15, 58, 0.04)' }}
            className={`self-center bg-white p-5 ${qrContainerRadius} relative`}
          >
            <CustomStyledQRCode
              value={validValue}
              size={STAGE_SIZE * 0.55}
              color={effectiveQrColor}
              backgroundColor={options?.bgColor || "#FFFFFF"}
              moduleShape={options?.moduleShape || 'rounded'}
              eyeStyle={options?.eyeStyle || 'rounded'}
              logoPreset={options?.logo}
              getRef={handleSetQrRef}
              quietZone={options?.moduleShape === 'dots' ? 4 : options?.moduleShape === 'rounded' ? 2 : 0}
              {...(showLogo
                ? {
                    logoSize: STAGE_SIZE * 0.14,
                    logoBackgroundColor: "#FFFFFF",
                    logoMargin: 2,
                    logoRadius,
                    ecl: "H",
                  }
                : { ecl: "M" })}
            />
          </View>

          {/* Details & Payload */}
          <View className="items-center gap-1 mb-4">
            <GlassBadge label={typeLabel.toUpperCase()} variant="primary" />
            <Text
              className="text-on-surface-variant text-xs font-medium max-w-[260px]"
              numberOfLines={1}
            >
              {validValue}
            </Text>
          </View>
        </Animated.View>

        {/* BACK SIDE (METADATA) */}
        <Animated.View
          pointerEvents={isFlipped ? "auto" : "none"}
          style={[
            backAnimatedStyle,
            { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
          ]}
          className="absolute w-full h-full rounded-4xl overflow-hidden p-6 justify-between shadow-sm"
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-on-surface text-base font-bold">
              Code Intelligence
            </Text>
            <Pressable
              accessibilityLabel="Flip card to view QR code"
              accessibilityRole="button"
              onPress={handleFlip}
              style={{ backgroundColor: colors.secondaryBackground, borderColor: colors.border, borderWidth: 1 }}
              className="flex-row items-center gap-1 px-3 py-1.5 rounded-full overflow-hidden relative active:opacity-70"
            >
              <Ionicons
                name="sync-outline"
                size={14}
                color={colors.secondaryText}
              />
              <Text className="text-on-surface-variant text-xs font-semibold">
                QR Stage
              </Text>
            </Pressable>
          </View>

          <View className="flex-1 justify-center gap-2 my-2">
            <View className="flex-row justify-between items-center pb-1">
              <Text className="text-on-surface-variant text-xs">Active Theme</Text>
              <Text className="text-xs font-bold" style={{ color: currentPreset.accentColor }}>
                {currentPreset.name}
              </Text>
            </View>
            <View className="flex-row justify-between items-center pb-1">
              <Text className="text-on-surface-variant text-xs">Module Shape</Text>
              <Text className="text-on-surface text-xs font-bold uppercase">
                {options?.moduleShape || 'ROUNDED'}
              </Text>
            </View>
            <View className="flex-row justify-between items-center pb-1">
              <Text className="text-on-surface-variant text-xs">Eye Style</Text>
              <Text className="text-on-surface text-xs font-bold uppercase">
                {options?.eyeStyle || 'ROUNDED'}
              </Text>
            </View>
            <View className="flex-row justify-between items-center pb-1">
              <Text className="text-on-surface-variant text-xs">Center Badge</Text>
              <Text className="text-on-surface text-xs font-bold uppercase">
                {options?.logo || 'NONE'}
              </Text>
            </View>
            <View className="flex-row justify-between items-center pb-1">
              <Text className="text-on-surface-variant text-xs">Payload Type</Text>
              <Text className="text-on-surface text-xs font-bold">{typeLabel}</Text>
            </View>

            <View
              style={{ backgroundColor: colors.glassSurfaceSubtle }}
              className="p-3 rounded-2xl mt-1"
            >
              <Text className="text-on-surface-variant text-[10px] font-bold tracking-widest mb-1">
                DATA PAYLOAD
              </Text>
              <Text
                className="text-accent text-xs font-mono"
                numberOfLines={2}
              >
                {validValue}
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  stageShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#4A0F3A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0px 8px 24px rgba(74, 15, 58, 0.08)',
      },
    }),
  },
});


