import { HeroHeaderBlock } from "@/components/morrow/hero-header-block";
import { TopBar } from "@/components/morrow/top-bar";
import { ActionButtons3D } from "@/components/action-buttons-3d";
import { CinematicInput } from "@/components/cinematic-input";
import { CustomizationStudioControls } from "@/components/customization-studio-controls";
import { ExportModal } from "@/components/export-modal";
import { QRStage3D } from "@/components/qr-stage-3d";
import { QRTypeSelector } from "@/components/qr-type-selector";
import { ThemePresetsBar } from "@/components/theme-presets-bar";
import { GlassContainer } from "@/components/ui/glass-container";
import { useQRGenerator } from "@/hooks/use-qr-generator";
import { CinematicPresets, PresetId } from "@/constants/theme";
import { QRType } from "@/types/qr";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StudioScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ initialType?: string; initialValue?: string }>();
  const initialType = (params.initialType as QRType) || "url";
  const initialValue = params.initialValue;

  const {
    selectedType,
    setSelectedType,
    presetId,
    setPresetId,
    customOpts,
    setCustomOpts,
    payloadValue,
    deferredPayloadValue,
    qrRef,
    handleClearInputs,
    formFields,
  } = useQRGenerator({ initialType, initialValue });

  const [exportOpen, setExportOpen] = useState(false);
  const openExport = useCallback(() => setExportOpen(true), []);
  const closeExport = useCallback(() => setExportOpen(false), []);

  const effectiveQrColor = useMemo(() => {
    if (customOpts.fgColor) return customOpts.fgColor;
    const preset = CinematicPresets.find((p) => p.id === presetId);
    return preset?.qrColor || '#4A0F3A';
  }, [customOpts.fgColor, presetId]);

  const handleSelectPreset = useCallback(
    (id: PresetId) => {
      setPresetId(id);
      const found = CinematicPresets.find((p) => p.id === id);
      setCustomOpts((prev) => ({ ...prev, fgColor: found?.qrColor }));
    },
    [setPresetId, setCustomOpts]
  );

  const handleSelectColor = useCallback(
    (color: string) => setCustomOpts((prev) => ({ ...prev, fgColor: color })),
    [setCustomOpts]
  );

  const handleOpenSettings = useCallback(() => {
    router.navigate("/settings");
  }, [router]);

  return (
    <GlassContainer>
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            alignItems: "center",
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 130,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          removeClippedSubviews={Platform.OS !== "web"}
          overScrollMode="never"
        >
          <View className="w-full max-w-[640px]">
            {/* Top Bar */}
            <TopBar
              title="QRLab"
              actionIcon="person-outline"
              onPressAction={handleOpenSettings}
            />

            {/* Header Section */}
            <HeroHeaderBlock
              eyebrow="Studio workspace"
              headlineLine1="Design &"
              headlineLine2="customize."
              subtitle="Configure data payloads and customize live visual styles."
              showBotanical={true}
            />
            {/* Type selector pills */}
            <QRTypeSelector
              selectedType={selectedType}
              onSelectType={setSelectedType}
              variant="pills"
            />
            {/* Form Input Card */}
            <CinematicInput
              type={selectedType}
              value={selectedType === "text" ? formFields.text : formFields.url}
              onChangeValue={
                selectedType === "text" ? formFields.setText : formFields.setUrl
              }
              wifiSSID={formFields.wifiSSID}
              setWifiSSID={formFields.setWifiSSID}
              wifiPass={formFields.wifiPass}
              setWifiPass={formFields.setWifiPass}
              wifiEnc={formFields.wifiEnc}
              setWifiEnc={formFields.setWifiEnc}
              vName={formFields.vName}
              setVName={formFields.setVName}
              vPhone={formFields.vPhone}
              setVPhone={formFields.setVPhone}
              vEmail={formFields.vEmail}
              setVEmail={formFields.setVEmail}
              vOrg={formFields.vOrg}
              setVOrg={formFields.setVOrg}
              emailTo={formFields.emailTo}
              setEmailTo={formFields.setEmailTo}
              emailSubject={formFields.emailSubject}
              setEmailSubject={formFields.setEmailSubject}
              phoneNum={formFields.phoneNum}
              setPhoneNum={formFields.setPhoneNum}
              onClear={handleClearInputs}
            />
            {/* Live 3D Stage Hero */}
            <QRStage3D
              value={deferredPayloadValue}
              presetId={presetId}
              qrRef={qrRef}
              typeLabel={selectedType}
              title="Live QR Preview"
              fgColor={effectiveQrColor}
              options={customOpts}
              onExport={openExport}
            />
            {/* Action Buttons */}
            <ActionButtons3D onOpenExport={openExport} />
            {/* Workspace Customization Studio */}
            <CustomizationStudioControls
              options={customOpts}
              onChangeOptions={setCustomOpts}
            />
            {/* Theme Presets & Color Picker */}
            <ThemePresetsBar
              selectedPresetId={presetId}
              onSelectPreset={handleSelectPreset}
              selectedColor={customOpts.fgColor}
              onSelectColor={handleSelectColor}
            />
          </View>
        </ScrollView>
        {/* EXPORT MODAL */}
        <ExportModal
          visible={exportOpen}
          onClose={closeExport}
          payloadValue={payloadValue}
          qrRef={qrRef}
          presetId={presetId}
          typeLabel={selectedType}
          fgColor={effectiveQrColor}
          options={customOpts}
        />
      </SafeAreaView>
    </GlassContainer>
  );
}
