import { GlassBadge } from "@/components/ui/glass-badge";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassCard } from "@/components/ui/glass-card";
import { BotanicalBranch } from "@/components/morrow/botanical-accents";
import { Typography } from "@/constants/theme/typography";
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export const HomeProBanner: React.FC = React.memo(() => {
  const router = useRouter();

  const handlePress = React.useCallback(
    () => router.navigate("/studio"),
    [router]
  );

  return (
    <Animated.View
      entering={FadeInUp.duration(500).delay(200)}
      className="w-full mt-6 mb-4"
    >
      <GlassCard
        style={styles.bannerCardShadow}
        className="p-7 items-center text-center gap-4 overflow-hidden rounded-[28px] relative"
      >
        <LinearGradient
          colors={['#FFFFFF', '#FDF6F2', '#FBEDE6']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          pointerEvents="none"
        />

        {/* Decorative botanical in top-right */}
        <View style={styles.botanicalAccent} pointerEvents="none">
          <BotanicalBranch size={85} opacity={0.7} />
        </View>

        <View
          style={{ backgroundColor: 'rgba(74, 15, 58, 0.08)' }}
          className="w-14 h-14 rounded-full items-center justify-center"
        >
          <Ionicons
            name="sparkles"
            size={24}
            color="#4A0F3A"
          />
        </View>

        <View className="items-center">
          <Text
            style={{ fontFamily: Typography.serifFamily }}
            className="text-ink text-2xl font-bold text-center tracking-tight"
          >
            Unlock Unlimited
          </Text>
          <Text
            style={{ fontFamily: Typography.serifFamily, fontStyle: 'italic' }}
            className="text-plum text-2xl font-normal italic text-center tracking-tight"
          >
            Vector QR Export
          </Text>
        </View>

        <Text className="text-ink-muted text-xs text-center leading-5 max-w-md">
          Export ultra high-definition SVGs, custom eye shapes, center brand badges,
          and print-ready PDF formats without limitations.
        </Text>

        <GlassBadge
          icon="shield-checkmark-outline"
          label="100% Free & Local Privacy"
          variant="success"
        />

        <GlassButton
          title="Open Customizer Studio"
          icon="arrow-forward"
          iconPosition="right"
          variant="primary"
          onPress={handlePress}
        />
      </GlassCard>
    </Animated.View>
  );
});

HomeProBanner.displayName = "HomeProBanner";

const styles = StyleSheet.create({
  bannerCardShadow: {
    boxShadow: "0px 8px 24px rgba(74, 15, 58, 0.06)",
  },
  botanicalAccent: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
});

