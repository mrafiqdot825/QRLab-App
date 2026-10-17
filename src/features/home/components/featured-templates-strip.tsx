import { GlassBadge } from "@/components/ui/glass-badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Palette } from "@/constants/theme";
import { TEMPLATES_LIST } from "@/features/templates/constants/templates";
import { useTheme } from "@/hooks/use-theme";
import { withAlpha } from "@/utils/color";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

const FEATURED_TEMPLATES = TEMPLATES_LIST.slice(0, 5);

const FeaturedTemplateItem = React.memo(
  ({
    template,
    index,
    onSelect,
  }: {
    template: (typeof FEATURED_TEMPLATES)[0];
    index: number;
    onSelect: (type: string) => void;
  }) => {
    const handlePress = useCallback(() => {
      onSelect(template.type);
    }, [onSelect, template.type]);

    return (
      <Animated.View entering={FadeInRight.duration(450).delay(index * 75)}>
        <GlassCard
          onPress={handlePress}
          interactive
          hasGlow
          className="w-60 p-4 rounded-3xl"
          style={styles.templateCard}
        >
          <View className="flex-row items-center justify-between mb-3">
            <View
              style={{ backgroundColor: `${template.color}15` }}
              className="w-10 h-10 rounded-2xl items-center justify-center"
            >
              <Ionicons
                name={template.icon as keyof typeof Ionicons.glyphMap}
                size={20}
                color={template.color}
              />
            </View>

            <GlassBadge
              label={template.category}
              variant="secondary"
              className="py-0.5 px-2 text-[9px]"
            />
          </View>

          <Text className="text-ink font-bold text-base">
            {template.title}
          </Text>
          <Text
            className="text-ink-muted text-xs mt-1 leading-4"
            numberOfLines={2}
          >
            {template.desc}
          </Text>

          <View
            style={{
              backgroundColor: '#FDF6F2',
              borderColor: 'rgba(74, 15, 58, 0.08)',
            }}
            className="flex-row items-center justify-center gap-1.5 mt-4 py-2.5 rounded-full border overflow-hidden relative"
          >
            <Text className="text-ink text-xs font-bold">
              Use Template
            </Text>
            <Ionicons
              name="arrow-forward-circle"
              size={16}
              color="#4A0F3A"
            />
          </View>
        </GlassCard>
      </Animated.View>
    );
  }
);
FeaturedTemplateItem.displayName = "FeaturedTemplateItem";

export const FeaturedTemplatesStrip: React.FC = React.memo(() => {
  const router = useRouter();
  const { colors: _colors } = useTheme();

  const handleSelectTemplate = useCallback(
    (type: string) => {
      router.navigate({
        pathname: "/studio",
        params: { initialType: type },
      });
    },
    [router]
  );

  const handleOpenExplore = useCallback(() => {
    router.navigate("/explore");
  }, [router]);

  return (
    <View className="w-full my-4">
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-ink text-xl font-bold tracking-tight">
            Curated Templates
          </Text>
          <Text className="text-ink-muted text-xs mt-0.5">
            Designed for business, hospitality & events
          </Text>
        </View>

        <Pressable
          onPress={handleOpenExplore}
          accessibilityLabel="View all templates"
          accessibilityRole="button"
          className="flex-row items-center gap-1"
        >
          <Text className="text-plum text-xs font-bold">See All</Text>
          <Ionicons name="chevron-forward" size={14} color="#4A0F3A" />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 14, paddingVertical: 4 }}
      >
        {FEATURED_TEMPLATES.map((template, index) => (
          <FeaturedTemplateItem
            key={template.id}
            template={template}
            index={index}
            onSelect={handleSelectTemplate}
          />
        ))}
      </ScrollView>
    </View>
  );
});

FeaturedTemplatesStrip.displayName = "FeaturedTemplatesStrip";

const styles = StyleSheet.create({
  templateCard: {
    boxShadow: "0px 4px 16px rgba(30, 42, 56, 0.06)",
  },
});
