import { CustomColorPickerModal } from "@/components/custom-color-picker-modal";
import { CustomStyledQRCode } from "@/components/ui/custom-styled-qr-code";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassShimmer } from "@/components/ui/glass-shimmer";
import { CinematicPresets, PresetId } from "@/constants/theme";
import { Typography } from "@/constants/theme/typography";
import { useTheme } from "@/hooks/use-theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused, useRouter } from "expo-router";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const HERO_STATS = [
  { value: "6+", label: "QR Types" },
  { value: "Vector", label: "SVG & HD Export" },
  { value: "100%", label: "Private & Local" },
];

const PRESET_QUICK_CHOICES: PresetId[] = [
  "plum-editorial",
  "ocean-blue",
  "aurora",
  "luxury-gold",
  "sunset",
  "lavender",
  "emerald-mint",
  "cyber-violet",
  "terracotta-fire",
];

const isColorLight = (hex: string): boolean => {
  const c = hex.replace('#', '');
  if (c.length === 3) {
    const r = parseInt(c[0] + c[0], 16);
    const g = parseInt(c[1] + c[1], 16);
    const b = parseInt(c[2] + c[2], 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 175;
  }
  if (c.length === 6) {
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 175;
  }
  return false;
};

const QUICK_PALETTE_HUES = [
  { color: "#FFFFFF", name: "Pure White" },
  { color: "#4A0F3A", name: "Plum" },
  { color: "#1A2A56", name: "Navy" },
  { color: "#1B3B2B", name: "Forest" },
  { color: "#059669", name: "Emerald" },
  { color: "#2563EB", name: "Royal" },
  { color: "#7C3AED", name: "Amethyst" },
  { color: "#EA580C", name: "Flame" },
  { color: "#DC2626", name: "Crimson" },
  { color: "#D97706", name: "Amber" },
  { color: "#1A1416", name: "Deep Ink" },
  { color: "#000000", name: "Jet Black" },
];

const PresetSwatchItem = memo(
  ({
    presetId,
    isSelected,
    onSelect,
  }: {
    presetId: PresetId;
    isSelected: boolean;
    onSelect: (id: PresetId) => void;
  }) => {
    const preset = useMemo(
      () => CinematicPresets.find((p) => p.id === presetId),
      [presetId],
    );
    if (!preset) return null;

    const handlePress = useCallback(() => {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      onSelect(presetId);
    }, [onSelect, presetId]);

    return (
      <Pressable
        onPress={handlePress}
        hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
        accessibilityLabel={`Select ${preset.name} theme`}
        accessibilityRole="button"
        style={({ pressed }) => ({
          opacity: pressed ? 0.75 : 1,
        })}
        className="items-center"
      >
        <View
          style={{
            backgroundColor: preset.accentColor,
            borderColor: isSelected ? "#380B2C" : "rgba(0,0,0,0.18)",
            borderWidth: isSelected ? 2.5 : 1.5,
          }}
          className="w-7 h-7 rounded-none items-center justify-center"
        >
          {isSelected && (
            <Ionicons name="checkmark" size={13} color="#FFFFFF" />
          )}
        </View>
      </Pressable>
    );
  },
);
PresetSwatchItem.displayName = "PresetSwatchItem";

export const HomeHeroCard: React.FC = memo(() => {
  const router = useRouter();
  const { colors } = useTheme();
  const [selectedPresetId, setSelectedPresetId] =
    useState<PresetId | null>("plum-editorial");
  const [customColor, setCustomColor] = useState<string | null>(null);
  const [showCustomPicker, setShowCustomPicker] = useState<boolean>(false);

  const handleNavigateStudio = useCallback(() => {
    router.navigate({
      pathname: "/studio",
      params: {
        ...(selectedPresetId ? { initialPreset: selectedPresetId } : {}),
        ...(customColor ? { initialColor: customColor } : {}),
      },
    });
  }, [router, selectedPresetId, customColor]);

  const handleNavigateExplore = useCallback(
    () => router.navigate("/explore"),
    [router],
  );

  const handleSelectPreset = useCallback((id: PresetId) => {
    setSelectedPresetId(id);
    setCustomColor(null);
  }, []);

  const handleSelectCustomColor = useCallback((color: string) => {
    setCustomColor(color);
    setSelectedPresetId(null);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  }, []);

  const handleToggleCustomPicker = useCallback(() => {
    setShowCustomPicker((prev) => !prev);
    if (Platform.OS !== "web") {
      Haptics.selectionAsync().catch(() => {});
    }
  }, []);

  const activePreset = useMemo(() => {
    if (selectedPresetId) {
      return (
        CinematicPresets.find((p) => p.id === selectedPresetId) ??
        CinematicPresets[0]
      );
    }
    return CinematicPresets[0];
  }, [selectedPresetId]);

  const effectiveColor = customColor ?? activePreset.qrColor;
  const effectiveGlow = customColor
    ? `${customColor}33`
    : activePreset.glowColor || "rgba(74, 15, 58, 0.12)";
  const styleTitle = customColor
    ? "Custom Tint Style"
    : `${activePreset.name} Style`;

  const glowPulse = useSharedValue(0.6);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      cancelAnimation(glowPulse);
      return;
    }

    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.6, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );

    return () => {
      cancelAnimation(glowPulse);
    };
  }, [isFocused, glowPulse]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowPulse.value,
    transform: [{ scale: 0.95 + glowPulse.value * 0.08 }],
  }));

  const qrCodeElement = useMemo(
    () => (
      <CustomStyledQRCode
        value="https://qrlab.me/pro-studio"
        size={Math.min(width * 0.48, 190)}
        color={effectiveColor}
        backgroundColor="#FFFFFF"
        moduleShape="rounded"
        eyeStyle="rounded"
      />
    ),
    [effectiveColor],
  );

  return (
    <View className="w-full my-2 gap-6">
      {/* Top Headline & Eyebrow Section */}
      <Animated.View
        entering={FadeInDown.duration(500).springify()}
        className="gap-3"
      >
        <Text className="text-ink-muted text-sm font-normal tracking-tight">
          Create something,
        </Text>

        <View>
          <Text
            style={{ fontFamily: Typography.serifFamily, letterSpacing: -0.6 }}
            className="text-ink text-[38px] font-bold leading-[44px]"
          >
            Make QR codes,
          </Text>
          <Text
            style={{
              fontFamily: Typography.serifFamily,
              fontStyle: "italic",
              letterSpacing: -0.6,
            }}
            className="text-plum text-[38px] font-normal italic leading-[44px]"
          >
            beautifully.
          </Text>
        </View>

        <Text className="text-ink-muted text-sm leading-6 max-w-[440px]">
          Craft high-converting, on-brand QR codes with live interactive
          preview, custom shapes, embedded logos, and instant vector export.
        </Text>

        <View className="flex-row flex-wrap gap-3 mt-1">
          <GlassButton
            title="Create QR Now"
            icon="sparkles"
            iconPosition="right"
            variant="primary"
            onPress={handleNavigateStudio}
          />

          <GlassButton
            title="Explore Templates"
            icon="grid-outline"
            variant="secondary"
            onPress={handleNavigateExplore}
          />
        </View>
        {/* Stats Strip */}
        <View
          style={{ borderColor: "rgba(74, 15, 58, 0.08)" }}
          className="flex-row items-center mt-2 pt-2 border-t"
        >
          {HERO_STATS.map((stat, index) => (
            <View key={stat.label} className="flex-row items-center">
              {index > 0 && (
                <View
                  style={{ backgroundColor: "rgba(74, 15, 58, 0.08)" }}
                  className="w-px h-7 mx-3"
                />
              )}
              <View>
                <Text className="text-ink text-base font-bold">
                  {stat.value}
                </Text>
                <Text className="text-ink-muted text-[11px] font-medium">
                  {stat.label}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Floating Interactive Live QR Card */}
      <Animated.View
        entering={FadeInUp.duration(600).delay(150).springify()}
        className="items-center justify-center my-2"
      >
        <View className="items-center justify-center w-full">
          {/* Animated Glow Aura */}
          <Animated.View
            style={[styles.heroGlow, glowStyle]}
            pointerEvents="none"
          >
            <LinearGradient
              colors={[effectiveGlow, "transparent"]}
              style={styles.heroGlowFill}
              start={{ x: 0.5, y: 0.5 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>

          <GlassCard className="w-full max-w-[380px] p-6 items-center" hasGlow>
            <GlassShimmer />
            {/* QR Code Container with Active Preset Colors */}
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "rgba(74, 15, 58, 0.08)",
              }}
              className="p-5 rounded-[24px] mb-4 border items-center justify-center shadow-sm"
            >
              {qrCodeElement}
            </View>

            <Text className="text-ink text-base font-bold text-center">
              {styleTitle}
            </Text>
            <Text className="text-ink-muted text-xs mt-0.5 text-center">
              Tap a preset below or pick a custom tint in real-time
            </Text>

            {/* Interactive Theme Swatch Bar */}
            <View
              style={{ borderColor: "rgba(74, 15, 58, 0.08)" }}
              className="mt-4 pt-3 border-t w-full"
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  alignItems: "center",
                  justifyContent: "center",
                  flexGrow: 1,
                  gap: 8,
                  paddingHorizontal: 4,
                }}
              >
                {PRESET_QUICK_CHOICES.map((id) => (
                  <PresetSwatchItem
                    key={id}
                    presetId={id}
                    isSelected={selectedPresetId === id}
                    onSelect={handleSelectPreset}
                  />
                ))}

                {/* Custom Color Picker Swatch Button */}
                <Pressable
                  onPress={handleToggleCustomPicker}
                  hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                  accessibilityLabel="Toggle custom color palette"
                  accessibilityRole="button"
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.75 : 1,
                  })}
                  className="items-center"
                >
                  <LinearGradient
                    colors={["#DC2626", "#EA580C", "#CA8A04", "#059669", "#2563EB", "#7C3AED"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderColor: customColor || showCustomPicker ? "#380B2C" : "rgba(0,0,0,0.18)",
                      borderWidth: customColor || showCustomPicker ? 2.5 : 1.5,
                    }}
                    className="w-7 h-7 rounded-none items-center justify-center"
                  >
                    <Ionicons
                      name={showCustomPicker ? "close" : "color-palette"}
                      size={13}
                      color="#FFFFFF"
                    />
                  </LinearGradient>
                </Pressable>
              </ScrollView>
            </View>
          </GlassCard>

          {/* Custom Color Studio Modal with Live Interactive QR Code */}
          <CustomColorPickerModal
            visible={showCustomPicker}
            onClose={() => setShowCustomPicker(false)}
            selectedColor={effectiveColor}
            onSelectColor={handleSelectCustomColor}
            payloadValue="https://qrlab.me/pro-studio"
            presetId={selectedPresetId || "plum-editorial"}
          />
        </View>
      </Animated.View>
    </View>
  );
});

HomeHeroCard.displayName = "HomeHeroCard";

const styles = StyleSheet.create({
  heroGlow: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    zIndex: -1,
  },
  heroGlowFill: {
    width: "100%",
    height: "100%",
    borderRadius: 170,
  },
});
