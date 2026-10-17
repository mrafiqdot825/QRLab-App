import { BotanicalBranch } from "@/components/morrow/botanical-accents";
import { Typography } from "@/constants/theme/typography";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface HeroHeaderBlockProps {
  eyebrow?: string;
  headlineLine1: string;
  headlineLine2: string;
  subtitle?: string;
  showBotanical?: boolean;
  className?: string;
}

export const HeroHeaderBlock = React.memo(function HeroHeaderBlock({
  eyebrow,
  headlineLine1,
  headlineLine2,
  subtitle,
  showBotanical = true,
  className = "",
}: HeroHeaderBlockProps) {
  return (
    <View className={`w-full relative my-3 px-1 ${className}`}>
      {/* Decorative Botanical Accent in Top Right */}
      {showBotanical && (
        <View style={styles.botanicalWrapper} pointerEvents="none">
          <BotanicalBranch size={92} opacity={0.88} />
        </View>
      )}

      {/* Eyebrow text */}
      {eyebrow && (
        <Text className="text-ink-muted text-sm font-normal mb-1 tracking-tight">
          {eyebrow}
        </Text>
      )}

      {/* Two-Line Signature Headline */}
      <View className="mb-2">
        <Text
          style={[styles.serifLine, { fontFamily: Typography.serifFamily }]}
          className="text-ink text-[36px] font-bold leading-[42px] tracking-tight"
        >
          {headlineLine1}
        </Text>
        <Text
          style={[
            styles.serifLineItalic,
            { fontFamily: Typography.serifFamily },
          ]}
          className="text-plum text-[36px] font-normal italic leading-[42px] tracking-tight"
        >
          {headlineLine2}
        </Text>
      </View>

      {/* Subtitle */}
      {subtitle && (
        <Text className="text-ink-muted text-sm leading-5 max-w-[320px]">
          {subtitle}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  botanicalWrapper: {
    position: "absolute",
    top: -8,
    right: -4,
    zIndex: 0,
  },
  serifLine: {
    letterSpacing: -0.6,
  },
  serifLineItalic: {
    fontStyle: "italic",
    letterSpacing: -0.6,
  },
});
