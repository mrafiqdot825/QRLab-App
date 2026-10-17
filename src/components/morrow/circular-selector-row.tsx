import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/theme';
import { QRType } from '@/types/qr';

export interface CircularOptionItem {
  id: QRType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  tintColor: string;
}

export const DEFAULT_QR_CIRCLES: CircularOptionItem[] = [
  { id: 'url', label: 'Website', icon: 'link-outline', tintColor: '#D9D4F5' },
  { id: 'wifi', label: 'Wi-Fi', icon: 'wifi-outline', tintColor: '#C9D8BE' },
  { id: 'vcard', label: 'Contact', icon: 'person-outline', tintColor: '#FBE9A8' },
  { id: 'email', label: 'Email', icon: 'mail-outline', tintColor: '#F7B9A5' },
  { id: 'text', label: 'Text', icon: 'document-text-outline', tintColor: '#AFC0F5' },
];

interface CircularSelectorRowProps {
  selectedId: QRType;
  onSelect: (id: QRType) => void;
  options?: CircularOptionItem[];
}

export const CircularSelectorRow = React.memo(function CircularSelectorRow({
  selectedId,
  onSelect,
  options = DEFAULT_QR_CIRCLES,
}: CircularSelectorRowProps) {
  return (
    <View className="flex-row items-center justify-between w-full pt-1 pb-2">
      {options.map((item) => {
        const isSelected = selectedId === item.id;

        const handlePress = () => {
          if (Platform.OS !== 'web') {
            Haptics.selectionAsync().catch(() => {});
          }
          onSelect(item.id);
        };

        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={`Select ${item.label}`}
            onPress={handlePress}
            className="items-center gap-1.5 flex-1 active:scale-95"
          >
            {/* Circle with tint + selection ring */}
            <View
              style={[
                styles.circle,
                { backgroundColor: item.tintColor },
                isSelected && styles.circleSelected,
              ]}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color={isSelected ? '#4A0F3A' : '#1A1416'}
              />
            </View>

            {/* Label below */}
            <Text
              style={[
                styles.label,
                isSelected ? styles.labelSelected : styles.labelUnselected,
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    boxShadow: '0px 2px 6px rgba(74, 15, 58, 0.06)',
  },
  circleSelected: {
    borderColor: '#4A0F3A',
    boxShadow: '0px 3px 10px rgba(74, 15, 58, 0.18)',
  },
  label: {
    fontSize: 12,
    letterSpacing: -0.2,
  },
  labelSelected: {
    color: '#4A0F3A',
    fontWeight: '700',
  },
  labelUnselected: {
    color: '#1A1416',
    fontWeight: '500',
  },
});

