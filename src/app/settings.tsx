import { GlassCard } from '@/components/ui/glass-card';
import { GlassContainer } from '@/components/ui/glass-container';
import { HeroHeaderBlock } from '@/components/morrow/hero-header-block';
import { TopBar } from '@/components/morrow/top-bar';
import { Palette } from '@/constants/theme';
import { DeveloperInfoCard } from '@/features/settings/components/developer-info-card';
import { PoliciesCard } from '@/features/settings/components/policies-card';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Platform, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { colors } = useTheme();

  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [highQualityExports, setHighQualityExports] = useState(true);

  const toggleHaptics = (val: boolean) => {
    setHapticsEnabled(val);
    if (val && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  };

  return (
    <GlassContainer>
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          removeClippedSubviews={Platform.OS !== 'web'}
          overScrollMode="never">
          <View className="w-full max-w-[640px]">
            {/* Top Bar with Wordmark */}
            <TopBar title="QRLab" />

            {/* Signature Morrow Hero Header Block */}
            <HeroHeaderBlock
              eyebrow="Preferences & governance"
              headlineLine1="Profile &"
              headlineLine2="settings."
              subtitle="Developer profile, legal governance, and app preferences."
            />

            {/* DEVELOPER SPOTLIGHT CARD */}
            <DeveloperInfoCard />

            {/* PREFERENCES GROUP */}
            <GlassCard className="p-5 gap-3.5 my-2">
              <Text className="text-on-surface-variant text-[11px] font-extrabold tracking-wider uppercase">
                HAPTICS & PREFERENCES
              </Text>

              <View className="flex-row items-center justify-between py-1">
                <View className="flex-row items-center gap-3">
                  <View style={{ backgroundColor: 'rgba(217, 212, 245, 0.45)' }} className="w-9 h-9 rounded-2xl items-center justify-center">
                    <Ionicons name="phone-portrait-outline" size={17} color={Palette.plum} />
                  </View>
                  <View>
                    <Text className="text-on-surface font-bold text-sm">Haptic Feedback</Text>
                    <Text className="text-on-surface-variant text-[11px]">Tactile vibrations on press</Text>
                  </View>
                </View>
                <Switch
                  accessibilityLabel="Toggle haptic feedback"
                  value={hapticsEnabled}
                  onValueChange={toggleHaptics}
                  trackColor={{ false: 'rgba(74, 15, 58, 0.12)', true: Palette.plum }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={{ borderColor: colors.border }} className="flex-row items-center justify-between py-1 border-t">
                <View className="flex-row items-center gap-3">
                  <View style={{ backgroundColor: 'rgba(201, 216, 190, 0.45)' }} className="w-9 h-9 rounded-2xl items-center justify-center">
                    <Ionicons name="sparkles-outline" size={17} color={Palette.plum} />
                  </View>
                  <View>
                    <Text className="text-on-surface font-bold text-sm">Ultra HD Vector Engine</Text>
                    <Text className="text-on-surface-variant text-[11px]">Render vector exports at 300DPI</Text>
                  </View>
                </View>
                <Switch
                  accessibilityLabel="Toggle ultra HD vector engine"
                  value={highQualityExports}
                  onValueChange={setHighQualityExports}
                  trackColor={{ false: 'rgba(74, 15, 58, 0.12)', true: Palette.plum }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </GlassCard>

            {/* POLICIES & LEGAL GOVERNANCE */}
            <PoliciesCard />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GlassContainer>
  );
}
