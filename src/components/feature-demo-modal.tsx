import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { CustomStyledQRCode } from '@/components/ui/custom-styled-qr-code';
import { GlassBadge } from '@/components/ui/glass-badge';
import { GlassButton } from '@/components/ui/glass-button';
import { Palette } from '@/constants/theme';
import { Typography } from '@/constants/theme/typography';
import { useTheme } from '@/hooks/use-theme';
import { AppStorageService } from '@/services/storage/app-storage.service';
import { EyeStyle, ModuleShape } from '@/types/qr';

interface FeatureDemoModalProps {
  visible: boolean;
  onClose: () => void;
  isInitialLoading?: boolean;
}

const DEMO_STEPS = [
  { id: 0, title: 'QR Studio', badge: 'Interactive Studio' },
  { id: 1, title: 'Lossless Vector', badge: 'SVG & 300 DPI' },
  { id: 2, title: 'Optical Scanner', badge: 'Offline Vision' },
  { id: 3, title: 'Turnkey Templates', badge: 'Smart Presets' },
  { id: 4, title: '100% Privacy', badge: 'Local-First' },
];

export const FeatureDemoModal: React.FC<FeatureDemoModalProps> = memo(
  ({ visible, onClose, isInitialLoading = false }) => {
    const { colors } = useTheme();

    const [currentStep, setCurrentStep] = useState(0);

    // Interactive Demo 1: QR Shape & Eye mutation states
    const [demoShape, setDemoShape] = useState<ModuleShape>('rounded');
    const [demoEye, setDemoEye] = useState<EyeStyle>('rounded');
    const [demoColor, setDemoColor] = useState<string>(Palette.plum);

    // Interactive Demo 2: Export formats
    const [demoExportFormat, setDemoExportFormat] = useState<'svg' | 'png' | 'pdf'>('svg');

    // Interactive Demo 3: Optical Scanner simulation
    const [simulatedScanDetected, setSimulatedScanDetected] = useState(false);

    // Interactive Demo 4: Template Category selection
    const [demoCategory, setDemoCategory] = useState<'business' | 'wifi' | 'restaurant' | 'vcard'>('business');

    // Laser bar animation for scanner demo
    const laserY = useSharedValue(0);

    useEffect(() => {
      laserY.value = withRepeat(
        withSequence(
          withTiming(120, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      );
    }, [laserY]);

    const laserAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: laserY.value }],
    }));

    const handleDismiss = useCallback(async () => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      }
      await AppStorageService.setHasSeenFeatureDemo(true);
      onClose();
    }, [onClose]);

    const handleNext = useCallback(async () => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
      } else {
        await handleDismiss();
      }
    }, [currentStep, handleDismiss]);

    const handlePrev = useCallback(() => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      if (currentStep > 0) {
        setCurrentStep((prev) => prev - 1);
      }
    }, [currentStep]);

    const triggerHaptic = useCallback(() => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
    }, []);

    if (!visible) return null;

    return (
      <Modal visible={visible} animationType="fade" transparent onRequestClose={handleDismiss}>
        <View style={styles.backdrop}>
          <View
            style={[
              styles.dialogContainer,
              {
                backgroundColor: colors.surface,
                borderColor: 'rgba(74, 15, 58, 0.18)',
              },
            ]}
          >
            {/* TOP HEADER & TITLE */}
            <View style={styles.headerRow}>
              <View className="flex-row items-center gap-2">
                <View
                  style={{ backgroundColor: Palette.plum, borderColor: '#380B2C' }}
                  className="w-7 h-7 rounded-none border items-center justify-center"
                >
                  <Ionicons name="qr-code" size={15} color="#FFFFFF" />
                </View>
                <View>
                  <Text
                    style={{ fontFamily: Typography.serifFamily }}
                    className="text-ink text-lg font-bold tracking-tight"
                  >
                    QRLab Feature Demo
                  </Text>
                  <Text className="text-ink-muted text-[10px] -mt-0.5">
                    Interactive Walkthrough & Capabilities
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-2">
                <View
                  style={{ borderColor: Palette.plum, backgroundColor: 'rgba(74, 15, 58, 0.08)' }}
                  className="px-2.5 py-1 border rounded-none"
                >
                  <Text className="text-plum text-[11px] font-bold">
                    Step {currentStep + 1} / 5
                  </Text>
                </View>

                <Pressable
                  accessibilityLabel="Close tour"
                  accessibilityRole="button"
                  onPress={handleDismiss}
                  style={{ borderWidth: 1.5, borderColor: 'rgba(74, 15, 58, 0.18)', backgroundColor: '#FDF6F2' }}
                  className="w-7 h-7 rounded-none items-center justify-center active:scale-95"
                >
                  <Ionicons name="close" size={16} color="#1A1416" />
                </Pressable>
              </View>
            </View>

            {/* STEP SELECTOR TABS STRIP */}
            <View className="flex-row border-b border-black/10 bg-[#FDF6F2]">
              {DEMO_STEPS.map((s, idx) => {
                const isActive = currentStep === idx;
                return (
                  <Pressable
                    key={s.id}
                    onPress={() => {
                      triggerHaptic();
                      setCurrentStep(idx);
                    }}
                    style={{
                      borderBottomWidth: isActive ? 2.5 : 0,
                      borderBottomColor: Palette.plum,
                      backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                    }}
                    className="flex-1 py-2 items-center justify-center"
                  >
                    <Text
                      style={{
                        color: isActive ? Palette.plum : colors.secondaryText,
                        fontWeight: isActive ? '700' : '500',
                      }}
                      className="text-[10px] text-center"
                    >
                      {s.title}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* INITIAL LOADING STATUS BANNER (IF FIRST VISIT) */}
            {isInitialLoading && (
              <View
                style={{ backgroundColor: 'rgba(74, 15, 58, 0.06)', borderColor: 'rgba(74, 15, 58, 0.15)' }}
                className="px-3.5 py-1.5 border-b flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="sparkles" size={13} color={Palette.plum} />
                  <Text className="text-plum text-[11px] font-bold">
                    First Visit Initialized: Vector Core Ready
                  </Text>
                </View>
                <Text className="text-emerald-700 font-mono text-[10px] font-bold">100% ONLINE</Text>
              </View>
            )}

            {/* INTERACTIVE FEATURE DEMO SCROLLABLE BODY */}
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              {/* FEATURE 01: STYLIZED QR STUDIO */}
              {currentStep === 0 && (
                <View className="gap-3.5 w-full">
                  <View className="flex-row items-center justify-between">
                    <GlassBadge label="FEATURE 01 OF 05" variant="primary" />
                    <View
                      style={{ borderColor: 'rgba(74, 15, 58, 0.25)', backgroundColor: 'rgba(74, 15, 58, 0.06)' }}
                      className="px-2 py-0.5 border rounded-none"
                    >
                      <Text className="text-plum text-[10px] font-bold uppercase">Live Playground</Text>
                    </View>
                  </View>

                  <View>
                    <Text
                      style={{ fontFamily: Typography.serifFamily }}
                      className="text-ink text-2xl font-bold tracking-tight"
                    >
                      Stylized QR Studio
                    </Text>
                    <Text className="text-ink-muted text-xs leading-5 mt-1">
                      Craft tailored, high-converting QR codes with real-time responsive matrix morphing, custom eye shapes, and branded color palettes.
                    </Text>
                  </View>

                  {/* LIVE INTERACTIVE CANVAS */}
                  <View
                    style={{
                      borderColor: 'rgba(74, 15, 58, 0.16)',
                      backgroundColor: '#FFFFFF',
                      borderWidth: 1.5,
                    }}
                    className="p-4 items-center justify-center rounded-none shadow-sm gap-3"
                  >
                    <View className="p-2.5 bg-white border border-black/5 rounded-none shadow-xs">
                      <CustomStyledQRCode
                        value="https://qrlab.me/interactive-demo"
                        size={135}
                        color={demoColor}
                        backgroundColor="#FFFFFF"
                        moduleShape={demoShape}
                        eyeStyle={demoEye}
                      />
                    </View>

                    {/* LIVE INTERACTIVE CONTROLS */}
                    <View className="w-full gap-2 pt-2 border-t border-black/5">
                      <Text className="text-ink text-[11px] font-bold text-center">
                        Tap Below to Mutate QR Code in Real-Time:
                      </Text>

                      {/* Shape Switchers */}
                      <View className="flex-row items-center justify-center gap-2">
                        {(['rounded', 'dots', 'square'] as ModuleShape[]).map((shape) => (
                          <Pressable
                            key={shape}
                            onPress={() => {
                              triggerHaptic();
                              setDemoShape(shape);
                              setDemoEye(shape === 'dots' ? 'circle' : shape === 'rounded' ? 'rounded' : 'square');
                            }}
                            style={{
                              backgroundColor: demoShape === shape ? Palette.plum : '#FDF6F2',
                              borderColor: demoShape === shape ? '#380B2C' : 'rgba(74, 15, 58, 0.2)',
                              borderWidth: 1.5,
                            }}
                            className="px-3 py-1.5 rounded-none active:scale-95"
                          >
                            <Text
                              style={{ color: demoShape === shape ? '#FFFFFF' : '#1A1416' }}
                              className="text-xs font-bold capitalize"
                            >
                              {shape === 'rounded' ? 'Smooth' : shape === 'dots' ? 'Micro Dots' : 'Classic'}
                            </Text>
                          </Pressable>
                        ))}
                      </View>

                      {/* Color Palette Swatches */}
                      <View className="flex-row items-center justify-center gap-2.5 pt-1">
                        <Text className="text-ink-muted text-[10px] font-medium mr-1">Tints:</Text>
                        {[
                          { color: '#4A0F3A', name: 'Plum' },
                          { color: '#2563EB', name: 'Ocean' },
                          { color: '#059669', name: 'Emerald' },
                          { color: '#EA580C', name: 'Sunset' },
                          { color: '#1A1416', name: 'Ink' },
                        ].map((item) => (
                          <Pressable
                            key={item.color}
                            onPress={() => {
                              triggerHaptic();
                              setDemoColor(item.color);
                            }}
                            style={{
                              backgroundColor: item.color,
                              borderColor: demoColor === item.color ? '#1A1416' : 'rgba(0,0,0,0.15)',
                              borderWidth: demoColor === item.color ? 2.5 : 1,
                            }}
                            className="w-6 h-6 rounded-none active:scale-90"
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* FEATURE 02: LOSSLESS VECTOR SVG & PDF PRINT */}
              {currentStep === 1 && (
                <View className="gap-3.5 w-full">
                  <View className="flex-row items-center justify-between">
                    <GlassBadge label="FEATURE 02 OF 05" variant="primary" />
                    <View
                      style={{ borderColor: 'rgba(74, 15, 58, 0.25)', backgroundColor: 'rgba(74, 15, 58, 0.06)' }}
                      className="px-2 py-0.5 border rounded-none"
                    >
                      <Text className="text-plum text-[10px] font-bold uppercase">Vector Engine</Text>
                    </View>
                  </View>

                  <View>
                    <Text
                      style={{ fontFamily: Typography.serifFamily }}
                      className="text-ink text-2xl font-bold tracking-tight"
                    >
                      Lossless Vector & Print
                    </Text>
                    <Text className="text-ink-muted text-xs leading-5 mt-1">
                      Render infinite-DPI SVG vectors for commercial print packaging, laser-cutting, store signs, and 300 DPI high-definition files.
                    </Text>
                  </View>

                  {/* FORMAT SELECTOR DEMO CARD */}
                  <View
                    style={{
                      borderColor: 'rgba(74, 15, 58, 0.16)',
                      backgroundColor: '#FFFFFF',
                      borderWidth: 1.5,
                    }}
                    className="p-4 rounded-none shadow-sm gap-3"
                  >
                    <Text className="text-ink text-xs font-bold">Select Export Format Preview:</Text>

                    <View className="gap-2">
                      {[
                        { id: 'svg', label: 'SVG Vector Path', desc: 'Infinite scale, lossless XML paths', badge: 'PRO VECTOR' },
                        { id: 'png', label: 'PNG 1024x1024 @ 300 DPI', desc: 'Crisp raster with guaranteed solid white backing', badge: 'HIGH RES' },
                        { id: 'pdf', label: 'PDF Print Sheet', desc: 'Standard multi-grid layout ready for print', badge: 'PRINT READY' },
                      ].map((fmt) => (
                        <Pressable
                          key={fmt.id}
                          onPress={() => {
                            triggerHaptic();
                            setDemoExportFormat(fmt.id as any);
                          }}
                          style={{
                            backgroundColor: demoExportFormat === fmt.id ? 'rgba(74, 15, 58, 0.08)' : '#FDF6F2',
                            borderColor: demoExportFormat === fmt.id ? Palette.plum : 'rgba(74, 15, 58, 0.15)',
                            borderWidth: 1.5,
                            borderLeftWidth: demoExportFormat === fmt.id ? 4 : 1.5,
                          }}
                          className="p-3 rounded-none active:scale-98 flex-row items-center justify-between"
                        >
                          <View className="flex-1 mr-2">
                            <Text
                              style={{ color: demoExportFormat === fmt.id ? Palette.plum : '#1A1416' }}
                              className="text-xs font-bold"
                            >
                              {fmt.label}
                            </Text>
                            <Text className="text-[10px] text-ink-muted mt-0.5">
                              {fmt.desc}
                            </Text>
                          </View>
                          <View
                            style={{
                              backgroundColor: demoExportFormat === fmt.id ? Palette.plum : 'rgba(74,15,58,0.08)',
                              borderColor: demoExportFormat === fmt.id ? '#380B2C' : 'transparent',
                              borderWidth: 1,
                            }}
                            className="px-2 py-0.5 rounded-none"
                          >
                            <Text
                              style={{ color: demoExportFormat === fmt.id ? '#FFFFFF' : Palette.plum }}
                              className="text-[9px] font-bold"
                            >
                              {fmt.badge}
                            </Text>
                          </View>
                        </Pressable>
                      ))}
                    </View>

                    {/* LIVE CODE / SPEC INSPECTOR */}
                    <View
                      style={{ backgroundColor: '#1A1416', borderColor: 'rgba(74, 15, 58, 0.2)' }}
                      className="p-3 border rounded-none gap-1"
                    >
                      <Text className="text-emerald-400 font-mono text-[10px] font-bold">
                        {demoExportFormat === 'svg'
                          ? '✓ XML Vector Geometry Verified'
                          : demoExportFormat === 'png'
                          ? '✓ 300 DPI Canvas Rendering (RGBA8888)'
                          : '✓ ISO PDF Print Matrix Layout Formatted'}
                      </Text>
                      <Text className="text-white/70 font-mono text-[9px] leading-3.5">
                        {demoExportFormat === 'svg'
                          ? '<svg viewBox="0 0 348 348">\n  <rect width="100%" height="100%" fill="#FFF"/>\n  <g id="modules">{vectorPaths}</g>\n</svg>'
                          : demoExportFormat === 'png'
                          ? 'Resolution: 1024 x 1024 px | Compression: Lossless Deflate | TrueColor White Background'
                          : 'Pages: 1 | Margin: 24pt | Grid: 4x4 Tiles | Cut Lines: Enabled'}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* FEATURE 03: OPTICAL CAMERA SCANNER */}
              {currentStep === 2 && (
                <View className="gap-3.5 w-full">
                  <View className="flex-row items-center justify-between">
                    <GlassBadge label="FEATURE 03 OF 05" variant="primary" />
                    <View
                      style={{ borderColor: 'rgba(74, 15, 58, 0.25)', backgroundColor: 'rgba(74, 15, 58, 0.06)' }}
                      className="px-2 py-0.5 border rounded-none"
                    >
                      <Text className="text-plum text-[10px] font-bold uppercase">Offline Vision</Text>
                    </View>
                  </View>

                  <View>
                    <Text
                      style={{ fontFamily: Typography.serifFamily }}
                      className="text-ink text-2xl font-bold tracking-tight"
                    >
                      Instant Optical Scanner
                    </Text>
                    <Text className="text-ink-muted text-xs leading-5 mt-1">
                      High-speed optical camera detection with integrated flashlight torch, instant matrix decoding, and direct clipboard actions.
                    </Text>
                  </View>

                  {/* SCANNER CAMERA SIMULATION CARD */}
                  <View
                    style={{
                      borderColor: '#1A1416',
                      backgroundColor: '#1A1416',
                      borderWidth: 1.5,
                    }}
                    className="p-4 items-center justify-center rounded-none shadow-sm gap-3 overflow-hidden relative min-h-[200px]"
                  >
                    {/* CAMERA RETICLE VIEWFINDER */}
                    <View className="w-44 h-32 border border-white/20 rounded-none relative justify-center items-center bg-black/40">
                      <View style={{ borderColor: '#F7B9A5' }} className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" />
                      <View style={{ borderColor: '#F7B9A5' }} className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2" />
                      <View style={{ borderColor: '#F7B9A5' }} className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2" />
                      <View style={{ borderColor: '#F7B9A5' }} className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" />

                      {/* Animated Laser Scan Bar */}
                      <Animated.View
                        style={[
                          laserAnimatedStyle,
                          {
                            position: 'absolute',
                            top: 4,
                            left: 6,
                            right: 6,
                            height: 2.5,
                            backgroundColor: '#F7B9A5',
                            shadowColor: '#F7B9A5',
                            shadowOpacity: 0.9,
                            shadowRadius: 8,
                          },
                        ]}
                      />

                      <Ionicons name="qr-code-outline" size={48} color="rgba(255, 255, 255, 0.25)" />
                    </View>

                    {/* INTERACTIVE SCAN SIMULATOR BUTTON */}
                    <Pressable
                      onPress={() => {
                        triggerHaptic();
                        setSimulatedScanDetected(!simulatedScanDetected);
                      }}
                      style={{
                        backgroundColor: simulatedScanDetected ? '#059669' : Palette.plum,
                        borderColor: simulatedScanDetected ? '#047857' : '#380B2C',
                        borderWidth: 1.5,
                      }}
                      className="px-4 py-2 rounded-none active:scale-95 flex-row items-center gap-2"
                    >
                      <Ionicons
                        name={simulatedScanDetected ? 'checkmark-circle' : 'scan'}
                        size={16}
                        color="#FFFFFF"
                      />
                      <Text className="text-white text-xs font-bold uppercase tracking-wider">
                        {simulatedScanDetected ? 'Code Detected: https://qrlab.me' : 'Tap to Simulate Camera Scan'}
                      </Text>
                    </Pressable>

                    {simulatedScanDetected && (
                      <View
                        style={{ backgroundColor: '#FFFFFF', borderColor: '#059669' }}
                        className="w-full p-2.5 border-l-4 border-y border-r rounded-none flex-row items-center justify-between"
                      >
                        <View className="flex-1 mr-2">
                          <Text className="text-[10px] font-bold text-emerald-800 uppercase">Payload Decoded:</Text>
                          <Text className="text-xs font-mono text-ink" numberOfLines={1}>
                            https://qrlab.me/pro-studio
                          </Text>
                        </View>
                        <View className="px-2 py-0.5 bg-emerald-100 border border-emerald-300 rounded-none">
                          <Text className="text-[9px] font-bold text-emerald-800">COPIED</Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* FEATURE 04: TURNKEY INDUSTRY TEMPLATES */}
              {currentStep === 3 && (
                <View className="gap-3.5 w-full">
                  <View className="flex-row items-center justify-between">
                    <GlassBadge label="FEATURE 04 OF 05" variant="primary" />
                    <View
                      style={{ borderColor: 'rgba(74, 15, 58, 0.25)', backgroundColor: 'rgba(74, 15, 58, 0.06)' }}
                      className="px-2 py-0.5 border rounded-none"
                    >
                      <Text className="text-plum text-[10px] font-bold uppercase">Quick Start</Text>
                    </View>
                  </View>

                  <View>
                    <Text
                      style={{ fontFamily: Typography.serifFamily }}
                      className="text-ink text-2xl font-bold tracking-tight"
                    >
                      Industry Templates
                    </Text>
                    <Text className="text-ink-muted text-xs leading-5 mt-1">
                      Pre-formatted schemas tailored for businesses, restaurant dining, corporate Wi-Fi connections, and digital business cards.
                    </Text>
                  </View>

                  {/* CATEGORY SWITCHER BUTTONS */}
                  <View className="flex-row flex-wrap gap-2">
                    {[
                      { id: 'business', label: 'Business', color: '#2563EB', icon: 'briefcase-outline' },
                      { id: 'wifi', label: 'Wi-Fi 5G', color: '#059669', icon: 'wifi-outline' },
                      { id: 'restaurant', label: 'Restaurant', color: '#EA580C', icon: 'restaurant-outline' },
                      { id: 'vcard', label: 'vCard', color: '#7C3AED', icon: 'person-outline' },
                    ].map((cat) => (
                      <Pressable
                        key={cat.id}
                        onPress={() => {
                          triggerHaptic();
                          setDemoCategory(cat.id as any);
                        }}
                        style={{
                          backgroundColor: demoCategory === cat.id ? cat.color : '#FFFFFF',
                          borderColor: cat.color,
                          borderWidth: 1.5,
                        }}
                        className="px-3 py-1.5 rounded-none flex-row items-center gap-1.5 active:scale-95"
                      >
                        <Ionicons
                          name={cat.icon as any}
                          size={13}
                          color={demoCategory === cat.id ? '#FFFFFF' : cat.color}
                        />
                        <Text
                          style={{ color: demoCategory === cat.id ? '#FFFFFF' : '#1A1416' }}
                          className="text-xs font-bold"
                        >
                          {cat.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  {/* PREVIEW TEMPLATE CARD WITH COLOR CODED BORDER */}
                  <View
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderColor:
                        demoCategory === 'business'
                          ? '#2563EB'
                          : demoCategory === 'wifi'
                          ? '#059669'
                          : demoCategory === 'restaurant'
                          ? '#EA580C'
                          : '#7C3AED',
                      borderWidth: 1.5,
                      borderLeftWidth: 5,
                    }}
                    className="p-4 rounded-none shadow-sm gap-2"
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="text-ink text-sm font-bold">
                        {demoCategory === 'business'
                          ? 'Executive Corporate Profile'
                          : demoCategory === 'wifi'
                          ? 'WPA3 Encrypted Office Network'
                          : demoCategory === 'restaurant'
                          ? 'Contactless Menu & Daily Specials'
                          : 'Full Contact Card & vCard 3.0'}
                      </Text>
                      <View
                        style={{
                          borderColor:
                            demoCategory === 'business'
                              ? '#2563EB'
                              : demoCategory === 'wifi'
                              ? '#059669'
                              : demoCategory === 'restaurant'
                              ? '#EA580C'
                              : '#7C3AED',
                          borderWidth: 1,
                        }}
                        className="px-2 py-0.5 rounded-none"
                      >
                        <Text className="text-[10px] font-bold uppercase">READY TO USE</Text>
                      </View>
                    </View>
                    <Text className="text-ink-muted text-xs leading-4">
                      {demoCategory === 'business'
                        ? 'Generates instant links to your corporate website, LinkedIn, and media kit.'
                        : demoCategory === 'wifi'
                        ? 'Enables guests to connect instantly without manually typing complex Wi-Fi passphrases.'
                        : demoCategory === 'restaurant'
                        ? 'Direct diners seamlessly to seasonal menus, table reservation portals, and allergen guides.'
                        : 'Transfers complete contact information into the recipient phone address book with a single scan.'}
                    </Text>
                  </View>
                </View>
              )}

              {/* FEATURE 05: 100% PRIVATE & OFFLINE ENGINE */}
              {currentStep === 4 && (
                <View className="gap-3.5 w-full">
                  <View className="flex-row items-center justify-between">
                    <GlassBadge label="FEATURE 05 OF 05" variant="primary" />
                    <View
                      style={{ borderColor: '#059669', backgroundColor: 'rgba(5, 150, 105, 0.08)' }}
                      className="px-2 py-0.5 border rounded-none"
                    >
                      <Text className="text-emerald-700 text-[10px] font-bold uppercase">Security & Ownership</Text>
                    </View>
                  </View>

                  <View>
                    <Text
                      style={{ fontFamily: Typography.serifFamily }}
                      className="text-ink text-2xl font-bold tracking-tight"
                    >
                      100% Offline & Private
                    </Text>
                    <Text className="text-ink-muted text-xs leading-5 mt-1">
                      No cloud accounts, zero telemetry, and complete ownership of every vector asset and barcode you generate.
                    </Text>
                  </View>

                  {/* SECURITY SPECS CARD */}
                  <View
                    style={{
                      borderColor: '#059669',
                      backgroundColor: '#FFFFFF',
                      borderWidth: 1.5,
                      borderLeftWidth: 5,
                    }}
                    className="p-4 rounded-none shadow-sm gap-3"
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        style={{ backgroundColor: 'rgba(5, 150, 105, 0.12)', borderColor: '#059669' }}
                        className="w-10 h-10 border rounded-none items-center justify-center"
                      >
                        <Ionicons name="shield-checkmark" size={20} color="#059669" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-ink text-sm font-bold">Local-First Architecture</Text>
                        <Text className="text-ink-muted text-xs">No analytics SDKs, tracking IDs, or remote payloads.</Text>
                      </View>
                    </View>

                    <View className="pt-2 border-t border-black/5 gap-2">
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="checkmark-done" size={15} color="#059669" />
                        <Text className="text-xs text-ink">100% encrypted on-device storage</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="checkmark-done" size={15} color="#059669" />
                        <Text className="text-xs text-ink">Free commercial ownership of all QR designs</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="checkmark-done" size={15} color="#059669" />
                        <Text className="text-xs text-ink">Zero camera images or video frames leave your phone</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* BOTTOM ACTION BAR */}
            <View style={styles.footerRow}>
              {currentStep > 0 ? (
                <GlassButton
                  title="Back"
                  variant="secondary"
                  size="md"
                  onPress={handlePrev}
                />
              ) : (
                <GlassButton
                  title="Skip Demo"
                  variant="ghost"
                  size="md"
                  onPress={handleDismiss}
                />
              )}

              <GlassButton
                title={currentStep === 4 ? 'Enter QRLab' : 'Next Feature'}
                icon={currentStep === 4 ? 'rocket-outline' : 'arrow-forward'}
                iconPosition="right"
                variant="primary"
                size="md"
                onPress={handleNext}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);

FeatureDemoModal.displayName = 'FeatureDemoModal';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 20, 22, 0.70)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  dialogContainer: {
    width: '100%',
    maxWidth: 500,
    height: Platform.OS === 'web' ? 620 : '85%',
    maxHeight: 700,
    borderWidth: 1.5,
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    ...Platform.select({
      ios: {
        shadowColor: '#4A0F3A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 18,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 12px 32px rgba(74, 15, 58, 0.25)',
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(74, 15, 58, 0.08)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(74, 15, 58, 0.08)',
    backgroundColor: '#FDF6F2',
  },
});
