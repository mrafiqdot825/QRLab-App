import { PlainTextEditorModal } from '@/components/plain-text-editor-modal';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassInput } from '@/components/ui/glass-input';
import { Palette } from '@/constants/theme';
import { QRType } from '@/types/qr';
import { openInDefaultTextEditor } from '@/utils/qr-exporter';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

interface CinematicInputProps {
  type: QRType;
  value: string;
  onChangeValue: (text: string) => void;

  // WiFi
  wifiSSID?: string;
  setWifiSSID?: (text: string) => void;
  wifiPass?: string;
  setWifiPass?: (text: string) => void;
  wifiEnc?: 'WPA' | 'WEP' | 'nopass';
  setWifiEnc?: (type: 'WPA' | 'WEP' | 'nopass') => void;

  // VCard
  vName?: string;
  setVName?: (text: string) => void;
  vPhone?: string;
  setVPhone?: (text: string) => void;
  vEmail?: string;
  setVEmail?: (text: string) => void;
  vOrg?: string;
  setVOrg?: (text: string) => void;

  // Email
  emailTo?: string;
  setEmailTo?: (text: string) => void;
  emailSubject?: string;
  setEmailSubject?: (text: string) => void;

  // Phone
  phoneNum?: string;
  setPhoneNum?: (text: string) => void;

  onClear?: () => void;
}

export const CinematicInput = React.memo(function CinematicInput({
  type,
  value,
  onChangeValue,
  wifiSSID = '',
  setWifiSSID,
  wifiPass = '',
  setWifiPass,
  vName = '',
  setVName,
  vPhone = '',
  setVPhone,
  vEmail = '',
  setVEmail,
  vOrg = '',
  setVOrg,
  emailTo = '',
  setEmailTo,
  emailSubject = '',
  setEmailSubject,
  phoneNum = '',
  setPhoneNum,
  onClear,
}: CinematicInputProps) {
  const [editorOpen, setEditorOpen] = useState(false);

  const openEditor = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
    setEditorOpen(true);
  }, []);

  const closeEditor = useCallback(() => {
    setEditorOpen(false);
  }, []);

  return (
    <GlassCard className="p-5 my-3 w-full">
      <View className="gap-4">
        {type === 'url' && (
          <GlassInput
            label="WEBSITE URL"
            icon="link-outline"
            placeholder="https://yourwebsite.com"
            value={value}
            onChangeText={onChangeValue}
            autoCapitalize="none"
            keyboardType="url"
            onClear={onClear}
          />
        )}



        {type === 'text' && (
          <View className="gap-2">
            <GlassInput
              label="CUSTOM MESSAGE"
              icon="document-text-outline"
              placeholder="Type your announcement, note or plain text..."
              value={value}
              onChangeText={onChangeValue}
              multiline
              numberOfLines={3}
              onClear={onClear}
            />

            <View className="flex-row items-center justify-between pt-1">
              <Text className="text-on-surface-variant text-xs">
                {value ? `${value.length} characters` : '0 characters'}
              </Text>

              <View className="flex-row items-center gap-2">
                <Pressable
                  accessibilityLabel="Open in Phone Default Text Editor"
                  accessibilityRole="button"
                  onPress={() => {
                    if (Platform.OS !== 'web') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                    }
                    openInDefaultTextEditor(value);
                  }}
                  style={{ backgroundColor: '#FDF6F2', borderColor: 'rgba(74, 15, 58, 0.08)' }}
                  className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border active:scale-95">
                  <Ionicons name="open-outline" size={14} color="#1A1416" />
                  <Text className="text-ink text-xs font-bold">Open in Editor</Text>
                </Pressable>

                <Pressable
                  accessibilityLabel="Expand full text editor"
                  accessibilityRole="button"
                  onPress={openEditor}
                  style={{ backgroundColor: 'rgba(74, 15, 58, 0.08)', borderColor: 'rgba(74, 15, 58, 0.15)' }}
                  className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border active:scale-95">
                  <Ionicons name="expand-outline" size={14} color="#4A0F3A" />
                  <Text className="text-plum text-xs font-bold">Expand</Text>
                </Pressable>
              </View>
            </View>

            <PlainTextEditorModal
              visible={editorOpen}
              onClose={closeEditor}
              value={value}
              onChangeValue={onChangeValue}
            />
          </View>
        )}

        {type === 'wifi' && (
          <View className="gap-3">
            <GlassInput
              label="NETWORK NAME (SSID)"
              icon="wifi-outline"
              placeholder="e.g. Office_Guest_5G"
              value={wifiSSID}
              onChangeText={setWifiSSID}
            />
            <GlassInput
              label="PASSWORD"
              icon="lock-closed-outline"
              placeholder="Enter Wi-Fi password"
              value={wifiPass}
              onChangeText={setWifiPass}
              secureTextEntry
            />
          </View>
        )}

        {type === 'vcard' && (
          <View className="gap-3">
            <GlassInput
              label="FULL NAME"
              icon="person-outline"
              placeholder="MRafiqdot"
              value={vName}
              onChangeText={setVName}
            />
            <GlassInput
              label="PHONE NUMBER"
              icon="call-outline"
              placeholder="+923129185825"
              value={vPhone}
              onChangeText={setVPhone}
              keyboardType="phone-pad"
            />
            <GlassInput
              label="EMAIL ADDRESS"
              icon="mail-outline"
              placeholder="mrafiqdot825@gmail.com"
              value={vEmail}
              onChangeText={setVEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <GlassInput
              label="ORGANIZATION"
              icon="briefcase-outline"
              placeholder="Design Studio"
              value={vOrg}
              onChangeText={setVOrg}
            />
          </View>
        )}

        {type === 'email' && (
          <View className="gap-3">
            <GlassInput
              label="RECIPIENT EMAIL"
              icon="mail-outline"
              placeholder="mrafiqdot825@gmail.com"
              value={emailTo}
              onChangeText={setEmailTo}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <GlassInput
              label="SUBJECT LINE"
              icon="create-outline"
              placeholder="Inquiry regarding QRLab"
              value={emailSubject}
              onChangeText={setEmailSubject}
            />
          </View>
        )}

        {type === 'phone' && (
          <GlassInput
            label="TARGET PHONE NUMBER"
            icon="call-outline"
            placeholder="+923129185825"
            value={phoneNum}
            onChangeText={setPhoneNum}
            keyboardType="phone-pad"
            onClear={onClear}
          />
        )}
      </View>
    </GlassCard>
  );
});
