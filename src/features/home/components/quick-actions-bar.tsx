import { GlassCard } from "@/components/ui/glass-card";
import { Palette } from "@/constants/theme";
import { useModals } from "@/hooks/use-modals";
import { useTheme } from "@/hooks/use-theme";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgAlpha: string;
  onPress: () => void;
}

const QuickActionItem = React.memo(
  ({ action, index }: { action: QuickAction; index: number }) => (
    <Animated.View entering={FadeInRight.duration(400).delay(index * 80)}>
      <GlassCard
        onPress={action.onPress}
        interactive
        hasGlow
        className="w-44 p-4 rounded-3xl"
        style={styles.actionCard}
      >
        <View className="flex-row items-center justify-between mb-2">
          <View
            style={{ backgroundColor: action.bgAlpha }}
            className="w-10 h-10 rounded-2xl items-center justify-center"
          >
            <Ionicons name={action.icon} size={20} color={action.color} />
          </View>
          <Ionicons
            name="arrow-forward-circle-outline"
            size={18}
            color={action.color}
          />
        </View>

        <Text className="text-on-surface font-extrabold text-sm mt-1">
          {action.title}
        </Text>
        <Text
          className="text-on-surface-variant text-xs mt-0.5 leading-4"
          numberOfLines={1}
        >
          {action.subtitle}
        </Text>
      </GlassCard>
    </Animated.View>
  )
);
QuickActionItem.displayName = "QuickActionItem";

export const QuickActionsBar: React.FC = React.memo(() => {
  const router = useRouter();
  const { colors } = useTheme();
  const { openScanner } = useModals();

  const handleNavigateStudio = React.useCallback(
    () => router.navigate("/studio"),
    [router]
  );
  const handleNavigateExplore = React.useCallback(
    () => router.navigate("/explore"),
    [router]
  );
  const handleNavigateWifi = React.useCallback(
    () =>
      router.navigate({
        pathname: "/studio",
        params: { initialType: "wifi" },
      }),
    [router]
  );
  const handleNavigateVCard = React.useCallback(
    () =>
      router.navigate({
        pathname: "/studio",
        params: { initialType: "vcard" },
      }),
    [router]
  );

  const ACTIONS: QuickAction[] = useMemo(
    () => [
      {
        id: "studio",
        title: "QRLab",
        subtitle: "Custom colors & eyes",
        icon: "create-outline",
        color: colors.accent,
        bgAlpha: "rgba(62, 111, 166, 0.1)",
        onPress: handleNavigateStudio,
      },
      {
        id: "scan",
        title: "Camera Scanner",
        subtitle: "Instant auto scan",
        icon: "scan-outline",
        color: Palette.emerald,
        bgAlpha: "rgba(46, 125, 50, 0.1)",
        onPress: openScanner,
      },
      {
        id: "vcard",
        title: "Digital VCard",
        subtitle: "Share contact card",
        icon: "person-outline",
        color: Palette.cyan,
        bgAlpha: "rgba(0, 184, 212, 0.1)",
        onPress: handleNavigateVCard,
      },
      {
        id: "templates",
        title: "Explore Templates",
        subtitle: "Pre-designed cards",
        icon: "color-palette-outline",
        color: colors.accent,
        bgAlpha: "rgba(62, 111, 166, 0.1)",
        onPress: handleNavigateExplore,
      },
      {
        id: "wifi",
        title: "Guest Wi-Fi",
        subtitle: "1-Tap Wi-Fi share",
        icon: "wifi-outline",
        color: Palette.amber,
        bgAlpha: "rgba(237, 108, 2, 0.1)",
        onPress: handleNavigateWifi,
      },
    ],
    [handleNavigateStudio, handleNavigateExplore, handleNavigateWifi, handleNavigateVCard, openScanner, colors.accent]
  );

  return (
    <View className="w-full my-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-on-surface text-xl font-extrabold tracking-tight">
          Quick Launch Hub
        </Text>
        <Text className="text-on-surface-variant text-xs font-medium">
          Choose action
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingVertical: 4 }}
      >
        {ACTIONS.map((action, index) => (
          <QuickActionItem key={action.id} action={action} index={index} />
        ))}
      </ScrollView>
    </View>
  );
});

QuickActionsBar.displayName = "QuickActionsBar";

const styles = StyleSheet.create({
  actionCard: {
    boxShadow: "0px 4px 16px rgba(30, 42, 56, 0.06)",
  },
});
