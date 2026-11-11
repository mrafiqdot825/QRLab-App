import { GlassBadge } from "@/components/ui/glass-badge";
import { GlassCard } from "@/components/ui/glass-card";
import { APP_CONFIG } from "@/config/app.config";
import { useTheme } from "@/hooks/use-theme";
import { Logger } from "@/services/logger/logger.service";
import { withAlpha } from "@/utils/color";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo } from "react";
import { Alert, Linking, Platform, Pressable, Text, View } from "react-native";

export const DeveloperInfoCard: React.FC = memo(() => {
  const { colors } = useTheme();
  const handleOpenEmail = React.useCallback(async (email: string) => {
    const subject = encodeURIComponent("QRLab App Support & Inquiry");
    const mailtoUrl = `mailto:${email}?subject=${subject}`;
    const webGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}`;

    try {
      if (Platform.OS === "web") {
        window.open(mailtoUrl, "_blank") || window.open(webGmailUrl, "_blank");
        return;
      }

      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
      } else {
        // Fallback to Webmail link if simulator/emulator lacks a native mail client
        await Linking.openURL(webGmailUrl);
      }
    } catch {
      try {
        await Linking.openURL(webGmailUrl);
      } catch (err) {
        Logger.info(
          "Could not launch mail client, showing fallback dialog:",
          err,
        );
        Alert.alert("Support Email", `Contact Support at:\n${email}`, [
          { text: "OK", style: "default" },
        ]);
      }
    }
  }, []);

  const handleOpenLink = React.useCallback(
    async (url: string, title: string) => {
      try {
        if (Platform.OS === "web") {
          window.open(url, "_blank");
          return;
        }
        await Linking.openURL(url);
      } catch (err) {
        Logger.error(`Failed to open link ${url}:`, err);
        Alert.alert("Open Link", `Unable to open ${title} (${url})`);
      }
    },
    [],
  );

  return (
    <GlassCard className="p-6 my-3 w-full gap-4">
      {/* HEADER WITH LOGO & APP VERSION */}
      <View className="flex-row items-center gap-4">
        <LinearGradient
          colors={["#4A0F3A", "#1A1416"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-14 h-14 rounded-3xl items-center justify-center border border-white/20 shadow-sm"
        >
          <Ionicons name="qr-code" size={28} color="#FFFFFF" />
        </LinearGradient>

        <View className="gap-1 flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-on-surface text-2xl font-serif font-bold tracking-tight">
              QRLab
            </Text>
            <GlassBadge label={`v${APP_CONFIG.version}`} variant="primary" />
          </View>
        </View>
      </View>

      <Text className="text-on-surface-variant text-xs leading-5">
        Designed & engineered with modern React Native architecture, fluid 60FPS
        reanimated physics, and clean modern visuals.
      </Text>

      {/* DEVELOPER PROFILE INFO */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
        className="p-4 rounded-3xl border gap-3"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5">
            <View
              style={{ backgroundColor: 'rgba(217, 212, 245, 0.45)' }}
              className="w-9 h-9 rounded-2xl items-center justify-center"
            >
              <Ionicons name="code-slash" size={17} color="#4A0F3A" />
            </View>
            <View>
              <Text className="text-on-surface text-xs font-bold">
                Senior Mobile Engineer
              </Text>
              <Text className="text-on-surface-variant text-[11px]">
                React Native & Expo Specialist
              </Text>
            </View>
          </View>
          <GlassBadge label="PRO" variant="primary" />
        </View>

        {/* SOCIAL & CONTACT BUTTONS */}
        <View
          style={{ borderColor: colors.border }}
          className="flex-row gap-2 pt-1 border-t"
        >
          <Pressable
            accessibilityLabel="Contact Support Email"
            accessibilityRole="button"
            onPress={() => handleOpenEmail(APP_CONFIG.supportEmail)}
            style={{
              backgroundColor: 'rgba(74, 15, 58, 0.08)',
              borderColor: 'rgba(74, 15, 58, 0.18)',
            }}
            className="flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-none border active:scale-95"
          >
            <Ionicons name="mail-outline" size={14} color="#4A0F3A" />
            <Text className="text-plum text-xs font-bold">Support Email</Text>
          </Pressable>

          <Pressable
            accessibilityLabel="Developer Website"
            accessibilityRole="button"
            onPress={() =>
              handleOpenLink("https://mrafiq.vercel.app/", "Developer Site")
            }
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
            className="flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-none border active:scale-95"
          >
            <Ionicons
              name="globe-outline"
              size={14}
              color={colors.secondaryText}
            />
            <Text className="text-on-surface text-xs font-bold">
              Developer Site
            </Text>
          </Pressable>
        </View>
      </View>
    </GlassCard>
  );
});

DeveloperInfoCard.displayName = "DeveloperInfoCard";
