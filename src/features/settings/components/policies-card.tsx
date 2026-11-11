import Ionicons from '@expo/vector-icons/Ionicons';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassModal } from '@/components/ui/glass-modal';
import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React, { memo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export const PoliciesCard: React.FC = memo(() => {
  const { colors } = useTheme();
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | null>(null);

  const openPrivacy = React.useCallback(() => setActivePolicy('privacy'), []);
  const openTerms = React.useCallback(() => setActivePolicy('terms'), []);
  const closeModal = React.useCallback(() => setActivePolicy(null), []);

  return (
    <>
      <GlassCard className="p-5 my-3 w-full gap-3">
        <Text className="text-on-surface-variant text-[11px] font-extrabold tracking-wider uppercase">
          POLICIES & LEGAL GOVERNANCE
        </Text>

        {/* PRIVACY POLICY ROW */}
        <Pressable
          accessibilityLabel="Open Privacy Policy"
          accessibilityRole="button"
          onPress={openPrivacy}
          style={{ borderColor: colors.border }}
          className="flex-row items-center justify-between py-2.5 border-b active:opacity-70">
          <View className="flex-row items-center gap-3">
            <View
              style={{
                backgroundColor: 'rgba(201, 216, 190, 0.5)',
                borderColor: 'rgba(74, 15, 58, 0.15)',
              }}
              className="w-9 h-9 rounded-none border items-center justify-center">
              <Ionicons name="shield-checkmark-outline" size={17} color={Palette.plum} />
            </View>
            <View>
              <Text className="text-on-surface font-bold text-sm">Privacy Policy</Text>
              <Text className="text-on-surface-variant text-[11px]">Local storage, offline safety & camera privacy</Text>
            </View>
          </View>
          <View
            style={{ backgroundColor: colors.surface, borderColor: colors.border }}
            className="w-7 h-7 rounded-none items-center justify-center border">
            <Ionicons name="chevron-forward" size={14} color={Palette.plum} />
          </View>
        </Pressable>

        {/* TERMS OF SERVICE ROW */}
        <Pressable
          accessibilityLabel="Open Terms of Service"
          accessibilityRole="button"
          onPress={openTerms}
          className="flex-row items-center justify-between py-2.5 active:opacity-70">
          <View className="flex-row items-center gap-3">
            <View
              style={{
                backgroundColor: 'rgba(251, 233, 168, 0.55)',
                borderColor: 'rgba(74, 15, 58, 0.15)',
              }}
              className="w-9 h-9 rounded-none border items-center justify-center">
              <Ionicons name="document-text-outline" size={17} color={Palette.plum} />
            </View>
            <View>
              <Text className="text-on-surface font-bold text-sm">Terms of Service</Text>
              <Text className="text-on-surface-variant text-[11px]">Usage rights, vector export & commercial rules</Text>
            </View>
          </View>
          <View
            style={{ backgroundColor: colors.surface, borderColor: colors.border }}
            className="w-7 h-7 rounded-none items-center justify-center border">
            <Ionicons name="chevron-forward" size={14} color={Palette.plum} />
          </View>
        </Pressable>
      </GlassCard>

      {/* POLICY MODAL DIALOG */}
      <GlassModal
        visible={!!activePolicy}
        onClose={closeModal}
        title={activePolicy === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
        variant="sheet">
        <View className="py-1">
          {activePolicy === 'privacy' && (
            <View className="gap-3 py-2">
              <Text className="text-on-surface text-sm font-bold">1. Zero Cloud Data Collection</Text>
              <Text className="text-on-surface-variant text-xs leading-5">
                QRLab operates 100% locally on your device. Your generated QR codes, payloads, WiFi keys, and contact cards are stored exclusively on your device using encrypted local storage. We do not track, collect, or transmit your data to remote servers.
              </Text>

              <Text className="text-on-surface text-sm font-bold mt-2">2. Camera & Flash Permissions</Text>
              <Text className="text-on-surface-variant text-xs leading-5">
                Camera access is requested solely for scanning physical QR codes via your camera lens. No video feed or images leave your device.
              </Text>

              <Text className="text-on-surface text-sm font-bold mt-2">3. Analytics & Telemetry</Text>
              <Text className="text-on-surface-variant text-xs leading-5">
                QRLab does not embed third-party tracking SDKs, advertising IDs, or behavioral analytics software.
              </Text>
            </View>
          )}

          {activePolicy === 'terms' && (
            <View className="gap-3 py-2">
              <Text className="text-on-surface text-sm font-bold">1. Universal License</Text>
              <Text className="text-on-surface-variant text-xs leading-5">
                All QR codes generated within QRLab (including SVG vector exports, PNG images, and PDF print sheets) belong entirely to you. You are free to use them for personal, educational, or commercial purposes.
              </Text>

              <Text className="text-on-surface text-sm font-bold mt-2">2. Disclaimer of Liability</Text>
              <Text className="text-on-surface-variant text-xs leading-5">
                QRLab generates QR matrix structures based on your input strings. Please verify payload details (such as Wi-Fi passwords and bank links) before printing high-volume materials.
              </Text>
            </View>
          )}
        </View>
      </GlassModal>
    </>
  );
});

PoliciesCard.displayName = 'PoliciesCard';
