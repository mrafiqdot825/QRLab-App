import { CircularSelectorRow } from "@/components/morrow/circular-selector-row";
import { GuidanceRowCard } from "@/components/morrow/guidance-row-card";
import { HeroHeaderBlock } from "@/components/morrow/hero-header-block";
import { HeroPromoCard } from "@/components/morrow/hero-promo-card";
import { PastelFeatureTile } from "@/components/morrow/pastel-feature-tile";
import { SectionCard } from "@/components/morrow/section-card";
import { TopBar } from "@/components/morrow/top-bar";
import { GlassContainer } from "@/components/ui/glass-container";
import { FeaturedTemplatesStrip } from "@/features/home/components/featured-templates-strip";
import { HomeHeroCard } from "@/features/home/components/home-hero-card";
import { HomeProBanner } from "@/features/home/components/home-pro-banner";
import { QRType } from "@/types/qr";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const [selectedFormat, setSelectedFormat] = useState<QRType>("url");

  const handleSelectType = useCallback(
    (type: QRType) => {
      setSelectedFormat(type);
      router.navigate({
        pathname: "/studio",
        params: { initialType: type },
      });
    },
    [router],
  );

  const handleOpenStudio = useCallback(() => {
    router.navigate("/studio");
  }, [router]);

  const handleOpenExplore = useCallback(() => {
    router.navigate("/explore");
  }, [router]);

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
          scrollEventThrottle={16}
          removeClippedSubviews={Platform.OS !== "web"}
          overScrollMode="never"
        >
          <View className="w-full max-w-[640px]">
            {/* TOP BAR */}
            <TopBar
              title="QRLab"
              actionIcon="person-outline"
              onPressAction={handleOpenSettings}
              showSearch={true}
              onPressSearch={handleOpenExplore}
            />

            {/* HERO HEADER BLOCK */}
            <HeroHeaderBlock
              headlineLine1="Make QR codes,"
              headlineLine2="beautifully."
              subtitle="Craft scan-stopping, on-brand QR codes with live interactive preview, custom eye shapes, curated editorial palettes, and infinite-resolution vector SVG exports. 100% private & on-device."
              showBotanical={true}
            />

            {/* FORMAT CHECK-IN ROW (Mood check-in pattern) */}
            <SectionCard
              title="Format check-in"
              showChevron={true}
              onPressAction={handleOpenStudio}
              actionText=""
            >
              <CircularSelectorRow
                selectedId={selectedFormat}
                onSelect={handleSelectType}
              />
            </SectionCard>

            {/* HERO PROMO CARD ("A little space for yourself" pattern) */}
            <HeroPromoCard
              titleLine1="A little space"
              titleLine2="for your brand"
              subtitle="Pause. Create. High-res vector codes crafted effortlessly."
              onPress={handleOpenStudio}
            />

            {/* PASTEL FEATURE TILES (2x2 Grid) */}
            <View className="w-full my-3">
              <View className="flex-row gap-3 mb-3">
                <PastelFeatureTile
                  title="Website Link"
                  description="Direct visitors to any webpage or link."
                  variant="lavender"
                  illustration="leaf"
                  onPress={() => handleSelectType("url")}
                />
                <PastelFeatureTile
                  title="Guest Wi-Fi"
                  description="Share credentials with seamless zero-typing."
                  variant="sage"
                  illustration="flower"
                  onPress={() => handleSelectType("wifi")}
                />
              </View>

              <View className="flex-row gap-3">
                <PastelFeatureTile
                  title="Digital vCard"
                  description="Instant contact exchange for professionals."
                  variant="butter"
                  illustration="branch"
                  onPress={() => handleSelectType("vcard")}
                />
                <PastelFeatureTile
                  title="Custom Text"
                  description="Encode instructions, notes, or messages."
                  variant="peach"
                  illustration="crescent"
                  onPress={() => handleSelectType("text")}
                />
              </View>
            </View>

            {/* GUIDANCE ROW CARD ("Not sure where to start?") */}
            <GuidanceRowCard
              title="Not sure where to start?"
              subtitle="Explore pre-designed templates and get personalized recommendations."
              icon="book-outline"
              iconBgColor="#D9D4F5"
              onPress={handleOpenExplore}
            />

            {/* LIVE QR INTERACTIVE HERO CARD */}
            <HomeHeroCard />

            {/* CURATED TEMPLATES STRIP */}
            <FeaturedTemplatesStrip />

            {/* PRO VECTOR BANNER */}
            <HomeProBanner />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GlassContainer>
  );
}
