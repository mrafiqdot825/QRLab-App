import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {
  BotanicalBranch,
  BotanicalCrescent,
  BotanicalFlower,
  BotanicalLeafSingle,
} from '@/components/morrow/botanical-accents';
import { Palette, SpringConfigs } from '@/constants/theme';

export type PastelTileVariant = 'sage' | 'butter' | 'lavender' | 'peach' | 'periwinkle';

interface PastelFeatureTileProps {
  title: string;
  description: string;
  variant?: PastelTileVariant;
  illustration?: 'leaf' | 'flower' | 'crescent' | 'branch';
  onPress: () => void;
  className?: string;
  style?: any;
}

const VARIANT_COLORS: Record<PastelTileVariant, { bg: string; border: string }> = {
  lavender: { bg: '#D9D4F5', border: 'rgba(74, 15, 58, 0.08)' },
  butter: { bg: '#FBE9A8', border: 'rgba(74, 15, 58, 0.08)' },
  sage: { bg: '#C9D8BE', border: 'rgba(74, 15, 58, 0.08)' },
  peach: { bg: '#F7B9A5', border: 'rgba(74, 15, 58, 0.08)' },
  periwinkle: { bg: '#AFC0F5', border: 'rgba(74, 15, 58, 0.08)' },
};

export const PastelFeatureTile = React.memo(function PastelFeatureTile({
  title,
  description,
  variant = 'sage',
  illustration = 'leaf',
  onPress,
  className = '',
  style,
}: PastelFeatureTileProps) {
  const scale = useSharedValue(1);
  const colorConfig = VARIANT_COLORS[variant] || VARIANT_COLORS.sage;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, SpringConfigs.gentle);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SpringConfigs.gentle);
  };

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onPress();
  };

  return (
    <Animated.View style={[animatedStyle, style]} className={`flex-1 min-w-[145px] ${className}`}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.tileContainer,
          { backgroundColor: colorConfig.bg, borderColor: colorConfig.border },
        ]}
        className="rounded-[24px] p-4 h-[180px] justify-between relative overflow-hidden"
      >
        {/* Top Text Block */}
        <View className="z-10 gap-1.5">
          <Text className="text-ink text-[17px] font-bold tracking-tight leading-tight">
            {title}
          </Text>
          <Text
            className="text-ink-muted text-xs leading-4"
            numberOfLines={2}
          >
            {description}
          </Text>
        </View>

        {/* Bottom Row: White Circular Arrow Button on Left, Illustration on Right */}
        <View className="flex-row items-end justify-between z-10">
          {/* White Circular Arrow Button */}
          <View style={styles.arrowButton}>
            <Ionicons name="arrow-up-outline" size={17} color={Palette.ink} style={styles.arrowRotated} />
          </View>

          {/* Botanical Illustration bottom-right */}
          <View style={styles.illustrationWrapper} pointerEvents="none">
            {illustration === 'leaf' && <BotanicalLeafSingle size={52} />}
            {illustration === 'flower' && <BotanicalFlower size={52} />}
            {illustration === 'crescent' && <BotanicalCrescent size={52} />}
            {illustration === 'branch' && <BotanicalBranch size={52} />}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  tileContainer: {
    borderWidth: 1,
    boxShadow: '0px 4px 16px rgba(74, 15, 58, 0.05)',
  },
  arrowButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 6px rgba(74, 15, 58, 0.08)',
  },
  arrowRotated: {
    transform: [{ rotate: '45deg' }],
  },
  illustrationWrapper: {
    position: 'absolute',
    right: -6,
    bottom: -6,
  },
});

