import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HeroHeaderBlock } from "@/components/morrow/hero-header-block";
import { TopBar } from "@/components/morrow/top-bar";
import { GlassBadge } from "@/components/ui/glass-badge";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassChip } from "@/components/ui/glass-chip";
import { GlassContainer } from "@/components/ui/glass-container";
import { Palette } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { withAlpha } from "@/utils/color";

interface NotificationItem {
  id: string;
  category: "All" | "Studio" | "Security" | "Templates" | "Updates";
  title: string;
  badge: string;
  message: string;
  time: string;
  read: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  accentColor: string;
  actionTitle?: string;
  actionRoute?: string;
  actionParams?: Record<string, string>;
}

const INBOX_CATEGORIES: (
  | "All"
  | "Studio"
  | "Security"
  | "Templates"
  | "Updates"
)[] = ["All", "Studio", "Security", "Templates", "Updates"];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    category: "Security",
    title: "Zero Cloud Storage Guarantee",
    badge: "PRIVACY",
    message:
      "All your generated QR codes, encrypted Wi-Fi passwords, and digital vCards remain strictly on your local device. No data is ever transmitted to remote servers.",
    time: "Just now",
    read: false,
    icon: "shield-checkmark",
    accentColor: Palette.leaf,
    actionTitle: "Review Policy",
    actionRoute: "/settings",
  },
  {
    id: "2",
    category: "Studio",
    title: "High-Resolution Vector Engine",
    badge: "HD EXPORT",
    message:
      "Create print-ready 300 DPI vector QR codes in PNG and SVG with rounded eye geometries and embedded brand logos.",
    time: "2 hours ago",
    read: false,
    icon: "sparkles",
    accentColor: Palette.plum,
    actionTitle: "Open Studio",
    actionRoute: "/studio",
  },
  {
    id: "3",
    category: "Templates",
    title: "Handcrafted Template Collection",
    badge: "COLLECTION",
    message:
      "Explore pre-styled luxury light templates for executive business cards, dining menus, and guest Wi-Fi access.",
    time: "Yesterday",
    read: true,
    icon: "grid",
    accentColor: Palette.peach,
    actionTitle: "Browse Templates",
    actionRoute: "/explore",
  },
  {
    id: "4",
    category: "Updates",
    title: "QRLab v3.0 Released",
    badge: "RELEASE",
    message:
      "Your production release is fully equipped with React 19 concurrent responsiveness and butter-smooth 120fps hardware scrolling.",
    time: "2 days ago",
    read: true,
    icon: "rocket",
    accentColor: Palette.periwinkle,
    actionTitle: "About QRLab",
    actionRoute: "/settings",
  },
];

export default function InboxScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | "Studio" | "Security" | "Templates" | "Updates"
  >("All");
  const [filterMode, setFilterMode] = useState<"all" | "unread">("all");

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleToggleRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  }, []);

  const filteredItems = useMemo(() => {
    return notifications.filter((item) => {
      if (filterMode === "unread" && item.read) return false;
      if (selectedCategory !== "All" && item.category !== selectedCategory)
        return false;
      return true;
    });
  }, [notifications, filterMode, selectedCategory]);

  return (
    <GlassContainer>
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            alignItems: "center",
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          removeClippedSubviews={Platform.OS !== "web"}
          overScrollMode="never"
        >
          <View className="w-full max-w-[640px]">
            {/* Top Bar with Wordmark */}
            <TopBar title="QRLab" />

            {/* Signature Morrow Hero Header Block */}
            <HeroHeaderBlock
              eyebrow="Activity & library"
              headlineLine1="Notices &"
              headlineLine2="updates."
              subtitle="System notices, feature announcements, and privacy advisories."
            />

            {unreadCount > 0 && (
              <View className="flex-row justify-end mb-2">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Mark all notifications as read"
                  onPress={handleMarkAllRead}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }}
                  className="px-4 py-1.5 rounded-none border active:opacity-70 shadow-sm"
                >
                  <Text className="text-plum text-xs font-bold">
                    Mark all as read
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Quick Unread Status Strip */}
            <View className="flex-row items-center justify-between my-2">
              <View className="flex-row items-center gap-2">
                <GlassBadge
                  label={unreadCount > 0 ? `${unreadCount} UNREAD` : "ALL READ"}
                  variant="primary"
                />
                <Text className="text-on-surface-variant text-xs font-medium">
                  {notifications.length} Total Notices
                </Text>
              </View>

              <View className="flex-row items-center gap-1">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Show all notices"
                  onPress={() => setFilterMode("all")}
                  style={{
                    backgroundColor:
                      filterMode === "all" ? colors.surface : "transparent",
                    borderColor:
                      filterMode === "all" ? colors.border : "transparent",
                  }}
                  className="px-3 py-1 rounded-none border"
                >
                  <Text
                    style={{
                      color:
                        filterMode === "all"
                          ? colors.primaryText
                          : colors.secondaryText,
                    }}
                    className={`text-xs ${filterMode === "all" ? "font-bold" : "font-medium"}`}
                  >
                    All
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Show unread notices only"
                  onPress={() => setFilterMode("unread")}
                  style={{
                    backgroundColor:
                      filterMode === "unread" ? colors.surface : "transparent",
                    borderColor:
                      filterMode === "unread" ? colors.border : "transparent",
                  }}
                  className="px-3 py-1 rounded-none border"
                >
                  <Text
                    style={{
                      color:
                        filterMode === "unread"
                          ? colors.primaryText
                          : colors.secondaryText,
                    }}
                    className={`text-xs ${filterMode === "unread" ? "font-bold" : "font-medium"}`}
                  >
                    Unread ({unreadCount})
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Category Filter Chips Bar (Identical styling to Explore & Home) */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="w-full my-2"
              contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
            >
              {INBOX_CATEGORIES.map((cat) => (
                <GlassChip
                  key={cat}
                  label={cat}
                  selected={selectedCategory === cat}
                  onPress={() => setSelectedCategory(cat)}
                />
              ))}
            </ScrollView>

            <View className="h-2" />

            {/* Notifications Feed */}
            {filteredItems.length === 0 ? (
              <GlassCard className="p-8 items-center justify-center my-6 gap-3">
                <View
                  style={{ backgroundColor: colors.secondaryBackground }}
                  className="w-16 h-16 rounded-3xl items-center justify-center"
                >
                  <Ionicons
                    name="mail-open-outline"
                    size={30}
                    color={colors.secondaryText}
                  />
                </View>
                <Text className="text-on-surface text-lg font-serif font-bold text-center">
                  No Notices Found
                </Text>
                <Text className="text-on-surface-variant text-xs text-center max-w-[260px] leading-5">
                  {filterMode === "unread"
                    ? "You have caught up with all unread messages!"
                    : `No notices found in the "${selectedCategory}" category.`}
                </Text>
              </GlassCard>
            ) : (
              <View className="gap-3.5">
                {filteredItems.map((item) => (
                  <GlassCard
                    key={item.id}
                    onPress={() => {
                      handleToggleRead(item.id);
                      if (item.actionRoute) {
                        router.navigate({
                          pathname: item.actionRoute as any,
                          params: item.actionParams,
                        });
                      }
                    }}
                    className={`p-5 gap-3.5 relative overflow-hidden ${
                      !item.read ? "border-l-4 border-l-plum" : ""
                    }`}
                  >
                    <View className="flex-row items-start justify-between gap-3">
                      <View className="flex-row items-start gap-3.5 flex-1">
                        {/* Consistent 44x44 icon badge matching QuickActionsBar and TemplateCard */}
                        <View
                          style={{
                            backgroundColor: withAlpha(item.accentColor, 0.14),
                          }}
                          className="w-11 h-11 rounded-2xl items-center justify-center shrink-0 mt-0.5"
                        >
                          <Ionicons
                            name={item.icon}
                            size={22}
                            color={item.accentColor}
                          />
                        </View>

                        <View className="flex-1 gap-1">
                          <View className="flex-row items-center justify-between gap-2">
                            <Text
                              className="text-on-surface text-base font-extrabold tracking-tight flex-1"
                              numberOfLines={1}
                            >
                              {item.title}
                            </Text>
                            <GlassBadge label={item.badge} variant="primary" />
                          </View>
                          <Text className="text-on-surface-variant text-xs leading-5">
                            {item.message}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Footer Row */}
                    <View
                      style={{ borderColor: colors.border }}
                      className="flex-row items-center justify-between pt-2.5 border-t"
                    >
                      <View className="flex-row items-center gap-1.5">
                        <Ionicons
                          name="time-outline"
                          size={13}
                          color={colors.secondaryText}
                        />
                        <Text className="text-on-surface-variant text-[11px] font-medium">
                          {item.time}
                        </Text>
                      </View>

                      {item.actionRoute ? (
                        <View className="flex-row items-center gap-1">
                          <Text className="text-xs font-bold text-plum">
                            {item.actionTitle || "Open"}
                          </Text>
                          <Ionicons
                            name="arrow-forward"
                            size={13}
                            color={Palette.plum}
                          />
                        </View>
                      ) : (
                        <Text className="text-[11px] text-on-surface-variant">
                          {item.read ? "Read" : "Tap to mark read"}
                        </Text>
                      )}
                    </View>
                  </GlassCard>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GlassContainer>
  );
}
