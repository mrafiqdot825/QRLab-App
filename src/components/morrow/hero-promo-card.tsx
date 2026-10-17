import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { BotanicalBranch } from '@/components/morrow/botanical-accents';
import { Palette, SpringConfigs } from '@/constants/theme';
import { Typography } from '@/constants/theme/typography';

interface HeroPromoCardProps {
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  onPress: () => void;
  className?: string;
}

export const HeroPromoCard = React.memo(function HeroPromoCard({
  titleLine1,
  titleLine2,
  subtitle,
  onPress,
  className = '',
}: HeroPromoCardProps) {
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
        className="rounded-[28px] p-6 relative overflow-hidden justify-between min-h-[170px]"
      >
        <LinearGradient
          colors={['#FFFFFF', '#FDF6F2', '#FBEDE6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Decorative warm sun aura + botanical branch on right */}
        <View style={styles.sunAura} pointerEvents="none" />
        <View style={styles.botanicalWrapper} pointerEvents="none">
          <BotanicalBranch size={105} opacity={0.92} />
        </View>

        {/* Text Block */}
        <View className="z-10 max-w-[210px] gap-1.5">
          <Text
            style={[styles.serifLine, { fontFamily: Typography.serifFamily }]}
            className="text-ink text-[22px] font-bold leading-[27px] tracking-tight"
          >
            {titleLine1}
          </Text>
          <Text
            style={[styles.serifLineItalic, { fontFamily: Typography.serifFamily }]}
            className="text-plum text-[22px] font-normal italic leading-[27px] tracking-tight"
          >
            {titleLine2}
          </Text>
          <Text className="text-ink-muted text-xs leading-4 mt-1">
            {subtitle}
          </Text>
        </View>

        {/* White circular arrow button */}
        <View className="z-10 mt-4">
          <View style={styles.arrowButton}>
            <Ionicons
              name="arrow-up-outline"
              size={18}
              color={Palette.ink}
              style={styles.arrowRotated}
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderColor: 'rgba(74, 15, 58, 0.06)',
    boxShadow: '0px 8px 24px rgba(74, 15, 58, 0.06)',
  },
  serifLine: {
    letterSpacing: -0.4,
  },
  serifLineItalic: {
    fontStyle: 'italic',
    letterSpacing: -0.4,
  },
  sunAura: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FBE9A8',
    opacity: 0.45,
  },
  botanicalWrapper: {
    position: 'absolute',
    right: 6,
    bottom: 6,
  },
  arrowButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(74, 15, 58, 0.08)',
  },
  arrowRotated: {
    transform: [{ rotate: '45deg' }],
  },
});

