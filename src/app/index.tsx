import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ds/app-text';
import { Button, IconButton } from '@/components/ds/controls';
import { QrGlyph } from '@/components/ds/qr-glyph';
import { QrThumb } from '@/components/ds/qr-thumb';
import { StatusScrim, TopBlock, useHeaderTop } from '@/components/ds/top-block';
import { C, PAD, SHADOW_CARD } from '@/constants/design';
import { QR_TYPES, QRTypeConfig } from '@/constants/qr-types';
import { categoryLabel, QRTemplate, TEMPLATES_LIST } from '@/features/templates/constants/templates';
import { useModals } from '@/hooks/use-modals';
import { haptic } from '@/services/preferences';
import { QRType } from '@/types/qr';

const FEATURED = TEMPLATES_LIST.slice(0, 4);

const QuickTile = React.memo(function QuickTile({
  item,
  onPress,
}: {
  item: QRTypeConfig;
  onPress: (type: QRType) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(item.id)}
      accessibilityRole="button"
      accessibilityLabel={`New ${item.label} code`}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}>
      <View style={styles.tileIcon}>
        <Ionicons name={item.icon} size={17} color={C.brand} />
      </View>
      <AppText weight="semibold" size={13.5}>
        {item.label}
      </AppText>
    </Pressable>
  );
});

const TemplateCard = React.memo(function TemplateCard({
  item,
  onPress,
}: {
  item: QRTemplate;
  onPress: (t: QRTemplate) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.title} template`}
      style={({ pressed }) => [styles.tplCard, pressed && styles.pressed]}>
      <View style={styles.tplThumb}>
        <QrThumb value={item.sampleValue} size={64} color={item.qrColor} />
      </View>
      <View style={styles.tplText}>
        <AppText weight="bold" size={14} numberOfLines={1}>
          {item.title}
        </AppText>
        <AppText size={12} color={C.muted} numberOfLines={1}>
          {categoryLabel(item.category)}
        </AppText>
      </View>
    </Pressable>
  );
});

export default function HomeScreen() {
  const router = useRouter();
  const headerTop = useHeaderTop();
  const { openScanner } = useModals();

  const openCreate = useCallback(
    (type: QRType, value?: string) => {
      haptic('light');
      router.navigate({
        pathname: '/studio',
        params: value ? { initialType: type, initialValue: value } : { initialType: type },
      });
    },
    [router]
  );

  const handlePasteLink = useCallback(async () => {
    let text = '';
    try {
      text = (await Clipboard.getStringAsync()).trim();
    } catch {
      // Clipboard can be unavailable (e.g. denied on web); open an empty link form instead.
    }
    const looksLikeLink = /^https?:\/\/\S+$/i.test(text) || /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(text);
    openCreate('url', looksLikeLink ? (/^https?:/i.test(text) ? text : `https://${text}`) : undefined);
  }, [openCreate]);

  const handleTemplate = useCallback((t: QRTemplate) => openCreate(t.type), [openCreate]);

  const handleSeeAll = useCallback(() => router.navigate('/explore'), [router]);

  const renderTemplate = useCallback(
    ({ item }: { item: QRTemplate }) => <TemplateCard item={item} onPress={handleTemplate} />,
    [handleTemplate]
  );

  return (
    <View style={styles.screen}>
      <StatusScrim />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: headerTop }]}
        showsVerticalScrollIndicator={false}>
        <TopBlock below={212} />

        <View style={styles.header}>
          <View style={styles.brand}>
            <QrGlyph size={24} color={C.white} />
            <AppText weight="bold" size={18} color={C.white} tracking={-0.3}>
              QRLab
            </AppText>
          </View>
          <IconButton icon="scan-outline" label="Scan a code" variant="block" onPress={openScanner} />
        </View>

        <View style={styles.intro}>
          <AppText weight="bold" size={30} color={C.white} tracking={-0.9} accessibilityRole="header">
            Make a QR code
          </AppText>
          <AppText size={15} color={C.onBlockMuted} lineHeight={21}>
            Links, Wi‑Fi, contacts and more. Nothing leaves your phone.
          </AppText>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroText}>
            <AppText weight="bold" size={17} tracking={-0.3}>
              Start from a link
            </AppText>
            <AppText size={13} color={C.muted} lineHeight={18}>
              Paste a URL and your code is ready.
            </AppText>
            <Button
              title="Paste link"
              icon="clipboard-outline"
              size="sm"
              onPress={handlePasteLink}
              style={styles.heroButton}
            />
          </View>
          <View style={styles.heroQr}>
            <QrThumb value="https://qrlab.me" size={84} />
          </View>
        </View>

        <AppText weight="bold" size={17} tracking={-0.3} style={styles.h2} accessibilityRole="header">
          Quick create
        </AppText>
        <View style={styles.grid}>
          {QR_TYPES.map((t) => (
            <QuickTile key={t.id} item={t} onPress={openCreate} />
          ))}
        </View>

        <View style={styles.rowHeader}>
          <AppText weight="bold" size={17} tracking={-0.3} accessibilityRole="header">
            Templates
          </AppText>
          <Pressable onPress={handleSeeAll} accessibilityRole="link" hitSlop={10}>
            <AppText weight="semibold" size={14}>
              See all
            </AppText>
          </Pressable>
        </View>
        <FlatList
          horizontal
          data={FEATURED}
          keyExtractor={(t) => t.id}
          renderItem={renderTemplate}
          showsHorizontalScrollIndicator={false}
          style={styles.tplList}
          contentContainerStyle={styles.tplListContent}
          initialNumToRender={3}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.white,
  },
  content: {
    paddingHorizontal: PAD,
    paddingBottom: 28,
  },
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  intro: {
    marginTop: 20,
    gap: 8,
  },
  hero: {
    marginTop: 16,
    minHeight: 140,
    padding: 16,
    borderRadius: 20,
    backgroundColor: C.white,
    boxShadow: SHADOW_CARD,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroText: {
    flex: 1,
    gap: 6,
  },
  heroButton: {
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  heroQr: {
    width: 108,
    height: 108,
    borderRadius: 14,
    backgroundColor: C.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  h2: {
    marginTop: 24,
  },
  grid: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    flexGrow: 1,
    flexBasis: '30%',
    height: 78,
    padding: 12,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    backgroundColor: C.white,
    justifyContent: 'space-between',
  },
  tileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowHeader: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tplList: {
    marginTop: 12,
    marginRight: -PAD,
    marginLeft: -PAD,
  },
  tplListContent: {
    paddingHorizontal: PAD,
    gap: 12,
  },
  tplCard: {
    width: 150,
    padding: 10,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    backgroundColor: C.white,
    gap: 8,
  },
  tplThumb: {
    height: 84,
    borderRadius: 12,
    backgroundColor: C.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tplText: {
    gap: 2,
    paddingHorizontal: 2,
    paddingBottom: 2,
  },
  pressed: {
    opacity: 0.7,
  },
});
