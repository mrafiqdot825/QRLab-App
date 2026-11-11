import { CustomStyledQRCode } from "@/components/ui/custom-styled-qr-code";
import { CinematicPresets, Palette, PresetId } from "@/constants/theme";
import { CustomizationOptions } from "@/types/qr";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export const isColorLight = (hex: string): boolean => {
  const c = hex.replace("#", "");
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

export const ALL_STUDIO_COLORS = [
  // Row 1: Neutrals & Whites & Blacks
  { color: "#FFFFFF", name: "Pure White" },
  { color: "#F8FAFC", name: "Snow" },
  { color: "#E2E8F0", name: "Light Slate" },
  { color: "#94A3B8", name: "Muted Gray" },
  { color: "#64748B", name: "Slate" },
  { color: "#334155", name: "Charcoal" },
  { color: "#1A1416", name: "Deep Ink" },
  { color: "#000000", name: "Jet Black" },

  // Row 2: Soft Pastels & Light Tints
  { color: "#FECDD3", name: "Blush Rose" },
  { color: "#FED7AA", name: "Warm Peach" },
  { color: "#FEF08A", name: "Butter Yellow" },
  { color: "#D9F99D", name: "Lime Mist" },
  { color: "#A7F3D0", name: "Sage Pastel" },
  { color: "#BAE6FD", name: "Baby Blue" },
  { color: "#DDD6FE", name: "Soft Lilac" },
  { color: "#E9D5FF", name: "Lavender Mist" },

  // Row 3: Vivid Pure Spectrum Hues
  { color: "#EF4444", name: "Vibrant Red" },
  { color: "#F97316", name: "Vivid Orange" },
  { color: "#F59E0B", name: "Warm Amber" },
  { color: "#EAB308", name: "Golden Yellow" },
  { color: "#84CC16", name: "Bright Lime" },
  { color: "#22C55E", name: "Vibrant Green" },
  { color: "#10B981", name: "Emerald Green" },
  { color: "#06B6D4", name: "Electric Cyan" },

  // Row 4: Sky & Deep Ocean Blues
  { color: "#0EA5E9", name: "Sky Blue" },
  { color: "#3B82F6", name: "Electric Blue" },
  { color: "#2563EB", name: "Royal Blue" },
  { color: "#1D4ED8", name: "Cobalt Blue" },
  { color: "#1E40AF", name: "Pacific Deep" },
  { color: "#1E3A8A", name: "Midnight Navy" },
  { color: "#0F766E", name: "Ocean Teal" },
  { color: "#115E59", name: "Deep Pine" },

  // Row 5: Violets, Plums & Pinks
  { color: "#6366F1", name: "Indigo" },
  { color: "#8B5CF6", name: "Electric Violet" },
  { color: "#A855F7", name: "Bright Purple" },
  { color: "#D946EF", name: "Fuchsia" },
  { color: "#EC4899", name: "Hot Pink" },
  { color: "#F43F5E", name: "Rose Red" },
  { color: "#4A0F3A", name: "Morrow Plum" },
  { color: "#380B2C", name: "Rich Berry" },

  // Row 6: Luxury Jewels, Crimson & Earth
  { color: "#78350F", name: "Warm Bronze" },
  { color: "#9A3412", name: "Burnt Terracotta" },
  { color: "#B91C1C", name: "Crimson Red" },
  { color: "#881337", name: "Burgundy Wine" },
  { color: "#581C87", name: "Royal Amethyst" },
  { color: "#1B3B2B", name: "Forest Moss" },
  { color: "#064E3B", name: "Dark Emerald" },
  { color: "#0F172A", name: "Midnight Slate" },
];

export const getColorName = (hex: string): string => {
  const match = ALL_STUDIO_COLORS.find(
    (c) => c.color.toUpperCase() === hex.toUpperCase(),
  );
  return match ? match.name : "Custom Tint";
};

export const interpolateSpectrumColor = (t: number): string => {
  const clamped = Math.max(0, Math.min(1, t));
  const stops = [
    { pos: 0.0, r: 255, g: 0, b: 0 }, // Red
    { pos: 0.1, r: 255, g: 128, b: 0 }, // Orange
    { pos: 0.2, r: 255, g: 255, b: 0 }, // Yellow
    { pos: 0.32, r: 0, g: 255, b: 0 }, // Green
    { pos: 0.44, r: 0, g: 255, b: 255 }, // Cyan
    { pos: 0.54, r: 0, g: 128, b: 255 }, // Azure
    { pos: 0.64, r: 0, g: 0, b: 255 }, // Blue
    { pos: 0.74, r: 128, g: 0, b: 255 }, // Purple
    { pos: 0.82, r: 255, g: 0, b: 255 }, // Magenta
    { pos: 0.92, r: 255, g: 255, b: 255 }, // Pure White
    { pos: 1.0, r: 26, g: 20, b: 22 }, // Deep Ink
  ];

  for (let i = 0; i < stops.length - 1; i++) {
    const s1 = stops[i];
    const s2 = stops[i + 1];
    if (clamped >= s1.pos && clamped <= s2.pos) {
      const segmentRatio = (clamped - s1.pos) / (s2.pos - s1.pos);
      const r = Math.round(s1.r + (s2.r - s1.r) * segmentRatio);
      const g = Math.round(s1.g + (s2.g - s1.g) * segmentRatio);
      const b = Math.round(s1.b + (s2.b - s1.b) * segmentRatio);
      const toHex = (n: number) =>
        n.toString(16).padStart(2, "0").toUpperCase();
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
  }
  return "#4A0F3A";
};

export interface CustomColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedColor?: string;
  onSelectColor: (color: string) => void;
  payloadValue?: string;
  customOpts?: CustomizationOptions;
  presetId?: PresetId;
  onSelectPreset?: (id: PresetId) => void;
}

export const CustomColorPickerModal: React.FC<CustomColorPickerModalProps> =
  memo(
    ({
      visible,
      onClose,
      selectedColor = "#4A0F3A",
      onSelectColor,
      payloadValue = "https://qrlab.me/studio",
      customOpts,
      presetId = "plum-editorial",
      onSelectPreset,
    }) => {
      // Local activeColor state gives instant 0ms latency in the modal preview
      const [activeColor, setActiveColor] = useState<string>(
        selectedColor || "#4A0F3A",
      );
      const [hexInput, setHexInput] = useState<string>(
        selectedColor || "#4A0F3A",
      );
      const [spectrumWidth, setSpectrumWidth] = useState<number>(320);
      const [customHistory, setCustomHistory] = useState<string[]>([
        selectedColor || "#4A0F3A",
        "#FFFFFF",
        "#2563EB",
        "#059669",
        "#DC2626",
      ]);

      // Sync activeColor & hexInput whenever modal opens or selectedColor prop updates
      useEffect(() => {
        if (visible) {
          const color = selectedColor || "#4A0F3A";
          setActiveColor(color);
          setHexInput(color);
        }
      }, [visible, selectedColor]);

      const isValidHex = useMemo(() => {
        const formatted = hexInput.startsWith("#") ? hexInput : `#${hexInput}`;
        return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(formatted);
      }, [hexInput]);

      const handlePickColor = useCallback(
        (color: string) => {
          if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
              () => {},
            );
          }
          const upper = color.toUpperCase();
          setActiveColor(upper);
          setHexInput(upper);
          onSelectColor(upper);

          setCustomHistory((prev) => {
            if (prev.includes(upper)) return prev;
            return [upper, ...prev.slice(0, 7)];
          });
        },
        [onSelectColor],
      );

      const handleApplyHex = useCallback(() => {
        if (!isValidHex) return;
        const formatted = hexInput.startsWith("#")
          ? hexInput.toUpperCase()
          : `#${hexInput.toUpperCase()}`;
        handlePickColor(formatted);
      }, [hexInput, isValidHex, handlePickColor]);

      const handleSpectrumTouch = useCallback(
        (e: any) => {
          const locX = e.nativeEvent?.locationX ?? e.nativeEvent?.offsetX;
          if (typeof locX === "number" && spectrumWidth > 0) {
            const ratio = Math.max(0, Math.min(1, locX / spectrumWidth));
            const color = interpolateSpectrumColor(ratio);
            handlePickColor(color);
          }
        },
        [spectrumWidth, handlePickColor],
      );

      const handleSpectrumPointer = useCallback(
        (e: any) => {
          if (Platform.OS === "web") {
            const locX = e.nativeEvent?.offsetX ?? e.nativeEvent?.locationX;
            if (typeof locX === "number" && spectrumWidth > 0) {
              const ratio = Math.max(0, Math.min(1, locX / spectrumWidth));
              const color = interpolateSpectrumColor(ratio);
              handlePickColor(color);
            }
          }
        },
        [spectrumWidth, handlePickColor],
      );

      const isCurrentColorLight = isColorLight(activeColor);
      const activeColorName = getColorName(activeColor);

      if (!visible) return null;

      return (
        <Modal
          transparent
          visible={visible}
          onRequestClose={onClose}
          animationType="fade"
        >
          <View className="flex-1 justify-end sm:justify-center items-center relative">
            {/* Backdrop Scrim */}
            <Pressable
              accessibilityLabel="Close modal overlay"
              accessibilityRole="button"
              onPress={onClose}
              className="absolute inset-0 bg-black/60"
            />

            {/* Modal Dialog Card with definite height for flex children */}
            <View
              style={{
                backgroundColor: "#FBEDE6",
                borderColor: "#380B2C",
                borderWidth: 1.5,
                height: Platform.OS === "web" ? 740 : "88%",
                maxHeight: 760,
                width: "100%",
                maxWidth: 520,
              }}
              className="rounded-none overflow-hidden relative shadow-2xl flex-col"
            >
              {/* Modal Header */}
              <View
                style={{
                  borderColor: "rgba(74, 15, 58, 0.15)",
                  backgroundColor: "#FFFFFF",
                }}
                className="flex-row items-center justify-between px-5 py-3 border-b"
              >
                <View className="flex-row items-center gap-2.5">
                  <View
                    style={{
                      backgroundColor: "#380B2C",
                      borderColor: "#380B2C",
                    }}
                    className="w-7 h-7 rounded-none items-center justify-center border"
                  >
                    <Ionicons name="color-palette" size={15} color="#FFFFFF" />
                  </View>
                  <View>
                    <Text className="text-ink text-sm font-bold tracking-tight">
                      Custom Color Studio
                    </Text>
                    <Text className="text-ink-muted text-[10px]">
                      Live Interactive QR Preview
                    </Text>
                  </View>
                </View>

                <Pressable
                  accessibilityLabel="Close color studio"
                  accessibilityRole="button"
                  onPress={onClose}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={{
                    backgroundColor: "#FDF6F2",
                    borderColor: "rgba(74, 15, 58, 0.2)",
                    borderWidth: 1.5,
                  }}
                  className="w-7 h-7 rounded-none items-center justify-center active:opacity-75"
                >
                  <Ionicons name="close" size={16} color="#1A1416" />
                </Pressable>
              </View>

              {/* LIVE QR CODE HERO PREVIEW (PINNED AT TOP) */}
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "rgba(74, 15, 58, 0.12)",
                }}
                className="items-center justify-center py-3 px-5 border-b"
              >
                {/* Glow aura behind QR */}
                <View
                  style={{
                    position: "absolute",
                    width: 140,
                    height: 140,
                    borderRadius: 70,
                    backgroundColor: `${activeColor}22`,
                  }}
                />

                {/* White Container Box */}
                <View
                  style={{
                    backgroundColor: customOpts?.bgColor || "#FFFFFF",
                    borderColor: "rgba(74, 15, 58, 0.18)",
                    borderWidth: 1.5,
                  }}
                  className="p-2.5 rounded-none items-center justify-center shadow-xs"
                >
                  <CustomStyledQRCode
                    value={payloadValue || "https://qrlab.me/studio"}
                    size={Platform.OS === "web" ? 115 : 105}
                    color={activeColor}
                    backgroundColor={customOpts?.bgColor || "#FFFFFF"}
                    moduleShape={customOpts?.moduleShape || "rounded"}
                    eyeStyle={customOpts?.eyeStyle || "rounded"}
                    logoPreset={customOpts?.logoPreset || "none"}
                    logo={customOpts?.logo}
                    logoSize={customOpts?.logoSize}
                    quietZone={customOpts?.quietZone ?? 0}
                    ecl={customOpts?.errorCorrection || "H"}
                  />
                </View>

                {/* Active Color Indicator Bar */}
                <View className="flex-row items-center gap-2 mt-2">
                  <View
                    style={{
                      backgroundColor: activeColor,
                      borderColor: isCurrentColorLight
                        ? "rgba(0,0,0,0.3)"
                        : "rgba(0,0,0,0.15)",
                      borderWidth: 1.5,
                    }}
                    className="w-4 h-4 rounded-none shadow-2xs"
                  />
                  <Text className="text-ink text-xs font-mono font-bold tracking-wider">
                    {activeColor.toUpperCase()}
                  </Text>
                  <Text className="text-ink-muted text-[11px] font-medium">
                    • {activeColorName}
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#ECFDF5",
                      borderColor: "#059669",
                      borderWidth: 1,
                    }}
                    className="px-1.5 py-0.2 rounded-none ml-1 flex-row items-center gap-1"
                  >
                    <View className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <Text className="text-[9px] font-bold text-emerald-800 tracking-wider">
                      LIVE
                    </Text>
                  </View>
                </View>
              </View>

              {/* SCROLLABLE COLOR CONTROLS */}
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                  padding: 16,
                  gap: 14,
                }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* 1. COMPREHENSIVE COLOR PALETTE GRID (ALL 48 COLORS) */}
                <View className="gap-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                      All Studio Colors ({ALL_STUDIO_COLORS.length}):
                    </Text>
                    <Text className="text-plum text-[10px] font-semibold">
                      Tap any to preview live
                    </Text>
                  </View>

                  <View className="flex-row flex-wrap gap-2 justify-between">
                    {ALL_STUDIO_COLORS.map((item) => {
                      const isCurrent =
                        (activeColor || "").toUpperCase() ===
                        item.color.toUpperCase();
                      const isLight = isColorLight(item.color);
                      return (
                        <Pressable
                          key={item.color}
                          accessibilityRole="button"
                          accessibilityLabel={`Pick ${item.name} (${item.color})`}
                          onPress={() => handlePickColor(item.color)}
                          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                          style={({ pressed }) => ({
                            opacity: pressed ? 0.75 : 1,
                          })}
                        >
                          <View
                            style={{
                              backgroundColor: item.color,
                              borderColor: isCurrent
                                ? "#380B2C"
                                : isLight
                                ? "rgba(0,0,0,0.25)"
                                : "rgba(0,0,0,0.15)",
                              borderWidth: isCurrent ? 2.5 : 1.5,
                              width: 32,
                              height: 32,
                            }}
                            className="rounded-none items-center justify-center shadow-2xs"
                          >
                            {isCurrent && (
                              <Ionicons
                                name="checkmark"
                                size={15}
                                color={isLight ? "#380B2C" : "#FFFFFF"}
                              />
                            )}
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* 2. CONTINUOUS SPECTRUM SLIDER (HOVER & DRAG ANY COLOR) */}
                <View className="gap-1.5 pt-1 border-t border-black/5">
                  <View className="flex-row items-center justify-between gap-1">
                    <Text className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider shrink-0">
                      Spectrum Mixer:
                    </Text>
                    <Text
                      className="text-plum text-[10px] font-semibold shrink text-right"
                      numberOfLines={1}
                    >
                      Drag or tap across all hues
                    </Text>
                  </View>
                  <View
                    onLayout={(e) =>
                      setSpectrumWidth(e.nativeEvent.layout.width)
                    }
                    onStartShouldSetResponder={() => true}
                    onMoveShouldSetResponder={() => true}
                    onResponderGrant={handleSpectrumTouch}
                    onResponderMove={handleSpectrumTouch}
                    {...Platform.select({
                      web: {
                        onPointerDown: handleSpectrumPointer,
                        onPointerMove: (e: any) => {
                          handleSpectrumPointer(e);
                        },
                      },
                      default: {},
                    })}
                    style={{
                      height: 32,
                      borderWidth: 1.5,
                      borderColor: "#380B2C",
                      // @ts-ignore
                      cursor: "crosshair",
                    }}
                    className="w-full rounded-none overflow-hidden relative justify-center"
                  >
                    <LinearGradient
                      colors={[
                        "#FF0000",
                        "#FF7F00",
                        "#FFFF00",
                        "#00FF00",
                        "#00FFFF",
                        "#007FFF",
                        "#0000FF",
                        "#7F00FF",
                        "#FF00FF",
                        "#FFFFFF",
                        "#1A1416",
                      ]}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={StyleSheet.absoluteFill}
                    />
                  </View>
                </View>

                {/* 3. HEX INPUT ROW WITH LIVE VALID / INVALID BADGE */}
                <View className="gap-1.5">
                  <View className="flex-row items-center justify-between gap-2">
                    <Text className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                      Hex Input & Validator:
                    </Text>

                    {/* VALID / INVALID BADGE */}
                    <View
                      style={{
                        backgroundColor: isValidHex ? "#ECFDF5" : "#FEF2F2",
                        borderColor: isValidHex ? "#059669" : "#DC2626",
                        borderWidth: 1.5,
                      }}
                      className="flex-row items-center gap-1 px-2.5 py-0.5 rounded-none shadow-2xs shrink-0"
                    >
                      <Ionicons
                        name={isValidHex ? "checkmark-circle" : "close-circle"}
                        size={12}
                        color={isValidHex ? "#059669" : "#DC2626"}
                      />
                      <Text
                        style={{
                          color: isValidHex ? "#065F46" : "#991B1B",
                          fontWeight: "800",
                          letterSpacing: 0.5,
                          fontSize: 9,
                        }}
                      >
                        {isValidHex ? "VALID HEX" : "INVALID"}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <View
                      style={{
                        borderColor: isValidHex
                          ? "#380B2C"
                          : "rgba(74, 15, 58, 0.22)",
                        backgroundColor: "#FFFFFF",
                        borderWidth: 1.5,
                      }}
                      className="flex-1 min-w-0 flex-row items-center px-2.5 py-2 rounded-none"
                    >
                      <View
                        style={{
                          backgroundColor: isValidHex
                            ? hexInput.startsWith("#")
                              ? hexInput
                              : `#${hexInput}`
                            : activeColor,
                          borderColor: "rgba(0,0,0,0.15)",
                          borderWidth: 1,
                        }}
                        className="w-4 h-4 rounded-none mr-2 shrink-0"
                      />
                      <TextInput
                        value={hexInput.replace("#", "")}
                        onChangeText={(text) => {
                          const formatted = text
                            .replace(/[^0-9A-Fa-f]/g, "")
                            .slice(0, 6);
                          const withHash = `#${formatted}`;
                          setHexInput(withHash);
                          // Auto update live color if full 6-digit hex
                          if (formatted.length === 6) {
                            handlePickColor(withHash.toUpperCase());
                          }
                        }}
                        placeholder="4A0F3A"
                        placeholderTextColor="rgba(26, 20, 22, 0.4)"
                        maxLength={6}
                        autoCapitalize="characters"
                        className="flex-1 text-ink font-mono font-bold text-xs p-0"
                      />
                    </View>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Apply custom hex color"
                      onPress={handleApplyHex}
                      disabled={!isValidHex}
                      hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                      style={{
                        backgroundColor: isValidHex ? "#380B2C" : "#F3E5DE",
                        borderColor: isValidHex
                          ? "#380B2C"
                          : "rgba(74, 15, 58, 0.1)",
                        borderWidth: 1.5,
                      }}
                      className="px-4 py-2 rounded-none flex-row items-center justify-center gap-1.5 active:opacity-85 shadow-xs shrink-0"
                    >
                      {isValidHex && (
                        <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                      )}
                      <Text
                        style={{
                          color: isValidHex ? "#FFFFFF" : "#A1989E",
                          fontSize: 12,
                          fontWeight: "700",
                          letterSpacing: 0.3,
                        }}
                      >
                        Apply
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/* 4. CURATED DESIGNER THEMES */}
                <View className="gap-1.5 pt-1 border-t border-black/5">
                  <Text className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                    Curated Themes ({CinematicPresets.length}):
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
                  >
                    {CinematicPresets.map((preset) => {
                      const isSelected =
                        (activeColor || "").toUpperCase() ===
                        preset.qrColor.toUpperCase();
                      return (
                        <Pressable
                          key={preset.id}
                          accessibilityRole="button"
                          accessibilityLabel={`Select ${preset.name} theme`}
                          onPress={() => {
                            if (onSelectPreset) onSelectPreset(preset.id);
                            handlePickColor(preset.qrColor);
                          }}
                          style={{
                            backgroundColor: isSelected ? "#FFFFFF" : "#FDF6F2",
                            borderColor: isSelected
                              ? "#380B2C"
                              : "rgba(74, 15, 58, 0.15)",
                            borderWidth: isSelected ? 2 : 1.5,
                          }}
                          className="flex-row items-center gap-2 px-3 py-2 rounded-none active:opacity-85 shadow-2xs"
                        >
                          <View
                            style={{ backgroundColor: preset.qrColor }}
                            className="w-4 h-4 rounded-none items-center justify-center border border-black/10"
                          >
                            {isSelected && (
                              <Ionicons
                                name="checkmark"
                                size={11}
                                color="#FFFFFF"
                              />
                            )}
                          </View>
                          <Text
                            style={{
                              color: isSelected ? "#380B2C" : "#1A1416",
                              fontWeight: isSelected ? "700" : "600",
                              fontSize: 11,
                            }}
                          >
                            {preset.name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* 5. RECENT / SAVED CUSTOM COLORS */}
                {customHistory.length > 0 && (
                  <View className="gap-1.5 pt-1 border-t border-black/5">
                    <Text className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                      Recent Tints:
                    </Text>
                    <View className="flex-row items-center gap-2 flex-wrap">
                      {customHistory.map((histColor) => {
                        const isCurrent =
                          (activeColor || "").toUpperCase() ===
                          histColor.toUpperCase();
                        const isHistLight = isColorLight(histColor);
                        return (
                          <Pressable
                            key={histColor}
                            accessibilityRole="button"
                            accessibilityLabel={`Pick saved tint ${histColor}`}
                            onPress={() => handlePickColor(histColor)}
                            style={{
                              backgroundColor: histColor,
                              borderColor: isCurrent
                                ? "#380B2C"
                                : isHistLight
                                ? "rgba(0,0,0,0.25)"
                                : "rgba(0,0,0,0.18)",
                              borderWidth: isCurrent ? 2.5 : 1.5,
                            }}
                            className="px-2.5 py-1 rounded-none flex-row items-center gap-1 active:opacity-75 shadow-2xs"
                          >
                            <View
                              style={{
                                borderColor: isHistLight
                                  ? "rgba(0,0,0,0.3)"
                                  : "rgba(255,255,255,0.5)",
                                backgroundColor: isHistLight
                                  ? "rgba(0,0,0,0.1)"
                                  : "rgba(255,255,255,0.2)",
                              }}
                              className="w-2.5 h-2.5 rounded-none border"
                            />
                            <Text
                              style={{
                                color: isHistLight ? "#380B2C" : "#FFFFFF",
                              }}
                              className="font-mono text-[9px] font-bold"
                            >
                              {histColor}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                )}
              </ScrollView>

              {/* STICKY BOTTOM ACTION FOOTER */}
              <View
                style={{
                  borderColor: "rgba(74, 15, 58, 0.15)",
                  backgroundColor: "#FFFFFF",
                }}
                className="p-3 border-t items-center"
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Done and apply selected color"
                  onPress={onClose}
                  style={{
                    backgroundColor: "#380B2C",
                    borderColor: "#380B2C",
                    borderWidth: 1.5,
                  }}
                  className="w-full py-3 rounded-none flex-row items-center justify-center gap-2 active:opacity-90 shadow-sm"
                >
                  <Ionicons name="checkmark-done" size={17} color="#FFFFFF" />
                  <Text className="text-white text-xs font-bold tracking-wide">
                    Done & Apply Color ({activeColor})
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      );
    },
  );

CustomColorPickerModal.displayName = "CustomColorPickerModal";
