import Ionicons from '@expo/vector-icons/Ionicons';
import { GlassBadge } from "@/components/ui/glass-badge";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassCard } from "@/components/ui/glass-card";
import { QRTemplate } from "@/features/templates/constants/templates";
import { useTheme } from "@/hooks/use-theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback } from "react";
import { Text, View } from "react-native";
import { CustomStyledQRCode } from "@/components/ui/custom-styled-qr-code";

interface TemplateCardProps {
  template: QRTemplate;
  onUseTemplate: (template: QRTemplate) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = memo(
  ({ template, onUseTemplate }) => {
    const { colors } = useTheme();
    const handlePress = useCallback(() => {
      onUseTemplate(template);
    }, [onUseTemplate, template]);

    return (
      <GlassCard className="w-full p-5 gap-4">
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-row items-center gap-3 flex-1">
            <LinearGradient
              colors={template.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-12 h-12 rounded-2xl items-center justify-center border border-black/[0.04] shrink-0"
            >
              <Ionicons
                name={template.icon as any}
                size={22}
                color={template.color}
              />
            </LinearGradient>

            <View className="gap-1 flex-1">
              <Text className="text-ink text-base font-bold" numberOfLines={1}>
                {template.title}
              </Text>
              <View className="self-start">
                <GlassBadge
                  label={template.category.toUpperCase()}
                  variant="primary"
                />
              </View>
            </View>
          </View>
          <View style={{ borderColor: 'rgba(74, 15, 58, 0.08)', borderWidth: 1 }} className="p-2 rounded-2xl bg-white shadow-sm shrink-0">
            <CustomStyledQRCode
              value={template.sampleValue}
              size={48}
              color="#4A0F3A"
              backgroundColor="#FFFFFF"
              moduleShape="rounded"
              eyeStyle="rounded"
            />
          </View>
        </View>

        <Text className="text-ink-muted text-xs leading-5">
          {template.desc}
        </Text>

        <GlassButton
          accessibilityLabel={`Use ${template.title} template`}
          title="Use Template"
          icon="arrow-forward"
          iconPosition="right"
          variant="secondary"
          onPress={handlePress}
          className="rounded-none py-3"
        />
      </GlassCard>
    );
  },
);

TemplateCard.displayName = "TemplateCard";
