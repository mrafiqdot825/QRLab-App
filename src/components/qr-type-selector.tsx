import { GlassCard } from '@/components/ui/glass-card';
import { GlassChip } from '@/components/ui/glass-chip';
import { useTheme } from '@/hooks/use-theme';
import { QRType } from '@/types/qr';
import { withAlpha } from '@/utils/color';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export type { QRType };

interface QRTypeConfig {
  id: QRType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  desc: string;
}

export const QR_TYPES: QRTypeConfig[] = [
  { id: 'url', label: 'Website Link', icon: 'link-outline', desc: 'Direct visitors to any website or landing page.' },
  { id: 'wifi', label: 'Wi-Fi Network', icon: 'wifi-outline', desc: 'Allow guests to join Wi-Fi without typing passwords.' },
  { id: 'vcard', label: 'Digital VCard', icon: 'person-outline', desc: 'Share your contact card, phone, and company info.' },
  { id: 'email', label: 'Send Email', icon: 'mail-outline', desc: 'Compose pre-filled emails to your target address.' },
  { id: 'phone', label: 'Phone Call', icon: 'call-outline', desc: 'Prompt immediate dialer action on mobile devices.' },
  { id: 'text', label: 'Plain Text', icon: 'document-text-outline', desc: 'Encode custom messages, instructions, or notes.' },
];

const QRTypeChipItem = React.memo(
  ({
    typeObj,
    isSelected,
    onSelect,
  }: {
    typeObj: QRTypeConfig;
    isSelected: boolean;
    onSelect: (type: QRType) => void;
  }) => {
    const handlePress = React.useCallback(() => {
      onSelect(typeObj.id);
    }, [onSelect, typeObj.id]);

    return (
      <GlassChip
        label={typeObj.label}
        icon={typeObj.icon}
        selected={isSelected}
        onPress={handlePress}
      />
    );
  }
);
QRTypeChipItem.displayName = 'QRTypeChipItem';

const QRTypeCardItem = React.memo(
  ({
    typeObj,
    isSelected,
    extraStyle,
    onSelect,
  }: {
    typeObj: QRTypeConfig;
    isSelected: boolean;
    extraStyle: object;
    onSelect: (type: QRType) => void;
  }) => {
    const { colors } = useTheme();
    const handlePress = React.useCallback(() => {
      onSelect(typeObj.id);
    }, [onSelect, typeObj.id]);

    return (
      <GlassCard
        onPress={handlePress}
        interactive
        hasGlow={isSelected}
        style={[
          extraStyle,
          {
            backgroundColor: isSelected ? '#FFFFFF' : '#FDF6F2',
            borderColor: isSelected ? '#4A0F3A' : 'rgba(74, 15, 58, 0.08)',
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
        className="p-4 rounded-[24px]">
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <View
              style={{
                backgroundColor: isSelected ? '#4A0F3A' : '#FBEDE6',
              }}
              className="w-10 h-10 rounded-[14px] items-center justify-center">
              <Ionicons
                name={typeObj.icon}
                size={20}
                color={isSelected ? '#FFFFFF' : '#4A0F3A'}
              />
            </View>

            {isSelected && (
              <View style={{ backgroundColor: '#4A0F3A' }} className="w-2.5 h-2.5 rounded-full" />
            )}
          </View>

          <Text className="text-ink font-bold text-sm mt-1">{typeObj.label}</Text>
          <Text className="text-ink-muted text-xs leading-4" numberOfLines={2}>
            {typeObj.desc}
          </Text>
        </View>
      </GlassCard>
    );
  }
);
QRTypeCardItem.displayName = 'QRTypeCardItem';

interface QRTypeSelectorProps {
  selectedType: QRType;
  onSelectType: (type: QRType) => void;
  variant?: 'grid' | 'pills' | 'carousel';
}

export const QRTypeSelector = React.memo(function QRTypeSelector({
  selectedType,
  onSelectType,
  variant = 'pills',
}: QRTypeSelectorProps) {
  if (variant === 'pills') {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
        className="my-2">
        {QR_TYPES.map((typeObj) => (
          <QRTypeChipItem
            key={typeObj.id}
            typeObj={typeObj}
            isSelected={selectedType === typeObj.id}
            onSelect={onSelectType}
          />
        ))}
      </ScrollView>
    );
  }

  if (variant === 'carousel') {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingVertical: 4 }}
        className="my-2">
        {QR_TYPES.map((typeObj) => (
          <QRTypeCardItem
            key={typeObj.id}
            typeObj={typeObj}
            isSelected={selectedType === typeObj.id}
            extraStyle={{ width: 168 }}
            onSelect={onSelectType}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <View className="flex-row flex-wrap gap-3 my-2 w-full">
      {QR_TYPES.map((typeObj) => (
        <QRTypeCardItem
          key={typeObj.id}
          typeObj={typeObj}
          isSelected={selectedType === typeObj.id}
          extraStyle={{ flexBasis: '48%', flexGrow: 1 }}
          onSelect={onSelectType}
        />
      ))}
    </View>
  );
});
