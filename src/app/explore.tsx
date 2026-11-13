import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { AppText } from '@/components/ds/app-text';
import { IconButton, Pill } from '@/components/ds/controls';
import { QrThumb } from '@/components/ds/qr-thumb';
import { StatusScrim, TopBlock, useHeaderTop } from '@/components/ds/top-block';
import { C, FONT, PAD, SHADOW_CARD } from '@/constants/design';
import { QR_TYPE_LABEL } from '@/constants/qr-types';
import {
  categoryLabel,
  QRTemplate,
  TEMPLATE_CATEGORIES,
  TEMPLATES_LIST,
} from '@/features/templates/constants/templates';
import { haptic } from '@/services/preferences';

const GAP = 12;

const TemplateCard = React.memo(function TemplateCard({
  item,
  width,
  onPress,
}: {
  item: QRTemplate;
  width: number;
  onPress: (t: QRTemplate) => void;
}) {
  const category = categoryLabel(item.category);
  const type = QR_TYPE_LABEL[item.type];
  const meta = category === type ? category : `${category} · ${type}`;
  return (
    <Pressable
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}. ${meta.replace(' · ', ', ')}. Use template`}
      style={({ pressed }) => [styles.card, { width }, pressed && styles.pressed]}>
      <View style={styles.thumb}>
        <QrThumb value={item.sampleValue} size={76} color={item.qrColor} />
      </View>
      <View style={styles.cardText}>
        <AppText weight="bold" size={14} lineHeight={18} numberOfLines={2} style={styles.cardTitle}>
          {item.title}
        </AppText>
        <AppText size={12} color={C.muted} numberOfLines={1}>
          {meta}
        </AppText>
      </View>
    </Pressable>
  );
});

export default function TemplatesScreen() {
  const router = useRouter();
  const headerTop = useHeaderTop();
  const { width: windowWidth } = useWindowDimensions();
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');

  const cardWidth = Math.floor((windowWidth - PAD * 2 - GAP) / 2);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEMPLATES_LIST.filter((t) => {
      if (category !== 'All' && t.category !== category) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        categoryLabel(t.category).toLowerCase().includes(q)
      );
    });
  }, [category, query]);

  const handleUse = useCallback(
    (t: QRTemplate) => {
      haptic('light');
      router.navigate({ pathname: '/studio', params: { initialType: t.type } });
    },
    [router]
  );

  const selectCategory = useCallback((c: string) => {
    haptic('light');
    setCategory(c);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: QRTemplate }) => <TemplateCard item={item} width={cardWidth} onPress={handleUse} />,
    [cardWidth, handleUse]
  );

  // The header spans the full width so the black block reaches both screen edges.
  const header = (
    <View style={[styles.listHeader, { paddingTop: headerTop }]}>
      <TopBlock below={86} />
      <View style={styles.header}>
        <AppText weight="bold" size={26} color={C.white} tracking={-0.8} accessibilityRole="header">
          Templates
        </AppText>
        <AppText size={13} color={C.onBlockMuted}>
          {TEMPLATES_LIST.length} ready to use
        </AppText>
      </View>

      <View style={styles.search}>
        <Ionicons name="search" size={19} color={C.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search templates"
          placeholderTextColor={C.inactive}
          selectionColor={C.brand}
          cursorColor={C.brand}
          returnKeyType="search"
          autoCorrect={false}
          accessibilityLabel="Search templates"
          style={styles.searchInput}
        />
        {query ? (
          <IconButton
            icon="close-circle"
            label="Clear search"
            variant="plain"
            color={C.inactive}
            onPress={() => setQuery('')}
          />
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        accessibilityRole="tablist"
        accessibilityLabel="Categories"
        style={styles.chips}
        contentContainerStyle={styles.chipsContent}
        keyboardShouldPersistTaps="handled">
        {TEMPLATE_CATEGORIES.map((c) => (
          <Pill
            key={c}
            label={categoryLabel(c)}
            selected={category === c}
            onPress={() => selectCategory(c)}
          />
        ))}
      </ScrollView>
    </View>
  );

  const empty = (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name="search-outline" size={24} color={C.strong} />
      </View>
      <AppText weight="bold" size={16}>
        No templates found
      </AppText>
      <AppText size={13.5} color={C.muted} align="center">
        Try another word or pick a different category.
      </AppText>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusScrim />
      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        renderItem={renderItem}
        numColumns={2}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
      />
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
  listHeader: {
    marginHorizontal: -PAD,
    paddingHorizontal: PAD,
  },
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  search: {
    marginTop: 16,
    height: 52,
    paddingLeft: 14,
    paddingRight: 4,
    borderRadius: 16,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    boxShadow: SHADOW_CARD,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontFamily: FONT.regular,
    fontSize: 15,
    color: C.ink,
    paddingVertical: 0,
  },
  chips: {
    marginTop: 16,
    marginHorizontal: -PAD,
    marginBottom: 16,
    flexGrow: 0,
  },
  chipsContent: {
    paddingHorizontal: PAD,
    gap: 8,
  },
  column: {
    gap: GAP,
    marginBottom: GAP,
  },
  card: {
    padding: 10,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    backgroundColor: C.white,
    gap: 10,
  },
  thumb: {
    height: 112,
    borderRadius: 12,
    backgroundColor: C.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    gap: 3,
    paddingHorizontal: 2,
    paddingBottom: 4,
  },
  cardTitle: {
    minHeight: 36,
  },
  empty: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 8,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  pressed: {
    opacity: 0.7,
  },
});
