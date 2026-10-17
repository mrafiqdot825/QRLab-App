import { HeroHeaderBlock } from "@/components/morrow/hero-header-block";
import { TopBar } from "@/components/morrow/top-bar";
import { GlassContainer } from "@/components/ui/glass-container";
import { CategoryBar } from "@/features/templates/components/category-bar";
import { TemplateCard } from "@/features/templates/components/template-card";
import {
  QRTemplate,
  TEMPLATES_LIST,
} from "@/features/templates/constants/templates";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExploreScreen() {
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState("All");

  const filteredTemplates = useMemo(() => {
    if (selectedCat === "All") return TEMPLATES_LIST;
    return TEMPLATES_LIST.filter((t) => t.category === selectedCat);
  }, [selectedCat]);

  const handleUseTemplate = useCallback(
    (template: QRTemplate) => {
      router.navigate({
        pathname: "/studio",
        params: { initialType: template.type },
      });
    },
    [router],
  );

  const handleOpenSettings = useCallback(() => {
    router.navigate("/settings");
  }, [router]);

  const renderItem = useCallback(
    ({ item }: { item: QRTemplate }) => (
      <View
        style={{ width: "100%", maxWidth: 640, alignSelf: "center" }}
        className="mb-4"
      >
        <TemplateCard template={item} onUseTemplate={handleUseTemplate} />
      </View>
    ),
    [handleUseTemplate],
  );

  const keyExtractor = useCallback((item: QRTemplate) => item.id, []);

  const ListHeaderComponent = useMemo(
    () => (
      <View style={{ width: "100%", maxWidth: 640, alignSelf: "center" }}>
        {/* TOP BAR */}
        <TopBar
          title="QRLab"
          actionIcon="person-outline"
          onPressAction={handleOpenSettings}
        />

        {/* HERO HEADER BLOCK (Matches reference screen 2) */}
        <HeroHeaderBlock
          eyebrow="Explore practices"
          headlineLine1="Small steps,"
          headlineLine2="softer days."
          subtitle="Simple practices to support a calmer, on-brand presence."
          showBotanical={true}
        />

        {/* Category Filter Chips */}
        <CategoryBar
          selectedCategory={selectedCat}
          onSelectCategory={setSelectedCat}
        />
        <View className="h-3" />
      </View>
    ),
    [selectedCat, handleOpenSettings],
  );

  return (
    <GlassContainer>
      <SafeAreaView className="flex-1">
        <FlatList
          data={filteredTemplates}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 130,
          }}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={30}
          windowSize={7}
          removeClippedSubviews={Platform.OS !== "web"}
        />
      </SafeAreaView>
    </GlassContainer>
  );
}
