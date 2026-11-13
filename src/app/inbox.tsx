import Ionicons from '@expo/vector-icons/Ionicons';
import { Href, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ds/app-text';
import { IconName, Pill } from '@/components/ds/controls';
import { Segmented } from '@/components/ds/segmented';
import { StatusScrim, TopBlock, useHeaderTop } from '@/components/ds/top-block';
import { C, PAD } from '@/constants/design';
import { haptic } from '@/services/preferences';

type Category = 'All' | 'Security' | 'Studio' | 'Templates' | 'Updates';
type Filter = 'all' | 'unread';

interface Notice {
  id: string;
  category: Exclude<Category, 'All'>;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: IconName;
  actionTitle: string;
  actionRoute: Href;
}

const CATEGORIES: Category[] = ['All', 'Security', 'Studio', 'Templates', 'Updates'];

const INITIAL_NOTICES: Notice[] = [
  {
    id: '1',
    category: 'Security',
    title: 'Private by design',
    message:
      'QR codes, Wi‑Fi passwords and contact cards are saved only on your device. Nothing is uploaded.',
    time: 'Just now',
    read: false,
    icon: 'shield-checkmark-outline',
    actionTitle: 'Read privacy policy',
    actionRoute: '/settings',
  },
  {
    id: '2',
    category: 'Studio',
    title: 'Print-ready exports',
    message: 'Save PNG at 2048 px or SVG at any size, with your colour, eye style and logo.',
    time: '2h ago',
    read: false,
    icon: 'image-outline',
    actionTitle: 'Open Create',
    actionRoute: '/studio',
  },
  {
    id: '3',
    category: 'Templates',
    title: '8 templates to start from',
    message: 'Business cards, menus, guest Wi‑Fi and more. Pick one and make it yours.',
    time: 'Yesterday',
    read: true,
    icon: 'grid-outline',
    actionTitle: 'Browse templates',
    actionRoute: '/explore',
  },
  {
    id: '4',
    category: 'Updates',
    title: 'QRLab 3.0 is here',
    message: 'A cleaner look, faster start-up and smoother scrolling.',
    time: '2 days ago',
    read: true,
    icon: 'sparkles-outline',
    actionTitle: 'About QRLab',
    actionRoute: '/settings',
  },
];

const NoticeCard = React.memo(function NoticeCard({
  item,
  onPress,
}: {
  item: Notice;
  onPress: (item: Notice) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.read ? '' : 'Unread. '}${item.title}. ${item.message} ${item.time}.`}
      accessibilityHint={item.actionTitle}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.icon}>
        <Ionicons name={item.icon} size={19} color={C.brand} />
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <AppText
            weight={item.read ? 'semibold' : 'bold'}
            size={15}
            lineHeight={20}
            style={styles.title}
            numberOfLines={1}>
            {item.title}
          </AppText>
          <AppText size={12} color={C.muted}>
            {item.time}
          </AppText>
          {!item.read ? <View style={styles.dot} /> : null}
        </View>
        <AppText size={13.5} lineHeight={19.5} color={C.muted}>
          {item.message}
        </AppText>
        <View style={styles.action}>
          <AppText weight="bold" size={13.5}>
            {item.actionTitle}
          </AppText>
          <Ionicons name="arrow-forward" size={14} color={C.ink} />
        </View>
      </View>
    </Pressable>
  );
});

export default function InboxScreen() {
  const router = useRouter();
  const headerTop = useHeaderTop();
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [category, setCategory] = useState<Category>('All');
  const [filter, setFilter] = useState<Filter>('all');

  const unread = useMemo(() => notices.filter((n) => !n.read).length, [notices]);

  const visible = useMemo(
    () =>
      notices.filter((n) => (filter === 'all' || !n.read) && (category === 'All' || n.category === category)),
    [notices, filter, category]
  );

  const markAllRead = useCallback(() => {
    haptic('light');
    setNotices((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleOpen = useCallback(
    (item: Notice) => {
      haptic('light');
      setNotices((prev) => prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)));
      router.navigate(item.actionRoute);
    },
    [router]
  );

  const filterOptions = useMemo(
    () =>
      [
        { value: 'all', label: 'All', badge: notices.length },
        { value: 'unread', label: 'Unread', badge: unread },
      ] as const,
    [notices.length, unread]
  );

  return (
    <View style={styles.screen}>
      <StatusScrim />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: headerTop }]}
        showsVerticalScrollIndicator={false}>
        <TopBlock below={124} />

        <View style={styles.header}>
          <AppText weight="bold" size={26} color={C.white} tracking={-0.8} accessibilityRole="header">
            Inbox
          </AppText>
          {unread > 0 ? (
            <Pressable
              onPress={markAllRead}
              accessibilityRole="button"
              style={({ pressed }) => [styles.markAll, pressed && styles.pressed]}>
              <AppText weight="semibold" size={13.5} color={C.white}>
                Mark all read
              </AppText>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.segment}>
          <Segmented
            tone="block"
            options={filterOptions}
            value={filter}
            onChange={setFilter}
            accessibilityLabel="Show"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          accessibilityRole="tablist"
          accessibilityLabel="Categories"
          style={styles.chips}
          contentContainerStyle={styles.chipsContent}>
          {CATEGORIES.map((c) => (
            <Pill key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
          ))}
        </ScrollView>

        {visible.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="mail-open-outline" size={24} color={C.strong} />
            </View>
            <AppText weight="bold" size={16}>
              {filter === 'unread' ? 'You’re all caught up' : 'Nothing here yet'}
            </AppText>
            <AppText size={13.5} color={C.muted} align="center">
              {filter === 'unread' ? 'There are no unread notices.' : `No notices in ${category}.`}
            </AppText>
          </View>
        ) : (
          <View style={styles.list}>
            {visible.map((n) => (
              <NoticeCard key={n.id} item={n} onPress={handleOpen} />
            ))}
          </View>
        )}
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
  markAll: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: C.onBlockFillSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segment: {
    marginTop: 16,
  },
  chips: {
    marginTop: 36,
    marginHorizontal: -PAD,
    flexGrow: 0,
  },
  chipsContent: {
    paddingHorizontal: PAD,
    gap: 8,
  },
  list: {
    marginTop: 16,
    gap: 12,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    backgroundColor: C.white,
    flexDirection: 'row',
    gap: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.brand,
  },
  action: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
