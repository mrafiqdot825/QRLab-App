import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { Palette } from "@/constants/theme";
import { Typography } from "@/constants/theme/typography";
import { useTheme } from "@/hooks/use-theme";

interface GlassHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenScanner?: () => void;
  onOpenSettings?: () => void;
  className?: string;
}

export const GlassHeader = React.memo(function GlassHeader({
  title = "QRLab",
  showBack = false,
  onBack,
  onOpenScanner,
  onOpenSettings,
  className = "",
}: GlassHeaderProps) {
  const { colors } = useTheme();

  const triggerHaptic = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  };

  return (
    <View
      style={[styles.headerContainer, { backgroundColor: colors.background }]}
      className={`w-full z-50 relative ${className}`}
    >
      <View className="flex-row items-center justify-between px-5 py-3 w-full">
        <View className="flex-row items-center gap-3">
          {showBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => {
                triggerHaptic();
                if (onBack) onBack();
              }}
              style={styles.circleButton}
              className="w-10 h-10 rounded-full items-center justify-center active:scale-95"
            >
              <Ionicons name="arrow-back" size={19} color={Palette.ink} />
            </Pressable>
          ) : null}
          <Text
            style={[styles.wordmark, { fontFamily: Typography.serifFamily }]}
            className="text-ink text-[26px] font-bold tracking-tight"
          >
            {title}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          {onOpenScanner && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open Scanner"
              onPress={() => {
                triggerHaptic();
                onOpenScanner();
              }}
              style={styles.circleButton}
              className="w-10 h-10 rounded-full items-center justify-center active:scale-95"
            >
              <Ionicons name="scan-outline" size={18} color={Palette.ink} />
            </Pressable>
          )}

          {onOpenSettings && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open Profile and Settings"
              onPress={() => {
                triggerHaptic();
                onOpenSettings();
              }}
              style={styles.circleButton}
              className="w-10 h-10 rounded-full items-center justify-center active:scale-95"
            >
              <Ionicons name="person-outline" size={18} color={Palette.ink} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(74, 15, 58, 0.05)",
  },
  wordmark: {
    letterSpacing: -0.5,
  },
  circleButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(74, 15, 58, 0.08)",
    boxShadow: "0px 2px 8px rgba(74, 15, 58, 0.05)",
  },
});
