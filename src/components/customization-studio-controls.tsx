import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Text, View } from 'react-native';

import { GlassCard } from '@/components/ui/glass-card';
import { GlassChip } from '@/components/ui/glass-chip';
import { Palette } from '@/constants/theme';
import { CustomizationOptions } from '@/types/qr';

export type { CustomizationOptions };

interface CustomizationStudioControlsProps {
  options: CustomizationOptions;
  onChangeOptions: React.Dispatch<React.SetStateAction<CustomizationOptions>>;
}

export const CustomizationStudioControls = React.memo(function CustomizationStudioControls({
  options,
  onChangeOptions,
}: CustomizationStudioControlsProps) {
  const updateOption = React.useCallback(
    <K extends keyof CustomizationOptions>(key: K, value: CustomizationOptions[K]) => {
      onChangeOptions((prev) => ({ ...prev, [key]: value }));
    },
    [onChangeOptions]
  );

  const currentModuleShape = options?.moduleShape || 'rounded';
  const currentEyeStyle = options?.eyeStyle || 'rounded';
  const currentLogo = options?.logo || 'none';

  return (
    <GlassCard className="p-5 my-3 w-full gap-5">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-ink text-base font-bold">Studio Customization</Text>
          <Text className="text-ink-muted text-xs mt-0.5">
            Configure matrix module shapes, eye frames, and badge logos.
          </Text>
        </View>
        <Ionicons name="options-outline" size={20} color="#4A0F3A" />
      </View>

      {/* Module Shape Controls */}
      <View className="gap-2">
        <Text className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
          Module Shape
        </Text>
        <View className="flex-row gap-2 w-full">
          {(['square', 'rounded', 'dots'] as const).map((shape) => (
            <GlassChip
              key={shape}
              label={shape.toUpperCase()}
              selected={currentModuleShape === shape}
              onPress={() => updateOption('moduleShape', shape)}
              style={{ flex: 1 }}
              className="flex-1 justify-center"
            />
          ))}
        </View>
      </View>

      {/* Eye Style Controls */}
      <View className="gap-2">
        <Text className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
          Eye Corner Style
        </Text>
        <View className="flex-row gap-2 w-full">
          {(['square', 'rounded', 'circle'] as const).map((eye) => (
            <GlassChip
              key={eye}
              label={eye === 'rounded' ? 'ROUND' : eye.toUpperCase()}
              selected={currentEyeStyle === eye}
              onPress={() => updateOption('eyeStyle', eye)}
              style={{ flex: 1 }}
              className="flex-1 justify-center"
            />
          ))}
        </View>
      </View>

      {/* Center Badge Icon Controls */}
      <View className="gap-2">
        <Text className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
          Center Brand Badge
        </Text>
        <View className="flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
          {(['none', 'qrlab', 'shield', 'star'] as const).map((logoItem) => (
            <GlassChip
              key={logoItem}
              label={logoItem.toUpperCase()}
              selected={currentLogo === logoItem || (logoItem === 'qrlab' && currentLogo === 'qrstudio')}
              onPress={() => updateOption('logo', logoItem as any)}
              style={{ flex: 1, minWidth: 65 }}
              className="flex-1 justify-center"
            />
          ))}
        </View>
      </View>
    </GlassCard>
  );
});

