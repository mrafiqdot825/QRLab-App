import {
  CustomColorPickerModal,
  getColorName,
  isColorLight,
} from "@/components/custom-color-picker-modal";
import { GlassCard } from "@/components/ui/glass-card";
import { PresetId } from "@/constants/theme";
import { CustomizationOptions } from "@/types/qr";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import React, { memo, useCallback, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

interface ThemePresetsBarProps {
  selectedPresetId: PresetId;
  onSelectPreset: (id: PresetId) => void;
  selectedColor?: string;
  onSelectColor?: (color: string) => void;
  payloadValue?: string;
  customOpts?: CustomizationOptions;
}

export const ThemePresetsBar = memo(function ThemePresetsBar({
  selectedPresetId,
  onSelectPreset,
  selectedColor = "#4A0F3A",
  onSelectColor,
  payloadValue,
  customOpts,
}: ThemePresetsBarProps) {
  const [customStudioOpen, setCustomStudioOpen] = useState(false);

  const handleOpenStudio = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    setCustomStudioOpen(true);
  }, []);

  const handlePickColor = useCallback(
    (hex: string) => {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      if (onSelectColor) onSelectColor(hex);
    },
    [onSelectColor],
  );

  const activeColor = selectedColor || "#4A0F3A";
  const activeColorLight = isColorLight(activeColor);
  const activeColorName = getColorName(activeColor);

  return (
    <>
      <GlassCard className="p-4 my-3 w-full">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-on-surface text-base font-extrabold tracking-tight">
              Theme & Color Palette
            </Text>
            <View className="flex-row items-center gap-2 mt-1">
              <View
                style={{
                  backgroundColor: activeColor,
                  borderColor: activeColorLight
                    ? "rgba(0,0,0,0.3)"
                    : "rgba(0,0,0,0.15)",
                  borderWidth: 1.5,
                }}
                className="w-4 h-4 rounded-none shadow-2xs"
              />
              <Text className="text-plum font-mono text-xs font-bold">
                {activeColor.toUpperCase()}
              </Text>
              <Text className="text-ink-muted text-xs font-medium">
                • {activeColorName}
              </Text>
            </View>
          </View>

          {/* CUSTOM STUDIO BUTTON */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open Custom Studio"
            onPress={handleOpenStudio}
            style={{
              backgroundColor: "#380B2C",
              borderColor: "#380B2C",
              borderWidth: 1.5,
            }}
            className="flex-row items-center gap-2 px-4 py-2.5 rounded-none active:opacity-85 shadow-sm"
          >
            <Ionicons name="color-palette" size={16} color="#FFFFFF" />
            <Text className="text-white text-xs font-bold tracking-wide">
              Custom Studio
            </Text>
            <Ionicons name="chevron-forward" size={13} color="#FFFFFF" />
          </Pressable>
        </View>
      </GlassCard>

      {/* CUSTOM COLOR STUDIO MODAL WITH LIVE QR PREVIEW AND ALL COLORS */}
      <CustomColorPickerModal
        visible={customStudioOpen}
        onClose={() => setCustomStudioOpen(false)}
        selectedColor={activeColor}
        onSelectColor={handlePickColor}
        payloadValue={payloadValue}
        customOpts={customOpts}
        presetId={selectedPresetId}
        onSelectPreset={onSelectPreset}
      />
    </>
  );
});

ThemePresetsBar.displayName = "ThemePresetsBar";
