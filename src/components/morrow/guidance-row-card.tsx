import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Palette, SpringConfigs } from '@/constants/theme';

interface GuidanceRowCardProps {
  title?: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconBgColor?: string;
  onPress: () => void;
  className?: string;
}

export const GuidanceRowCard = React.memo(function GuidanceRowCard({
  title = 'Not sure where to start?',
  subtitle = 'Explore curated templates and discover creative QR ideas.',
  icon = 'document-text-outline',
  iconBgColor = '#D9D4F5',
  onPress,
  className = '',
}: GuidanceRowCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, SpringConfigs.gentle);
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
    <Animated.View style={animatedStyle} className={`w-full my-2.5 ${className}`}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.cardContainer}
        className="rounded-[26px] p-4 flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-3.5 flex-1 pr-3">
          {/* Lavender rounded square icon tile */}
          <View
            style={[styles.iconTile, { backgroundColor: iconBgColor }]}
            className="w-12 h-12 rounded-[16px] items-center justify-center shrink-0"
          >
            <Ionicons name={icon} size={22} color={Palette.ink} />
          </View>

          {/* Title & subtitle */}
          <View className="flex-1 gap-0.5">
            <Text className="text-ink text-[15px] font-semibold tracking-tight">
              {title}
            </Text>
            <Text className="text-ink-muted text-xs leading-4" numberOfLines={2}>
              {subtitle}
            </Text>
          </View>
        </View>

        {/* Chevron in soft circle */}
        <View style={styles.chevronCircle} className="shrink-0">
          <Ionicons name="chevron-forward" size={16} color={Palette.ink} />
        </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(74, 15, 58, 0.05)',
    boxShadow: '0px 6px 20px rgba(74, 15, 58, 0.05)',
  },
  iconTile: {
    borderWidth: 1,
    borderColor: 'rgba(74, 15, 58, 0.06)',
  },
  chevronCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FDF6F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 15, 58, 0.06)',
  },
});

