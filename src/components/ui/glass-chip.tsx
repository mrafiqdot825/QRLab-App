import { Palette, SpringConfigs } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  Text,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface GlassChipProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export const GlassChip = React.memo(function GlassChip({
  label,
  icon,
  selected = false,
  onPress,
  className = "",
  style,
}: GlassChipProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.94, SpringConfigs.gentle);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SpringConfigs.gentle);
  };

  const handlePress = () => {
    if (onPress) {
      if (Platform.OS !== "web") {
        Haptics.selectionAsync().catch(() => {});
      }
      onPress();
    }
  };

  return (
    <Animated.View className={`rounded-none ${className}`} style={[animatedStyle, style]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={
          selected
            ? {
                backgroundColor: '#4A0F3A',
                borderColor: '#4A0F3A',
                boxShadow: '0px 3px 10px rgba(74, 15, 58, 0.20)',
              }
            : {
                backgroundColor: '#FFFFFF',
                borderColor: 'rgba(74, 15, 58, 0.08)',
                boxShadow: '0px 2px 6px rgba(74, 15, 58, 0.04)',
              }
        }
        className="px-4 py-2.5 rounded-none flex-row items-center justify-center gap-1.5 overflow-hidden relative border"
      >
        {icon && (
          <Ionicons
            name={icon}
            size={16}
            color={selected ? "#FFFFFF" : Palette.ink}
          />
        )}

        <Text
          className={`text-xs ${
            selected ? "font-bold text-white" : "font-medium text-ink"
          }`}
          numberOfLines={1}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
});
